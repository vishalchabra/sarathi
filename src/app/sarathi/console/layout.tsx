import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sārathi Console",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}