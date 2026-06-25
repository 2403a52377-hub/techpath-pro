export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      coding_topics: {
        Row: {
          codechef_url: string | null
          difficulty: string
          gfg_url: string | null
          hackerrank_url: string | null
          id: string
          leetcode_url: string | null
          name: string
          sort_order: number
        }
        Insert: {
          codechef_url?: string | null
          difficulty?: string
          gfg_url?: string | null
          hackerrank_url?: string | null
          id?: string
          leetcode_url?: string | null
          name: string
          sort_order?: number
        }
        Update: {
          codechef_url?: string | null
          difficulty?: string
          gfg_url?: string | null
          hackerrank_url?: string | null
          id?: string
          leetcode_url?: string | null
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          tag: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          tag?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          tag?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          application_link: string
          company_name: string
          description: string | null
          experience: string | null
          id: string
          job_type: string
          location: string
          posted_at: string
          role: string
        }
        Insert: {
          application_link: string
          company_name: string
          description?: string | null
          experience?: string | null
          id?: string
          job_type?: string
          location: string
          posted_at?: string
          role: string
        }
        Update: {
          application_link?: string
          company_name?: string
          description?: string | null
          experience?: string | null
          id?: string
          job_type?: string
          location?: string
          posted_at?: string
          role?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          branch: string | null
          college_name: string | null
          created_at: string
          domain_interest: string | null
          email: string
          full_name: string
          id: string
          skill_level: Database["public"]["Enums"]["skill_level"] | null
          streak: number
          updated_at: string
          xp: number
          year_of_study: string | null
        }
        Insert: {
          avatar_url?: string | null
          branch?: string | null
          college_name?: string | null
          created_at?: string
          domain_interest?: string | null
          email: string
          full_name?: string
          id: string
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          streak?: number
          updated_at?: string
          xp?: number
          year_of_study?: string | null
        }
        Update: {
          avatar_url?: string | null
          branch?: string | null
          college_name?: string | null
          created_at?: string
          domain_interest?: string | null
          email?: string
          full_name?: string
          id?: string
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          streak?: number
          updated_at?: string
          xp?: number
          year_of_study?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string
          difficulty: Database["public"]["Enums"]["skill_level"]
          domain_name: string
          github_reference: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty?: Database["public"]["Enums"]["skill_level"]
          domain_name: string
          github_reference?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: Database["public"]["Enums"]["skill_level"]
          domain_name?: string
          github_reference?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          created_at: string
          id: string
          resume_data: Json
          resume_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          resume_data?: Json
          resume_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          resume_data?: Json
          resume_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      roadmap_modules: {
        Row: {
          description: string | null
          duration: string | null
          id: string
          instructor: string | null
          roadmap_id: string
          sort_order: number
          title: string
          youtube_thumbnail: string | null
          youtube_url: string | null
        }
        Insert: {
          description?: string | null
          duration?: string | null
          id?: string
          instructor?: string | null
          roadmap_id: string
          sort_order?: number
          title: string
          youtube_thumbnail?: string | null
          youtube_url?: string | null
        }
        Update: {
          description?: string | null
          duration?: string | null
          id?: string
          instructor?: string | null
          roadmap_id?: string
          sort_order?: number
          title?: string
          youtube_thumbnail?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_modules_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          created_at: string
          description: string
          domain_name: string
          estimated_duration: string
          icon: string | null
          id: string
          level: Database["public"]["Enums"]["skill_level"]
          slug: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          domain_name: string
          estimated_duration: string
          icon?: string | null
          id?: string
          level?: Database["public"]["Enums"]["skill_level"]
          slug: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          domain_name?: string
          estimated_duration?: string
          icon?: string | null
          id?: string
          level?: Database["public"]["Enums"]["skill_level"]
          slug?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          id: string
          job_id: string
          saved_at: string
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          job_id: string
          saved_at?: string
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          job_id?: string
          saved_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_module_ids: string[]
          completion_percentage: number
          id: string
          roadmap_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_module_ids?: string[]
          completion_percentage?: number
          id?: string
          roadmap_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_module_ids?: string[]
          completion_percentage?: number
          id?: string
          roadmap_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "mentor" | "admin"
      skill_level: "Beginner" | "Intermediate" | "Advanced"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "mentor", "admin"],
      skill_level: ["Beginner", "Intermediate", "Advanced"],
    },
  },
} as const
