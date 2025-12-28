import type { Metadata } from "next";
import { KING_ELECTRIC_LOGO } from "./lib/brandAssets";
import "./globals.css";

export const metadata: Metadata = {
  title: "King Electric & Home Renovation LLC | Residential & Commercial",
  description:
    "Specialists in Tesla and EV charger installations, panel upgrades, and full-service electrical work for residential and commercial projects across Virginia.",
   icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-white text-slate-900">{children}</body>
    </html>
  );
}
