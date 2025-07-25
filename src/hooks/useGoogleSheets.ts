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
  bonusTickets: number // <-- add this
  discordUsername?: string
  disqualified?: string
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
        
        if (columns.length >= 21 && columns[0] && columns[1]) { // now require at least 21 columns
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
            cwlTickets: parseInt(columns[9]) || 0,
            bonusTickets: parseInt(columns[20]) || 0, // <-- column U
            discordUsername: columns[16]?.trim() || "",
            disqualified: columns[17]?.trim() || ""
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
        
        // Calculate ticket values
        const trophyTickets = calculateTrophyTickets(member.trophy);
        const donationTickets = calculateDonationTickets(member.donation);
        const clanGamesTickets = calculateClanGamesTickets(member.clanGames);
        const raidTickets = calculateRaidTickets(member.capGold);
        const perfectWarTickets = member.perfectWarTickets || 0;
        const noWarMissTickets = member.noWarMissTickets || 0;
        const perfectMonthTickets = member.perfectMonthTickets || 0;
        const cwlTickets = member.cwlTickets || 0;
        const totalTickets = trophyTickets + donationTickets + clanGamesTickets + raidTickets + perfectWarTickets + noWarMissTickets + perfectMonthTickets + cwlTickets + (member.bonusTickets || 0);
        
        return {
          player_name: member.playerName,
          player_tag: member.playerTag,
          current_trophies: member.trophy,
          current_donations: member.donation,
          current_capital_gold: member.capGold,
          current_clan_games: member.clanGames,
          bonus_tickets: member.bonusTickets, // <-- upsert to DB
          
          // Map discordUsername from sheet to discord_handle in DB
          discord_handle: member.discordUsername || existingData?.discord_handle || null,
          total_donations: Math.max(member.donation, existingData?.total_donations || 0),
          clan_games_points: member.clanGames,
          total_clan_games: Math.max(member.clanGames, existingData?.total_clan_games || 0),
          perfect_wars: perfectWarTickets,
          wars_missed: noWarMissTickets,
          perfect_month: perfectMonthTickets,
          cwl_performance: cwlTickets,
          
          // Store ticket values in the database
          trophy_tickets: trophyTickets,
          donation_tickets: donationTickets,
          clan_games_tickets: clanGamesTickets,
          raid_tickets: raidTickets,
          total_tickets: totalTickets,
          
          // Achievement totals for tracking
          total_donations_achievement: Math.max(member.donation, existingData?.total_donations_achievement || 0),
          total_capital_gold_achievement: Math.max(member.capGold, existingData?.total_capital_gold_achievement || 0),
          total_clan_games_achievement: Math.max(member.clanGames, existingData?.total_clan_games_achievement || 0),
          
          // Reset tracking
          last_reset_donations: existingData?.last_reset_donations || 0,
          last_reset_capital_gold: existingData?.last_reset_capital_gold || 0,
          last_reset_clan_games: existingData?.last_reset_clan_games || 0,
          last_reset_date: existingData?.last_reset_date || new Date().toISOString(),
          
          disqualified: member.disqualified ? member.disqualified : "false",
          
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

      // Delete members not present in the latest sheet
      const sheetTags = new Set(members.map(m => m.playerTag));
      const dbTags = new Set((existingMembers || []).map(m => m.player_tag));
      const tagsToDelete = Array.from(dbTags).filter(tag => !sheetTags.has(tag));
      if (tagsToDelete.length > 0) {
        await supabase
          .from('clan_members')
          .delete()
          .in('player_tag', tagsToDelete);
      }

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