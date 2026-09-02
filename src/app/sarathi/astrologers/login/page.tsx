import type { Metadata } from "next";
import SarathiAuthPage from "@/components/auth/SarathiAuthPage";
export const metadata: Metadata = {
  title: "Astrologer Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AstrologerLoginPage() {
  return (
    <SarathiAuthPage
      accountType="astrologer"
      defaultNext="/sarathi/data-engine"
      title="Astrologer access to"
      description="Access professional chart calculations, advanced astrological data and the Sārathi Data Engine."
      loginDescription="Sign in to continue to your professional astrology workspace."
      signupDescription="Create your astrologer account. We’ll send you an email confirmation link."
    />
  );
}