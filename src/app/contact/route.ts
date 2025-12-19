import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { SITE } from "@/src/app/lib/content";
import { contactSchema } from "@/src/app/lib/contactSchema";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid form data" },
      { status: 400 }
    );
  }

  const { firstName, lastName, email, message } = parsed.data;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM || user;

  if (!host || !port || !user || !pass || !from) {
    return NextResponse.json(
      {
        error:
          "Email service is not configured. Missing SMTP env vars (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM)."
      },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  const subject = `New Website Lead - ${SITE.companyName}`;
  const text = [
    `Name: ${(firstName || "")} ${(lastName || "")}`.trim(),
    `Email: ${email}`,
    "",
    "Message:",
    message
  ].join("\n");

  try {
    await transporter.sendMail({
      from,
      to: SITE.toEmail,
      replyTo: email,
      subject,
      text
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to send email: ${msg}` }, { status: 500 });
  }
}
