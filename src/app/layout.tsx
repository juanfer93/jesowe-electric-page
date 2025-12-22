import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "King Electric & Home Renovation LLC | Residential & Commercial",
  description:
    "Specialists in Tesla and EV charger installations, panel upgrades, and full-service electrical work for residential and commercial projects across Virginia."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">{children}</body>
    </html>
  );
}
