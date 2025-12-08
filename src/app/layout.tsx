// FILE: src/app/layout.tsx
import "./globals.css";   // <-- ensure this line exists

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
