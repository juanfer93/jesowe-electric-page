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
  const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Lead from ${SITE.companyName}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background-color: #1a1a1a; padding: 30px 20px; text-align: center; }
          .header h1 { color: #f59e0b; margin: 0; font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
          .content { padding: 30px; color: #333333; line-height: 1.6; }
          .info-group { margin-bottom: 20px; border-bottom: 1px solid #eeeeee; padding-bottom: 15px; }
          .info-label { font-size: 12px; color: #666666; text-transform: uppercase; font-weight: 600; margin-bottom: 5px; display: block; }
          .info-value { font-size: 16px; color: #111111; font-weight: 500; }
          .message-box { background-color: #f9f9f9; padding: 20px; border-left: 4px solid #f59e0b; border-radius: 4px; margin-top: 20px; }
          .footer { background-color: #eeeeee; padding: 20px; text-align: center; font-size: 12px; color: #888888; }
          a { color: #f59e0b; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Website Lead</h1>
          </div>
          <div class="content">
            <p>You have received a new contact request from your website.</p>
            
            <div class="info-group">
              <span class="info-label">Name</span>
              <div class="info-value">${(firstName || "")} ${(lastName || "")}</div>
            </div>

            <div class="info-group">
              <span class="info-label">Email</span>
              <div class="info-value"><a href="mailto:${email}">${email}</a></div>
            </div>

            ${message ? `
            <div class="info-group" style="border-bottom: none;">
              <span class="info-label">Message</span>
              <div class="message-box">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>This email was sent from the contact form on <strong>${SITE.companyName}</strong> website.</p>
          </div>
        </div>
      </body>
      </html>
    `;

  // Plain text fallback
  const text = [
    `New Lead for ${SITE.companyName}`,
    "---------------------------------",
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
      text, // Fallback
      html  // Main content
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to send email: ${msg}` }, { status: 500 });
  }
}
