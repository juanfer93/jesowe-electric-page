# User Guide

## King Electric Website Administration

**Editing website text, services, projects, reviews, and images**

Initial edition · November 2026

---

## 1. Sign in

Open the administration address provided by the person who manages the website, followed by `/admin/login`.

Enter the administrator username and password you were given. Your session expires automatically after eight hours. Select **Sign out** to end it sooner.

> On the public site, check that the address starts with `https://`. Do not use local preview credentials in production.

## 2. What you can edit

The side navigation groups the website content:

| Section | What it contains |
| --- | --- |
| **Overview** | A summary of the number of services, projects, and reviews. |
| **Business details** | Business name, contact details, links, and navigation. |
| **Page content** | Main home, about, team, and contact text. |
| **Services** | The title, description, image, and features for each service. |
| **Projects** | The title, description, highlights, image, and gallery for each project. |
| **Reviews** | Customer comments, author, and review source. |
| **Extra sections** | Additional text and images using a prepared layout. You can optionally add a menu link. |

## 3. Add, edit, and save content

1. Open a section and edit the fields. Use **Add** or **Remove** where available.
2. Select **Save changes** and wait for confirmation. The public website uses the saved content immediately.
3. Select **View public website** to check the result.

If an error appears, check the fields and save again. Do not close the page while it is saving.

## 4. Images

For an image field, keep the current image, enter a path to an existing website image (for example, `/img/charger.avif`), or upload a replacement. PNG, JPEG, WebP, and AVIF files are supported. Each uploaded file must be smaller than 1.4 MB.

Resize large photos before uploading. After saving, check the public website to make sure the image looks right.

---

## 5. Your changes are saved

Selecting **Save changes** writes the website content to a JSON file on the server. Leaving the page, signing out, or signing back in does not undo saved edits. Unsaved edits in the form are not kept, so save before leaving.

The Docker preview stores that file in the persistent `jesowe-site-content` volume. It remains available after the container restarts or is replaced. On the production host, `ADMIN_CONTENT_PATH` must point to writable persistent storage. A temporary filesystem can lose edits when the hosting platform replaces the application. Ask the administrator to back up the content volume before major server changes.

## 6. Helpful tips

- Check spelling, phone numbers, and links before saving.
- Saved changes go live immediately. Keep a copy of the previous text if you might need to restore it.
- The panel edits existing content, not the overall design, application code, or new website features.
- Contact the technical administrator before major content or server changes.
- If you cannot sign in, confirm the address and ask the technical administrator to review the configuration. The panel does not include a password reset feature.

## 7. Production setup (technical administrator)

Set these environment variables in the hosting provider's environment or secret manager:

| Variable | Value |
| --- | --- |
| `ADMIN_USERNAME` | The chosen administrator username. |
| `ADMIN_PASSWORD_HASH` | Output from `node scripts/generate-admin-password-hash.mjs`. Use the generated `scrypt:<salt>:<hash>` value; never store the original password here. |
| `ADMIN_SESSION_SECRET` | A random value from `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`. |
| `ADMIN_CONTENT_PATH` | An absolute file path on writable persistent storage, such as `/app/.data/site-content.json`. |

Do not commit secrets to GitHub, include them in this guide, or send them in messages. Use HTTPS and back up the persistent content volume.
