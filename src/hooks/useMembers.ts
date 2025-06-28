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
        
        // Calculate tickets for perfect wars (2 tickets each)
        const perfectWarTickets = (member.perfect_wars || 0) * 2
        
        // Calculate tickets for no war miss (if wars_missed is 0, give 2 tickets)
        const noWarMissTickets = (member.wars_missed || 0) === 0 ? 2 : 0
        
        // Calculate tickets for perfect month (5 tickets if true)
        const perfectMonthTickets = member.perfect_month ? 5 : 0
        
        // Calculate tickets for CWL performance
        let cwlTickets = 0
        if (member.cwl_performance) {
          const performance = member.cwl_performance.toLowerCase()
          if (performance === 'excellent') cwlTickets = 5
          else if (performance === 'good') cwlTickets = 3
          else if (performance === 'average') cwlTickets = 1
        }
        
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