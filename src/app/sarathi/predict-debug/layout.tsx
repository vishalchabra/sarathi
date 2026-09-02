import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prediction Debug",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PredictDebugLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}