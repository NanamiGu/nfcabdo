import { Metadata } from "next";
import { getActiveProfile } from "@/data/client";
import { ProfilePage } from "@/components/profile/ProfilePage";
import { DemoBar } from "@/components/DemoBar";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getActiveProfile();
  const title = `${profile.profile.name} — ${profile.profile.title || "Digital Profile"}`;
  const description =
    profile.profile.bio ||
    profile.profile.subtitle ||
    `Official NFC digital business card for ${profile.profile.name}`;
  const ogImage = profile.profile.coverImage || profile.profile.logo || profile.profile.avatar;

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

export default async function HomePage() {
  const profile = await getActiveProfile();

  return (
    <>
      <DemoBar />
      <ProfilePage profile={profile} />
    </>
  );
}
