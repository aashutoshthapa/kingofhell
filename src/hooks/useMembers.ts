import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MemberStats, calculateTrophyTickets, calculateDonationTickets, calculateClanGamesTickets, calculateRaidTickets } from '../utils/statsCalculator'

export function useMembers() {
  const [members, setMembers] = useState<MemberStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  async function fetchMembers() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clan_members')
        .select('*')

      if (error) {
        throw error
      }

      // Calculate tickets for each member and sort by total tickets descending
      const membersWithCalculatedTickets = (data || []).map(member => {
        const trophyTickets = calculateTrophyTickets(member.current_trophies)
        const donationTickets = calculateDonationTickets(member.current_donations)
        const clanGamesTickets = calculateClanGamesTickets(member.clan_games_points)
        const raidTickets = calculateRaidTickets(member.current_capital_gold || 0)
        
        // Use direct ticket values from database (from Google Sheets GHIJ columns)
        const perfectWarTickets = member.perfect_wars || 0 // Column G
        const noWarMissTickets = member.wars_missed || 0 // Column H
        const perfectMonthTickets = member.perfect_month || 0 // Column I
        const cwlTickets = member.cwl_performance || 0 // Column J
        
        const totalTickets = trophyTickets + donationTickets + clanGamesTickets + raidTickets + 
                           perfectWarTickets + noWarMissTickets + perfectMonthTickets + cwlTickets

        return {
          ...member,
          trophy_tickets: trophyTickets,
          donation_tickets: donationTickets,
          clan_games_tickets: clanGamesTickets,
          raid_tickets: raidTickets,
          perfect_war_tickets: perfectWarTickets,
          no_war_miss_tickets: noWarMissTickets,
          perfect_month_tickets: perfectMonthTickets,
          cwl_tickets: cwlTickets,
          total_tickets: totalTickets
        }
      })

      // Sort by total tickets in descending order (highest tickets first)
      membersWithCalculatedTickets.sort((a, b) => b.total_tickets - a.total_tickets)

      setMembers(membersWithCalculatedTickets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { members, loading, error, refetch: fetchMembers }
}