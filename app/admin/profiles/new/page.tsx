import { ProfileBuilder } from "@/components/admin/builder/ProfileBuilder";

export const metadata = {
  title: "Create NFC Profile | Admin Dashboard",
  description: "Configure and build digital NFC cards and mobile business profiles.",
};

export default function NewProfilePage() {
  return <ProfileBuilder />;
}