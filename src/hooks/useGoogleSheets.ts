import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { calculateTrophyTickets, calculateDonationTickets, calculateClanGamesTickets, calculateRaidTickets } from '../utils/statsCalculator'

export interface SheetMember {
  playerName: string
  playerTag: string
  trophy: number
  clanGames: number
  donation: number
  capGold: number
  perfectWarTickets: number
  noWarMissTickets: number
  perfectMonthTickets: number
  cwlTickets: number
  discordUsername?: string
}

export function useGoogleSheets() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const syncFromGoogleSheets = async () => {
    try {
      setLoading(true)
      setError(null)

      // Convert Google Sheets URL to CSV export URL
      const sheetId = '1QIJz1pr_HIvqv1DzIq9xLdPygJzyv1tNHQA0EgsDGhE'
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`

      // Fetch CSV data
      const response = await fetch(csvUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch sheet data: ${response.status}`)
      }

      const csvText = await response.text()
      const lines = csvText.split('\n')
      
      // Skip header row (A2) and start from data rows (A3+)
      const dataLines = lines.slice(2).filter(line => line.trim())
      
      // Use Map to ensure unique player_tag entries
      const membersMap = new Map<string, SheetMember>()
      
      for (const line of dataLines) {
        // Parse CSV line (handle commas in quoted fields)
        const columns = parseCSVLine(line)
        
        if (columns.length >= 10 && columns[0] && columns[1]) {
          const member: SheetMember = {
            playerName: columns[0].trim(),
            playerTag: columns[1].trim(),
            trophy: parseInt(columns[2]) || 0,
            clanGames: parseInt(columns[3]) || 0,
            donation: parseInt(columns[4]) || 0,
            capGold: parseInt(columns[5]) || 0,
            perfectWarTickets: parseInt(columns[6]) || 0,
            noWarMissTickets: parseInt(columns[7]) || 0,
            perfectMonthTickets: parseInt(columns[8]) || 0,
            cwlTickets: parseInt(columns[9]) || 0
          }
          
          // Only add if we have valid player name and tag
          if (member.playerName && member.playerTag) {
            // Use Map to automatically handle duplicates - latest entry overwrites previous
            membersMap.set(member.playerTag, member)
          }
        }
      }

      // Convert Map values back to array
      const members = Array.from(membersMap.values())

      if (members.length === 0) {
        throw new Error('No valid member data found in the sheet')
      }

      // Get existing members from database to preserve manual data
      const { data: existingMembers } = await supabase
        .from('clan_members')
        .select('*')

      const existingMembersMap = new Map(
        existingMembers?.map(member => [member.player_tag, member]) || []
      )

      // Convert sheet data to database format
      const updatedMembers = members.map(member => {
        const existingData = existingMembersMap.get(member.playerTag)
        
        return {
          player_name: member.playerName,
          player_tag: member.playerTag,
          current_trophies: member.trophy,
          total_trophies: Math.max(member.trophy, existingData?.total_trophies || 0),
          current_donations: member.donation,
          current_capital_gold: member.capGold,
          current_clan_games: member.clanGames,
          
          // Map discordUsername from sheet to discord_handle in DB
          discord_handle: member.discordUsername || existingData?.discord_handle || null,
          total_donations: Math.max(member.donation, existingData?.total_donations || 0),
          clan_games_points: member.clanGames,
          total_clan_games: Math.max(member.clanGames, existingData?.total_clan_games || 0),
          perfect_wars: member.perfectWarTickets,
          wars_missed: member.noWarMissTickets,
          perfect_month: member.perfectMonthTickets,
          cwl_performance: member.cwlTickets,
          
          // Use GHIJ as direct ticket values (override calculated values)
          trophy_tickets: calculateTrophyTickets(member.trophy),
          donation_tickets: calculateDonationTickets(member.donation),
          clan_games_tickets: calculateClanGamesTickets(member.clanGames),
          raid_tickets: calculateRaidTickets(member.capGold),
          
          // Achievement totals for tracking
          total_donations_achievement: Math.max(member.donation, existingData?.total_donations_achievement || 0),
          total_capital_gold_achievement: Math.max(member.capGold, existingData?.total_capital_gold_achievement || 0),
          total_clan_games_achievement: Math.max(member.clanGames, existingData?.total_clan_games_achievement || 0),
          
          // Reset tracking
          last_reset_donations: existingData?.last_reset_donations || 0,
          last_reset_capital_gold: existingData?.last_reset_capital_gold || 0,
          last_reset_clan_games: existingData?.last_reset_clan_games || 0,
          last_reset_date: existingData?.last_reset_date || new Date().toISOString(),
          
          updated_at: new Date().toISOString()
        }
      })

      // Batch upsert all members
      const { error: upsertError } = await supabase
        .from('clan_members')
        .upsert(updatedMembers, { 
          onConflict: 'player_tag',
          ignoreDuplicates: false 
        })

      if (upsertError) throw upsertError

      return { 
        syncedMembers: updatedMembers.length,
        members: updatedMembers
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync Google Sheets data'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    syncFromGoogleSheets
  }
}

// Helper function to parse CSV line with proper comma handling
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}