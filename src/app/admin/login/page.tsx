import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/src/app/admin/LoginForm";
import { hasAdminSession } from "@/src/app/lib/adminAuth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await hasAdminSession()) redirect("/admin");
  return <LoginForm />;
}
