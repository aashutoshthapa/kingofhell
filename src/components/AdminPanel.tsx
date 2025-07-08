import React from 'react'
import { RefreshCw, Shield } from 'lucide-react'

interface AdminPanelProps {
  darkMode: boolean
  onRefresh: () => void
  isRefreshing: boolean
  onLogout: () => void
}

export default function AdminPanel({ darkMode, onRefresh, isRefreshing, onLogout }: AdminPanelProps) {
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 mb-6`}>
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Admin Control Panel
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Unlimited refresh access and advanced controls for Google Sheets data sync
            </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm"
          >
            <Shield className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Admin Controls */}
        <div className="grid grid-cols-1 gap-6">
          {/* Unlimited Refresh */}
          <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Unlimited Data Refresh
            </h4>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Bypass the 1-hour cooldown restriction and refresh data as many times as needed.
            </p>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 text-sm w-full"
            >
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>{isRefreshing ? 'Refreshing Data...' : 'Force Refresh Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}