export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          shortcut: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string
          shortcut?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          shortcut?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      entries: {
        Row: {
          id: string
          user_id: string
          task_id: string
          day_index: number
          hour: number
          year: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          day_index: number
          hour: number
          year?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          day_index?: number
          hour?: number
          year?: number
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string
          progress: number
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category?: string
          progress?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: string
          progress?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          requester_id: string
          addressee_id: string
          status: 'pending' | 'accepted' | 'declined' | 'blocked'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          addressee_id: string
          status?: 'pending' | 'accepted' | 'declined' | 'blocked'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          addressee_id?: string
          status?: 'pending' | 'accepted' | 'declined' | 'blocked'
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          achievement_key: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_key: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_key?: string
          unlocked_at?: string
        }
      }
    }
    Functions: {
      get_weekly_hours: {
        Args: { user_uuid: string }
        Returns: number
      }
      search_users_by_email: {
        Args: { search_email: string }
        Returns: {
          id: string
          email: string
          full_name: string
          avatar_url: string
        }[]
      }
    }
  }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Entry = Database['public']['Tables']['entries']['Row']
export type Goal = Database['public']['Tables']['goals']['Row']
export type Friendship = Database['public']['Tables']['friendships']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']
