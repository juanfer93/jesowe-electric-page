import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_PROJECT_GALLERY_IMAGES,
  MAX_SOURCE_PROJECT_IMAGE_BYTES,
  MAX_STORED_PROJECT_IMAGE_BYTES,
  canAddProjectGalleryImages,
  collectProjectImageFilenames,
  detectProjectImageType,
  isSupportedProjectImageMime,
  projectImageFilenameFromUrl
} from "../src/app/lib/projectImageUtils.mjs";

test("recognizes the image formats accepted by the admin uploader", () => {
  for (const mime of ["image/png", "image/jpeg", "image/webp", "image/avif"]) {
    assert.equal(isSupportedProjectImageMime(mime), true);
  }
  assert.equal(isSupportedProjectImageMime("image/svg+xml"), false);
});

test("detects stored image types from bytes, not the submitted content type", () => {
  assert.equal(detectProjectImageType(Buffer.from("89504e470d0a1a0a00000000", "hex")).extension, "png");
  assert.equal(detectProjectImageType(Buffer.from("ffd8ff000000000000000000", "hex")).extension, "jpg");
  assert.equal(detectProjectImageType(Buffer.from("RIFF0000WEBP", "ascii")).extension, "webp");
  assert.equal(detectProjectImageType(Buffer.from("0000001866747970617669660000", "hex")).extension, "avif");
  assert.equal(detectProjectImageType(Buffer.from("not an image")), null);
});

test("accepts only generated project image URLs and extracts gallery/cover references", () => {
  const first = "/admin-media/project-123e4567-e89b-12d3-a456-426614174000.webp";
  const second = "/admin-media/project-123e4567-e89b-12d3-a456-426614174001.png";
  assert.equal(projectImageFilenameFromUrl(first), "project-123e4567-e89b-12d3-a456-426614174000.webp");
  assert.equal(projectImageFilenameFromUrl("/admin-media/../../.env"), null);
  assert.deepEqual([...collectProjectImageFilenames({
    projects: { cards: [{ img: first, gallery: [second, "/img/existing.jpg"] }] }
  })].sort(), ["project-123e4567-e89b-12d3-a456-426614174000.webp", "project-123e4567-e89b-12d3-a456-426614174001.png"]);
});

test("enforces image size and gallery count boundaries", () => {
  assert.equal(MAX_SOURCE_PROJECT_IMAGE_BYTES, 10 * 1024 * 1024);
  assert.equal(MAX_STORED_PROJECT_IMAGE_BYTES, 1_200_000);
  assert.equal(canAddProjectGalleryImages([], MAX_PROJECT_GALLERY_IMAGES), true);
  assert.equal(canAddProjectGalleryImages(Array(MAX_PROJECT_GALLERY_IMAGES).fill("/img/x.jpg"), 1), false);
  assert.equal(canAddProjectGalleryImages([], 0), false);
});
