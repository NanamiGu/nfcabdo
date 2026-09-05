"use client";

import { Profile } from "@/types/profile";
import { ProfileBuilder } from "@/components/admin/builder/ProfileBuilder";

interface EditProfileFormProps {
  profile: Profile;
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
  return <ProfileBuilder initialProfile={profile} profileId={profile.id} />;
}
