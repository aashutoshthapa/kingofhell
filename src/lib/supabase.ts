import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      clan_members: {
        Row: {
          id: string
          player_name: string
          player_tag: string
          discord_handle: string | null
          current_trophies: number
          total_trophies: number
          current_donations: number
          total_donations: number
          clan_games_points: number
          total_clan_games: number
          raid_1_gold: number
          raid_2_gold: number
          raid_3_gold: number
          raid_4_gold: number
          total_raid_gold: number
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
        Insert: {
          id?: string
          player_name: string
          player_tag: string
          discord_handle?: string | null
          current_trophies?: number
          total_trophies?: number
          current_donations?: number
          total_donations?: number
          clan_games_points?: number
          total_clan_games?: number
          raid_1_gold?: number
          raid_2_gold?: number
          raid_3_gold?: number
          raid_4_gold?: number
          total_raid_gold?: number
          perfect_wars?: number
          wars_missed?: number
          perfect_month?: boolean
          cwl_performance?: string | null
          trophy_tickets?: number
          donation_tickets?: number
          clan_games_tickets?: number
          raid_tickets?: number
          total_tickets?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_name?: string
          player_tag?: string
          discord_handle?: string | null
          current_trophies?: number
          total_trophies?: number
          current_donations?: number
          total_donations?: number
          clan_games_points?: number
          total_clan_games?: number
          raid_1_gold?: number
          raid_2_gold?: number
          raid_3_gold?: number
          raid_4_gold?: number
          total_raid_gold?: number
          perfect_wars?: number
          wars_missed?: number
          perfect_month?: boolean
          cwl_performance?: string | null
          trophy_tickets?: number
          donation_tickets?: number
          clan_games_tickets?: number
          raid_tickets?: number
          total_tickets?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}