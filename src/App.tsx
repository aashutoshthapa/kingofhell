import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import MembersTable from './components/MembersTable'
import AdminPanel from './components/AdminPanel'
import { useMembers } from './hooks/useMembers'
import { useGoogleSheets } from './hooks/useGoogleSheets'
import { Users, RefreshCw } from 'lucide-react'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const { members, loading, error, refetch } = useMembers()
  const { loading: sheetsLoading, syncFromGoogleSheets } = useGoogleSheets()
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [canRefresh, setCanRefresh] = useState(true)

  const toggleDarkMode = () => setDarkMode(!darkMode)

  // Load last refresh time from localStorage on component mount
  useEffect(() => {
    const savedLastRefresh = localStorage.getItem('lastGoogleSheetsRefresh')
    if (savedLastRefresh) {
      const lastRefreshDate = new Date(savedLastRefresh)
      setLastRefresh(lastRefreshDate)
      
      // Check if an hour has passed (only for non-admin users)
      if (!isAdminLoggedIn) {
        const hoursSinceLastRefresh = (Date.now() - lastRefreshDate.getTime()) / (1000 * 60 * 60)
        if (hoursSinceLastRefresh < 1) {
          setCanRefresh(false)
        }
      }
    }
  }, [isAdminLoggedIn])

  // Update refresh availability every minute (only for non-admin users)
  useEffect(() => {
    if (isAdminLoggedIn) {
      setCanRefresh(true)
      return
    }

    const interval = setInterval(() => {
      if (lastRefresh && !canRefresh) {
        const hoursSinceLastRefresh = (Date.now() - lastRefresh.getTime()) / (1000 * 60 * 60)
        
        if (hoursSinceLastRefresh >= 1) {
          setCanRefresh(true)
        }
      }
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [lastRefresh, canRefresh, isAdminLoggedIn])

  // Format relative time
  const getRelativeTime = (date: Date) => {
    const now = Date.now()
    const diffMs = now - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffMinutes < 1) {
      return 'just now'
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
    } else {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    }
  }

  const handleDataUpdated = () => {
    refetch()
  }

  const handleRefresh = async () => {
    // Admin can always refresh, regular users need to respect cooldown
    if (!isAdminLoggedIn && !canRefresh) return
    
    setRefreshing(true)
    try {
      const now = new Date()
      setLastRefresh(now)
      
      // Only set cooldown for non-admin users
      if (!isAdminLoggedIn) {
        setCanRefresh(false)
      }
      
      localStorage.setItem('lastGoogleSheetsRefresh', now.toISOString())

      // Sync from Google Sheets
      await syncFromGoogleSheets()
      await refetch()
    } catch (err) {
      console.error('Failed to refresh data:', err)
    } finally {
      setRefreshing(false)
    }
  }

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdminLoggedIn(true)
      setCanRefresh(true) // Remove cooldown restrictions for admin
    }
  }

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false)
    // Reset cooldown restrictions for regular user
    const savedLastRefresh = localStorage.getItem('lastGoogleSheetsRefresh')
    if (savedLastRefresh) {
      const lastRefreshDate = new Date(savedLastRefresh)
      const hoursSinceLastRefresh = (Date.now() - lastRefreshDate.getTime()) / (1000 * 60 * 60)
      setCanRefresh(hoursSinceLastRefresh >= 1)
    }
  }

  const isLoading = loading || sheetsLoading || refreshing
  const canUserRefresh = isAdminLoggedIn || canRefresh

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading clan data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Please make sure Supabase is connected and the database is set up.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Panel - Only show when admin is logged in */}
        {isAdminLoggedIn && (
          <AdminPanel 
            darkMode={darkMode} 
            onDataUpdated={handleDataUpdated}
            onRefresh={handleRefresh}
            isRefreshing={refreshing}
            onLogout={handleAdminLogout}
          />
        )}

        {/* Members Table or Empty State */}
        {members.length > 0 ? (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden`}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Clan Members ({members.length})
                </h3>
                <div className="flex items-center space-x-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Live data from Google Sheets with automatic ticket calculation
                  </p>
                  {lastRefresh && (
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Refreshed {getRelativeTime(lastRefresh)}
                    </p>
                  )}
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                  Data updates every 6 hours • {isAdminLoggedIn ? 'Admin: Unlimited refresh' : 'Manual refresh limited to once per hour'}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading || !canUserRefresh}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isLoading || !canUserRefresh
                    ? darkMode 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    : isAdminLoggedIn
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">
                  {isLoading ? 'Refreshing...' : !canUserRefresh ? 'Cooldown' : isAdminLoggedIn ? 'Admin Refresh' : 'Refresh'}
                </span>
              </button>
            </div>
            <MembersTable members={members} darkMode={darkMode} />
          </div>
        ) : (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-12 text-center`}>
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No Clan Data Found
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-md mx-auto`}>
              No clan members are currently loaded in the database. Click refresh to import your clan data from Google Sheets.
            </p>
            <button
              onClick={handleRefresh}
              disabled={isLoading || !canUserRefresh}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 mx-auto ${
                isLoading || !canUserRefresh
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isAdminLoggedIn
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">
                {isLoading ? 'Loading Data...' : !canUserRefresh ? 'Cooldown Active' : isAdminLoggedIn ? 'Admin Load Data' : 'Load Data'}
              </span>
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App