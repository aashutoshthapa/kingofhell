// ClashKing API - No authentication required
const CLASHKING_API_BASE = 'https://api.clashk.ing'

export interface ClashKingMember {
  name: string
  tag: string
  role: string
  expLevel: number
  trophies: number
  townhall: number
  league: string
  builderTrophies: number
  donations: number
  donationsReceived: number
}

export interface ClashKingClan {
  tag: string
  name: string
  members: number
  memberList: ClashKingMember[]
  clanCapitalPoints: number
  clanPoints: number
  level: number
  warWins: number
  warWinStreak: number
  warLeague: string
  capitalLeague: string
}

export interface COCPlayer {
  tag: string
  name: string
  townHallLevel: number
  expLevel: number
  trophies: number
  bestTrophies: number
  donations: number
  donationsReceived: number
  clanCapitalContributions: number
  achievements: Achievement[]
}

export interface Achievement {
  name: string
  stars: number
  value: number
  target: number
  info: string
  completionInfo: string | null
  village: string
}

class COCApi {
  private baseURL: string

  constructor() {
    this.baseURL = CLASHKING_API_BASE
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`ClashKing API Error: ${response.status} - ${response.statusText}`)
    }

    return response.json()
  }

  async getPlayer(playerTag: string): Promise<COCPlayer> {
    // Use the tag with # for ClashKing API
    const tagWithHash = playerTag.startsWith('#') ? playerTag : `#${playerTag}`
    return this.makeRequest<COCPlayer>(`/player/${encodeURIComponent(tagWithHash)}`)
  }

  async getClan(clanTag: string): Promise<ClashKingClan> {
    // Use the tag with # for ClashKing API
    const tagWithHash = clanTag.startsWith('#') ? clanTag : `#${clanTag}`
    return this.makeRequest<ClashKingClan>(`/clan/${encodeURIComponent(tagWithHash)}/basic`)
  }
}

// Create API instance
export const cocApi = new COCApi()

// Helper functions to extract specific achievement values
export function getDonationValue(player: COCPlayer): number {
  const friendInNeed = player.achievements?.find(achievement => 
    achievement.name === "Friend in Need"
  )
  return friendInNeed?.value || 0
}

export function getCapitalGoldValue(player: COCPlayer): number {
  const aggressiveCapitalism = player.achievements?.find(achievement => 
    achievement.name === "Aggressive Capitalism"
  )
  return aggressiveCapitalism?.value || 0
}

export function getClanGamesValue(player: COCPlayer): number {
  const gamesChampion = player.achievements?.find(achievement => 
    achievement.name === "Games Champion"
  )
  return gamesChampion?.value || 0
}

// Utility function to check if it's the last Monday of the month at 04:15 UTC
export function isLastMondayReset(): boolean {
  const now = new Date()
  const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
  
  // Check if it's Monday (1) and time is 04:15 UTC
  if (utc.getUTCDay() !== 1 || utc.getUTCHours() !== 4 || utc.getUTCMinutes() !== 15) {
    return false
  }
  
  // Check if this is the last Monday of the month
  const lastDayOfMonth = new Date(utc.getUTCFullYear(), utc.getUTCMonth() + 1, 0)
  const lastMondayOfMonth = new Date(lastDayOfMonth)
  
  // Find the last Monday
  while (lastMondayOfMonth.getUTCDay() !== 1) {
    lastMondayOfMonth.setUTCDate(lastMondayOfMonth.getUTCDate() - 1)
  }
  
  return utc.getUTCDate() === lastMondayOfMonth.getUTCDate()
}

// Get the date of the last Monday reset for the current month
export function getLastMondayResetDate(): Date {
  const now = new Date()
  const lastDayOfMonth = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)
  const lastMondayOfMonth = new Date(lastDayOfMonth)
  
  // Find the last Monday
  while (lastMondayOfMonth.getUTCDay() !== 1) {
    lastMondayOfMonth.setUTCDate(lastMondayOfMonth.getUTCDate() - 1)
  }
  
  // Set time to 04:15 UTC
  lastMondayOfMonth.setUTCHours(4, 15, 0, 0)
  
  return lastMondayOfMonth
}