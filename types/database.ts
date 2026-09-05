import type {
  Profile,
  ProfileType,
  ProfileStatus,
} from "./profile";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Supabase Database Types
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          slug: string;
          type: ProfileType;
          status: ProfileStatus;
          profile_data: Profile;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };

        Insert: {
          id?: string;
          slug: string;
          type: ProfileType;
          status?: ProfileStatus;
          profile_data: Profile;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };

        Update: {
          id?: string;
          slug?: string;
          type?: ProfileType;
          status?: ProfileStatus;
          profile_data?: Profile;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };

        Relationships: [];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      [_ in never]: never;
    };

    Enums: {
      [_ in never]: never;
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

/**
 * Convenient aliases used by the application.
 */
export type ProfileRow =
  Database["public"]["Tables"]["profiles"]["Row"];

export type ProfileInsert =
  Database["public"]["Tables"]["profiles"]["Insert"];

export type ProfileUpdate =
  Database["public"]["Tables"]["profiles"]["Update"];