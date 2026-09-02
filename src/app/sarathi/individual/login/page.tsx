import type { Metadata } from "next";
import { redirect } from "next/navigation";

import SarathiAuthPage from "@/components/auth/SarathiAuthPage";
import { createClient } from "@/lib/supabase/server";
export const metadata: Metadata = {
  title: "Individual Login",
  robots: {
    index: false,
    follow: false,
  },
};
type Props = {
  searchParams: Promise<{
    next?: string;
  }>;
};

function safeNextPath(
  value: string | undefined,
  fallback: string
) {
  if (!value) {
    return fallback;
  }

  if (!value.startsWith("/sarathi")) {
    return fallback;
  }

  if (
    value.startsWith("/sarathi/login") ||
    value.startsWith("/sarathi/individual/login") ||
    value.startsWith("/sarathi/astrologers/login")
  ) {
    return fallback;
  }

  return value;
}

export default async function IndividualLoginPage({
  searchParams,
}: Props) {
  const { next } = await searchParams;

  const nextPath = safeNextPath(
    next,
    "/sarathi/life-report"
  );

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * If a valid session already exists, do not show
   * the login form again.
   */
  if (user) {
    redirect(nextPath);
  }

  return (
    <SarathiAuthPage
      accountType="individual"
      defaultNext="/sarathi/life-report"
      title="Welcome to"
      description="Access personal guidance, Life Reports and Ask Sārathi through your secure account."
      loginDescription="Sign in to continue your personal Sārathi journey."
      signupDescription="Create your individual account. We’ll send you an email confirmation link."
    />
  );
}