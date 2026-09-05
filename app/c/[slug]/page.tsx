import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileBySlug } from "@/data/client";
import { ProfilePage } from "@/components/profile/ProfilePage";
import { DemoBar } from "@/components/DemoBar";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug, "company");

  if (!profile) {
    return {
      title: "Company Not Found",
      description: "The requested company profile could not be found.",
    };
  }

  const title = `${profile.profile.name} — ${profile.profile.title || "Company Profile"}`;
  const description =
    profile.profile.bio ||
    profile.profile.subtitle ||
    `Official digital profile for ${profile.profile.name}`;
  const ogImage = profile.profile.coverImage || profile.profile.logo;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
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

export default async function CompanyProfileRoute({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug, "company");

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
