import { Profile, ProfileType, ProfileStatus } from "./profile";

/**
 * PostgreSQL Supabase `profiles` table row schema.
 */
export interface ProfileRow {
  id: string;
  slug: string;
  type: ProfileType;
  status: ProfileStatus;
  profile_data: Profile;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

/**
 * Database insert payload for `profiles`.
 */
export interface ProfileInsert {
  id?: string;
  slug: string;
  type: ProfileType;
  status?: ProfileStatus;
  profile_data: Profile;
  created_by?: string | null;
}

/**
 * Database update payload for `profiles`.
 */
export interface ProfileUpdate {
  slug?: string;
  type?: ProfileType;
  status?: ProfileStatus;
  profile_data?: Profile;
  updated_at?: string;
}

/**
 * Supabase Database interface helper.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
    };
  };
}
