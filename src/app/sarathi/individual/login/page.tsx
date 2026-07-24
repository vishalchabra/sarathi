import SarathiAuthPage from "@/components/auth/SarathiAuthPage";

export default function IndividualLoginPage() {
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