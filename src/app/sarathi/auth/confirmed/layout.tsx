import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Confirmed",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConfirmedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}