import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jesowe Electric | Residential & Commercial",
  description: "We are committed to providing exceptional service and ensuring the safety and satisfaction of our clients."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900">{children}</body>
    </html>
  );
}
