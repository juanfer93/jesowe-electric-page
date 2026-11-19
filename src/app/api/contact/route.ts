import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactSchema } from "@/src/app/lib/contactSchema";
import { getSiteContent } from "@/src/app/lib/siteContentStore";
import { RequestBodyTooLargeError, readJsonWithinLimit } from "@/src/app/lib/requestBody";
import { consumeRateLimit, getClientAddress } from "@/src/app/lib/rateLimit";

const CONTACT_BODY_MAX_BYTES = 32 * 1024;
const CONTACT_LIMIT = 5;
const CONTACT_WINDOW_MS = 15 * 60 * 1000;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      default: return "&#39;";
    }
  });
}

export async function POST(req: Request) {
  const rateLimit = await consumeRateLimit(`contact:${getClientAddress(req)}`, CONTACT_LIMIT, CONTACT_WINDOW_MS);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, {
      status: 429,
      headers: { "Retry-After": String(rateLimit.retryAfterSeconds) }
    });
  }

  let json: unknown;
  try {
    json = await readJsonWithinLimit(req, CONTACT_BODY_MAX_BYTES);
  } catch (error) {
    const status = error instanceof RequestBodyTooLargeError ? 413 : 400;
    return NextResponse.json({ error: status === 413 ? "Your message is too large." : "Invalid form data." }, { status });
  }

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
    console.error("The contact email service is not configured.");
    return NextResponse.json({ error: "We could not send your message right now. Please try again later." }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  const siteContent = await getSiteContent();
  const SITE = siteContent.site;
  const safeCompanyName = escapeHtml(SITE.companyName);
  const safeFirstName = escapeHtml(firstName || "");
  const safeLastName = escapeHtml(lastName || "");
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r\n?|\n/g, "<br>");
  const subject = `New Website Lead - ${SITE.companyName}`;
  const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Lead from ${safeCompanyName}</title>
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
              <div class="info-value">${safeFirstName} ${safeLastName}</div>
            </div>

            <div class="info-group">
              <span class="info-label">Email</span>
              <div class="info-value"><a href="mailto:${safeEmail}">${safeEmail}</a></div>
            </div>

            ${message ? `
            <div class="info-group" style="border-bottom: none;">
              <span class="info-label">Message</span>
              <div class="message-box">
                ${safeMessage}
              </div>
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>This email was sent from the contact form on <strong>${safeCompanyName}</strong> website.</p>
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
    console.error("Failed to send contact email.", err);
    return NextResponse.json({ error: "We could not send your message right now. Please try again later." }, { status: 500 });
  }
}
