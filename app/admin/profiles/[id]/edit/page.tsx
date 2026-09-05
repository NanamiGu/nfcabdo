import { notFound } from "next/navigation";
import { getProfileById } from "@/data/client";
import { ProfileBuilder } from "@/components/admin/builder/ProfileBuilder";

interface EditProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProfilePage({
  params,
}: EditProfilePageProps) {
  const { id } = await params;
  const profile = await getProfileById(id);

  if (!profile) {
    notFound();
  }

  return <ProfileBuilder initialProfile={profile} profileId={id} />;
}
