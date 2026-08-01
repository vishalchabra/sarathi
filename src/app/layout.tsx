import "./globals.css";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}