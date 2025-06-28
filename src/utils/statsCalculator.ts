export interface MemberStats {
  id: string
  player_name: string
  player_tag: string
  discord_handle: string | null
  current_trophies: number
  total_trophies: number
  current_donations: number
  current_capital_gold?: number
  current_clan_games?: number
  total_donations: number
  clan_games_points: number
  total_clan_games: number
  perfect_wars: number
  wars_missed: number
  perfect_month: boolean
  cwl_performance: string | null
  trophy_tickets: number
  donation_tickets: number
  clan_games_tickets: number
  raid_tickets: number
  total_tickets: number
  created_at: string
  updated_at: string
}

// Trophy ticket calculation based on current trophies
export function calculateTrophyTickets(trophies: number): number {
  if (trophies >= 6000) return 12
  if (trophies >= 5900) return 10
  if (trophies >= 5800) return 8
  if (trophies >= 5700) return 7
  if (trophies >= 5600) return 5
  return 0
}

// Donation ticket calculation: 1 ticket per 2500 donations
export function calculateDonationTickets(donations: number): number {
  return Math.floor(donations / 2500)
}

// Clan games ticket calculation: 1 ticket per 800 points, capped at 5 tickets
export function calculateClanGamesTickets(points: number): number {
  return Math.min(Math.floor(points / 800), 5)
}

// Raid ticket calculation: 1 ticket per 10,000 capital gold
export function calculateRaidTickets(capitalGold: number): number {
  return Math.floor(capitalGold / 10000)
}

export function calculateTotalTickets(member: Partial<MemberStats>): number {
  const trophyTickets = calculateTrophyTickets(member.current_trophies || 0)
  const donationTickets = calculateDonationTickets(member.current_donations || 0)
  const clanGamesTickets = calculateClanGamesTickets(member.clan_games_points || 0)
  const raidTickets = calculateRaidTickets(member.current_capital_gold || 0)
  
  return trophyTickets + donationTickets + clanGamesTickets + raidTickets
}

export function getPerformanceColor(value: number, type: 'tickets' | 'trophies' | 'donations' | 'raids'): string {
  switch (type) {
    case 'tickets':
      if (value >= 20) return 'text-green-400'
      if (value >= 10) return 'text-yellow-400'
      return 'text-red-400'
    case 'trophies':
      if (value >= 6000) return 'text-green-400'
      if (value >= 5600) return 'text-yellow-400'
      return 'text-red-400'
    case 'donations':
      if (value >= 5000) return 'text-green-400'
      if (value >= 2500) return 'text-yellow-400'
      return 'text-red-400'
    case 'raids':
      if (value >= 50000) return 'text-green-400'
      if (value >= 30000) return 'text-yellow-400'
      return 'text-red-400'
    default:
      return 'text-gray-400'
  }
}

export function getPerformanceBadge(value: number, type: 'tickets' | 'trophies' | 'donations' | 'raids'): string {
  switch (type) {
    case 'tickets':
      if (value >= 20) return 'bg-green-500'
      if (value >= 10) return 'bg-yellow-500'
      return 'bg-red-500'
    case 'trophies':
      if (value >= 6000) return 'bg-green-500'
      if (value >= 5600) return 'bg-yellow-500'
      return 'bg-red-500'
    case 'donations':
      if (value >= 5000) return 'bg-green-500'
      if (value >= 2500) return 'bg-yellow-500'
      return 'bg-red-500'
    case 'raids':
      if (value >= 50000) return 'bg-green-500'
      if (value >= 30000) return 'bg-yellow-500'
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}