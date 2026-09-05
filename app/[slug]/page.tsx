import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileBySlug } from "@/data/client";
import { ProfilePage } from "@/components/profile/ProfilePage";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  if (!profile) {
    return {
      title: "Profile Not Found",
      description: "The requested digital business card profile could not be found.",
    };
  }

  const isCompany = profile.type === "company";
  const name = profile.profile.name;
  const title = `${name} — ${profile.profile.title || (isCompany ? "Company Profile" : "Digital Profile")}`;
  const description =
    profile.profile.bio ||
    profile.profile.subtitle ||
    (isCompany
      ? `Official digital profile for ${name}`
      : `Digital NFC Business Card for ${name}`);
  const ogImage =
    profile.profile.coverImage ||
    profile.profile.logo ||
    profile.profile.avatar;

  const canonicalUrl = `/${profile.slug || slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: isCompany ? "website" : "profile",
      images: ogImage ? [{ url: ogImage, alt: name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

/**
 * Dynamic Root Profile Route (Server Component)
 * =============================================================
 * Handles both Personal (/amine) and Company (/artex) profiles
 * without any URL prefix (/p/ or /c/).
 *
 * Designed for NFC taps:
 * NFC Tag URL: https://DOMAIN/[slug]
 * =============================================================
 */
export default async function DynamicProfileRoute({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  return <ProfilePage profile={profile} />;
}
