# User Guide

## King Electric Website Administration

**Editing website text, services, projects, reviews, and images**

Initial edition · November 2026

---

## 1. Sign in

Open [https://www.kingelectrichome.com/admin](https://www.kingelectrichome.com/admin). If needed, it redirects you to the sign-in page.

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

For existing image fields outside Projects, keep the current image, enter a path to an existing website image (for example, `/img/charger.avif`), or upload a replacement. PNG, JPEG, WebP, and AVIF files are supported. Each uploaded file must be smaller than 1.4 MB.

### Project cover and gallery photos

1. Open **Projects** and find the project you want to update.
2. Under **Cover photo**, select **Add cover photo** or **Replace cover**. To remove it, select **Remove cover**.
3. Under **Project gallery**, select **Add photos** and choose one or more photos. Each thumbnail has its own **Remove** button.
4. Select **Save changes** and wait for confirmation. Uploaded project photos are resized in the browser and stored on the website server; the project keeps references to them.
5. Open the public website and check the project card and gallery.

The project uploader accepts PNG, JPEG, WebP, and AVIF source photos up to 10 MB each, then optimizes them to at most 1.2 MB. A project can have up to 30 gallery photos. Uploading alone does not publish the change: select **Save changes**. If you leave before saving, the edited project will not keep the newly uploaded photo. When you save, unreferenced uploaded project images are cleaned up from storage.

---

## 5. Your changes are saved

Selecting **Save changes** writes the website content to a JSON file on the server. Project photo files are saved next to that JSON in a `project-images` folder. Leaving the page, signing out, or signing back in does not undo saved edits. Unsaved edits in the form are not kept, so save before leaving.

The Docker preview stores the JSON and `project-images` directory together in the persistent `jesowe-site-content` volume mounted at `/app/.data`. They remain available after the container restarts or is replaced. On the production host, `ADMIN_CONTENT_PATH` must point to a JSON file on writable persistent storage, and its parent directory must persist too because the images are written to a sibling `project-images` directory. A temporary filesystem can lose text and images when the hosting platform replaces the application. Ask the administrator to back up the entire content directory before major server changes.

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
| `ADMIN_CONTENT_PATH` | An absolute file path on writable persistent storage, such as `/var/data/site-content.json` when the disk is mounted at `/var/data`. |

The folder containing `ADMIN_CONTENT_PATH` must be persistent and writable by the application process. Project uploads are stored in its `project-images` subdirectory. If production runs multiple application instances, use shared persistent storage for both the JSON file and that image directory so every instance can read the same saved content and photos.

For Render, attach a persistent disk to the web service, mount it at the directory used in `ADMIN_CONTENT_PATH` (for example, `/var/data`), and set the variable to a JSON file inside that directory. Render's default service filesystem is temporary; without a disk, uploaded project photos and saved content can disappear on restart or deploy. Render disks have an additional charge and are limited to one service instance.

Do not commit secrets to GitHub, include them in this guide, or send them in messages. Use HTTPS and back up the persistent content volume.
