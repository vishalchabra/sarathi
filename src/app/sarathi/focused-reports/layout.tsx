import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Focused Reports",
  description:
    "Access personalised Sārathi reports focused on career, marriage, money, property and other important life areas.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FocusedReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}