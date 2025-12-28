import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "King Electric & Home Renovation LLC | Residential & Commercial",
  description:
    "Specialists in Tesla and EV charger installations, panel up... work for residential and commercial projects across Virginia.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">{children}</body>
    </html>
  );
}