// Auto-generated types for Supabase database
// Run: supabase gen types typescript --local > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'visitor' | 'user' | 'analyst' | 'admin'
export type EventType = 'conflict' | 'news' | 'weather' | 'flight' | 'vessel' | 'market' | 'political' | 'humanitarian' | 'cyber'
export type SeverityLevel = 'minimal' | 'low' | 'moderate' | 'high' | 'critical'
export type ConflictType = 'armed_conflict' | 'civil_unrest' | 'terrorism' | 'political_crisis' | 'border_dispute'
export type BriefingType = 'daily' | 'regional' | 'country' | 'conflict' | 'market' | 'custom'
export type IngestionStatus = 'pending' | 'running' | 'success' | 'failed' | 'partial'
export type AssetClass = 'currency' | 'crypto' | 'commodity' | 'index' | 'equity'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: UserRole
          tier: string
          preferences: Json
          last_seen_at: string | null
          created_at: string
          updated_at: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string
          subscription_period_end: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          tier?: string
          preferences?: Json
          last_seen_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string
          subscription_period_end?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          tier?: string
          preferences?: Json
          last_seen_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string
          subscription_period_end?: string | null
        }
        Relationships: []
      }
      api_credentials: {
        Row: {
          id: string
          user_id: string
          service: string
          encrypted_data: string
          is_active: boolean
          last_tested_at: string | null
          test_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service: string
          encrypted_data: string
          is_active?: boolean
          last_tested_at?: string | null
          test_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service?: string
          encrypted_data?: string
          is_active?: boolean
          last_tested_at?: string | null
          test_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          id: string
          name: string
          region: string
          subregion: string | null
          capital: string | null
          lat: number | null
          lng: number | null
          population: number | null
          risk_score: number
          flag_url: string | null
          metadata: Json
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          region?: string
          subregion?: string | null
          capital?: string | null
          lat?: number | null
          lng?: number | null
          population?: number | null
          risk_score?: number
          flag_url?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          name?: string
          region?: string
          subregion?: string | null
          capital?: string | null
          lat?: number | null
          lng?: number | null
          population?: number | null
          risk_score?: number
          flag_url?: string | null
          metadata?: Json
        }
        Relationships: []
      }
      global_events: {
        Row: {
          id: string
          type: EventType
          title: string
          summary: string | null
          body: string | null
          severity: SeverityLevel
          country_id: string | null
          region: string | null
          lat: number | null
          lng: number | null
          source_id: string | null
          source_url: string | null
          external_id: string | null
          tags: string[]
          metadata: Json
          ai_summary: string | null
          ai_tags: string[]
          is_active: boolean
          occurred_at: string
          ingested_at: string
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: EventType
          title: string
          summary?: string | null
          body?: string | null
          severity?: SeverityLevel
          country_id?: string | null
          region?: string | null
          lat?: number | null
          lng?: number | null
          source_id?: string | null
          source_url?: string | null
          external_id?: string | null
          tags?: string[]
          metadata?: Json
          ai_summary?: string | null
          ai_tags?: string[]
          is_active?: boolean
          occurred_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          type?: EventType
          title?: string
          summary?: string | null
          body?: string | null
          severity?: SeverityLevel
          country_id?: string | null
          region?: string | null
          lat?: number | null
          lng?: number | null
          source_id?: string | null
          source_url?: string | null
          external_id?: string | null
          tags?: string[]
          metadata?: Json
          ai_summary?: string | null
          ai_tags?: string[]
          is_active?: boolean
          occurred_at?: string
          expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'global_events_country_id_fkey'
            columns: ['country_id']
            isOneToOne: false
            referencedRelation: 'countries'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'global_events_source_id_fkey'
            columns: ['source_id']
            isOneToOne: false
            referencedRelation: 'data_sources'
            referencedColumns: ['id']
          }
        ]
      }
      conflict_zones: {
        Row: {
          id: string
          event_id: string
          name: string
          conflict_type: ConflictType
          parties: string[]
          active: boolean
          intensity: number
          casualties_estimate: number | null
          displacement_estimate: number | null
          start_date: string
          end_date: string | null
          last_update: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          conflict_type?: ConflictType
          parties?: string[]
          active?: boolean
          intensity?: number
          casualties_estimate?: number | null
          displacement_estimate?: number | null
          start_date?: string
          end_date?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          conflict_type?: ConflictType
          parties?: string[]
          active?: boolean
          intensity?: number
          casualties_estimate?: number | null
          displacement_estimate?: number | null
          start_date?: string
          end_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'conflict_zones_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'global_events'
            referencedColumns: ['id']
          }
        ]
      }
      conflict_updates: {
        Row: {
          id: string
          conflict_id: string
          title: string
          body: string | null
          severity: SeverityLevel | null
          source_url: string | null
          occurred_at: string
          created_at: string
        }
        Insert: {
          id?: string
          conflict_id: string
          title: string
          body?: string | null
          severity?: SeverityLevel | null
          source_url?: string | null
          occurred_at?: string
        }
        Update: {
          id?: string
          conflict_id?: string
          title?: string
          body?: string | null
          severity?: SeverityLevel | null
          source_url?: string | null
          occurred_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'conflict_updates_conflict_id_fkey'
            columns: ['conflict_id']
            isOneToOne: false
            referencedRelation: 'conflict_zones'
            referencedColumns: ['id']
          }
        ]
      }
      news_articles: {
        Row: {
          id: string
          event_id: string
          headline: string
          body: string | null
          source_name: string
          source_url: string
          author: string | null
          image_url: string | null
          language: string
          sentiment: number | null
          topics: string[]
          published_at: string
        }
        Insert: {
          id?: string
          event_id: string
          headline: string
          body?: string | null
          source_name: string
          source_url: string
          author?: string | null
          image_url?: string | null
          language?: string
          sentiment?: number | null
          topics?: string[]
          published_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          headline?: string
          body?: string | null
          source_name?: string
          source_url?: string
          author?: string | null
          image_url?: string | null
          language?: string
          sentiment?: number | null
          topics?: string[]
          published_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'news_articles_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'global_events'
            referencedColumns: ['id']
          }
        ]
      }
      market_assets: {
        Row: {
          id: string
          symbol: string
          name: string
          asset_class: AssetClass
          country_id: string | null
          is_active: boolean
          metadata: Json
        }
        Insert: {
          id?: string
          symbol: string
          name: string
          asset_class: AssetClass
          country_id?: string | null
          is_active?: boolean
          metadata?: Json
        }
        Update: {
          id?: string
          symbol?: string
          name?: string
          asset_class?: AssetClass
          country_id?: string | null
          is_active?: boolean
          metadata?: Json
        }
        Relationships: []
      }
      price_ticks: {
        Row: {
          id: string
          asset_id: string
          price: number
          change_24h: number | null
          change_pct: number | null
          volume_24h: number | null
          market_cap: number | null
          tick_at: string
        }
        Insert: {
          id?: string
          asset_id: string
          price: number
          change_24h?: number | null
          change_pct?: number | null
          volume_24h?: number | null
          market_cap?: number | null
          tick_at?: string
        }
        Update: {
          id?: string
          asset_id?: string
          price?: number
          change_24h?: number | null
          change_pct?: number | null
          volume_24h?: number | null
          market_cap?: number | null
          tick_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'price_ticks_asset_id_fkey'
            columns: ['asset_id']
            isOneToOne: false
            referencedRelation: 'market_assets'
            referencedColumns: ['id']
          }
        ]
      }
      weather_events: {
        Row: {
          id: string
          event_id: string
          weather_type: string
          magnitude: number | null
          forecast_json: Json | null
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          id?: string
          event_id: string
          weather_type: string
          magnitude?: number | null
          forecast_json?: Json | null
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          weather_type?: string
          magnitude?: number | null
          forecast_json?: Json | null
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'weather_events_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'global_events'
            referencedColumns: ['id']
          }
        ]
      }
      flight_tracks: {
        Row: {
          id: string
          callsign: string
          icao24: string | null
          origin_iata: string | null
          dest_iata: string | null
          aircraft_type: string | null
          lat: number
          lng: number
          altitude_ft: number | null
          speed_kts: number | null
          heading: number | null
          on_ground: boolean
          track_at: string
        }
        Insert: {
          id?: string
          callsign: string
          icao24?: string | null
          origin_iata?: string | null
          dest_iata?: string | null
          aircraft_type?: string | null
          lat: number
          lng: number
          altitude_ft?: number | null
          speed_kts?: number | null
          heading?: number | null
          on_ground?: boolean
        }
        Update: {
          id?: string
          callsign?: string
          icao24?: string | null
          origin_iata?: string | null
          dest_iata?: string | null
          aircraft_type?: string | null
          lat?: number
          lng?: number
          altitude_ft?: number | null
          speed_kts?: number | null
          heading?: number | null
          on_ground?: boolean
        }
        Relationships: []
      }
      vessels: {
        Row: {
          id: string
          mmsi: string
          name: string | null
          vessel_type: string | null
          flag: string | null
          lat: number
          lng: number
          speed_kts: number | null
          heading: number | null
          destination: string | null
          cargo_type: string | null
          is_tanker: boolean
          track_at: string
        }
        Insert: {
          id?: string
          mmsi: string
          name?: string | null
          vessel_type?: string | null
          flag?: string | null
          lat: number
          lng: number
          speed_kts?: number | null
          heading?: number | null
          destination?: string | null
          cargo_type?: string | null
          is_tanker?: boolean
        }
        Update: {
          id?: string
          mmsi?: string
          name?: string | null
          vessel_type?: string | null
          flag?: string | null
          lat?: number
          lng?: number
          speed_kts?: number | null
          heading?: number | null
          destination?: string | null
          cargo_type?: string | null
          is_tanker?: boolean
        }
        Relationships: []
      }
      ai_briefings: {
        Row: {
          id: string
          type: BriefingType
          title: string
          executive_summary: string | null
          full_content: string | null
          model_used: string
          country_id: string | null
          region: string | null
          tags: string[]
          source_event_ids: string[]
          generated_by: string | null
          is_published: boolean
          briefing_date: string
          created_at: string
        }
        Insert: {
          id?: string
          type: BriefingType
          title: string
          executive_summary?: string | null
          full_content?: string | null
          model_used?: string
          country_id?: string | null
          region?: string | null
          tags?: string[]
          source_event_ids?: string[]
          generated_by?: string | null
          is_published?: boolean
          briefing_date?: string
        }
        Update: {
          id?: string
          type?: BriefingType
          title?: string
          executive_summary?: string | null
          full_content?: string | null
          model_used?: string
          country_id?: string | null
          region?: string | null
          tags?: string[]
          source_event_ids?: string[]
          generated_by?: string | null
          is_published?: boolean
          briefing_date?: string
        }
        Relationships: []
      }
      watchlists: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          is_default?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          is_default?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'watchlists_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      watchlist_items: {
        Row: {
          id: string
          watchlist_id: string
          entity_type: string
          entity_id: string
          metadata: Json
          added_at: string
        }
        Insert: {
          id?: string
          watchlist_id: string
          entity_type: string
          entity_id: string
          metadata?: Json
        }
        Update: {
          id?: string
          watchlist_id?: string
          entity_type?: string
          entity_id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: 'watchlist_items_watchlist_id_fkey'
            columns: ['watchlist_id']
            isOneToOne: false
            referencedRelation: 'watchlists'
            referencedColumns: ['id']
          }
        ]
      }
      alert_rules: {
        Row: {
          id: string
          user_id: string
          name: string
          condition: string
          parameters: Json
          channels: string[]
          is_active: boolean
          last_fired_at: string | null
          fire_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          condition: string
          parameters?: Json
          channels?: string[]
          is_active?: boolean
          last_fired_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          condition?: string
          parameters?: Json
          channels?: string[]
          is_active?: boolean
          last_fired_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'alert_rules_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      alert_events: {
        Row: {
          id: string
          rule_id: string
          event_id: string
          fired_at: string
          acknowledged: boolean
        }
        Insert: {
          id?: string
          rule_id: string
          event_id: string
          acknowledged?: boolean
        }
        Update: {
          id?: string
          rule_id?: string
          event_id?: string
          acknowledged?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'alert_events_rule_id_fkey'
            columns: ['rule_id']
            isOneToOne: false
            referencedRelation: 'alert_rules'
            referencedColumns: ['id']
          }
        ]
      }
      workspaces: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          map_state: Json
          active_layers: Json
          filter_state: Json
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          map_state?: Json
          active_layers?: Json
          filter_state?: Json
          is_default?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          map_state?: Json
          active_layers?: Json
          filter_state?: Json
          is_default?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'workspaces_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      data_sources: {
        Row: {
          id: string
          name: string
          slug: string
          adapter_key: string
          base_url: string | null
          auth_type: string | null
          is_active: boolean
          fetch_interval_seconds: number
          last_fetched_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          name: string
          slug: string
          adapter_key: string
          base_url?: string | null
          auth_type?: string | null
          is_active?: boolean
          fetch_interval_seconds?: number
          last_fetched_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          adapter_key?: string
          base_url?: string | null
          auth_type?: string | null
          is_active?: boolean
          fetch_interval_seconds?: number
          last_fetched_at?: string | null
          metadata?: Json
        }
        Relationships: []
      }
      ingestion_runs: {
        Row: {
          id: string
          source_id: string
          status: IngestionStatus
          records_fetched: number
          records_inserted: number
          records_skipped: number
          error_message: string | null
          started_at: string
          completed_at: string | null
          duration_ms: number | null
        }
        Insert: {
          id?: string
          source_id: string
          status?: IngestionStatus
          records_fetched?: number
          records_inserted?: number
          records_skipped?: number
          error_message?: string | null
          started_at?: string
          completed_at?: string | null
          duration_ms?: number | null
        }
        Update: {
          id?: string
          source_id?: string
          status?: IngestionStatus
          records_fetched?: number
          records_inserted?: number
          records_skipped?: number
          error_message?: string | null
          started_at?: string
          completed_at?: string | null
          duration_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'ingestion_runs_source_id_fkey'
            columns: ['source_id']
            isOneToOne: false
            referencedRelation: 'data_sources'
            referencedColumns: ['id']
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string | null
          type: string
          read: boolean
          action_url: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          body?: string | null
          type?: string
          read?: boolean
          action_url?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          body?: string | null
          type?: string
          read?: boolean
          action_url?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      event_type: EventType
      severity_level: SeverityLevel
      conflict_type: ConflictType
      briefing_type: BriefingType
      ingestion_status: IngestionStatus
      asset_class: AssetClass
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
