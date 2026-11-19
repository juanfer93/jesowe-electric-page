export const MAX_SOURCE_PROJECT_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_STORED_PROJECT_IMAGE_BYTES = 1_200_000;
export const MAX_PROJECT_GALLERY_IMAGES = 30;

const imageSignatures = [
  { mime: "image/png", extension: "png" },
  { mime: "image/jpeg", extension: "jpg" },
  { mime: "image/webp", extension: "webp" },
  { mime: "image/avif", extension: "avif" }
];

export function isSupportedProjectImageMime(mime) {
  return imageSignatures.some((image) => image.mime === mime);
}

export function detectProjectImageType(bytes) {
  if (!bytes || bytes.length < 12) return null;

  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) {
    return imageSignatures[0];
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return imageSignatures[1];
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return imageSignatures[2];
  if (bytes.toString("ascii", 4, 8) === "ftyp" && ["avif", "avis"].includes(bytes.toString("ascii", 8, 12))) return imageSignatures[3];
  return null;
}

export function projectImageFilenameFromUrl(url) {
  if (typeof url !== "string") return null;
  const match = /^\/admin-media\/(project-[a-f0-9-]{36}\.(?:png|jpg|webp|avif))$/i.exec(url);
  return match?.[1] || null;
}

export function collectProjectImageFilenames(content) {
  const images = new Set();
  for (const project of content?.projects?.cards || []) {
    const cover = projectImageFilenameFromUrl(project.img);
    if (cover) images.add(cover);
    for (const image of project.gallery || []) {
      const filename = projectImageFilenameFromUrl(image);
      if (filename) images.add(filename);
    }
  }
  return images;
}

export function canAddProjectGalleryImages(gallery, filesToAdd) {
  return Array.isArray(gallery) && Number.isInteger(filesToAdd) && filesToAdd > 0 && gallery.length + filesToAdd <= MAX_PROJECT_GALLERY_IMAGES;
}
