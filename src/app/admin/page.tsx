import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminEditor from "@/src/app/admin/AdminEditor";
import { hasAdminSession } from "@/src/app/lib/adminAuth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Website admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await hasAdminSession())) redirect("/admin/login");
  return <AdminEditor />;
}
