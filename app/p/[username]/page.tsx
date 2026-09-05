import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileBySlug } from "@/data/client";
import { ProfilePage } from "@/components/profile/ProfilePage";
import { DemoBar } from "@/components/DemoBar";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileBySlug(username, "person");

  if (!profile) {
    return {
      title: "Profile Not Found",
      description: "The requested digital card profile could not be found.",
    };
  }

  const title = `${profile.profile.name} — ${profile.profile.title || "Digital Profile"}`;
  const description =
    profile.profile.bio ||
    profile.profile.subtitle ||
    `Digital NFC Business Card for ${profile.profile.name}`;
  const ogImage = profile.profile.avatar || profile.profile.coverImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: ogImage ? [{ url: ogImage, alt: profile.profile.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function PersonalProfileRoute({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfileBySlug(username, "person");

  if (!profile) {
    notFound();
  }

  return (
    <>
      <DemoBar />
      <ProfilePage profile={profile} />
    </>
  );
}
