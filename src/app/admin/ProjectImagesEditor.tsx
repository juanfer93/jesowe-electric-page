"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import {
  MAX_PROJECT_GALLERY_IMAGES,
  MAX_SOURCE_PROJECT_IMAGE_BYTES,
  canAddProjectGalleryImages,
  isSupportedProjectImageMime
} from "@/src/app/lib/projectImageUtils.mjs";

type Props = {
  cover: string;
  gallery: string[];
  onCoverChange: (image: string) => void;
  onGalleryChange: (images: string[]) => void;
};

const imageAccept = "image/png,image/jpeg,image/webp,image/avif";

async function optimizeImage(file: File) {
  if (!isSupportedProjectImageMime(file.type)) {
    throw new Error("Choose a PNG, JPEG, WebP or AVIF image.");
  }
  if (file.size > MAX_SOURCE_PROJECT_IMAGE_BYTES) {
    throw new Error("Choose an image smaller than 10 MB.");
  }

  if (typeof createImageBitmap !== "function") {
    if (file.size <= 1_200_000) return file;
    throw new Error("This browser cannot resize this photo. Choose one smaller than 1.2 MB.");
  }

  const bitmap = await createImageBitmap(file);
  try {
    let scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    for (let attempt = 0; attempt < 7; attempt += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not prepare this photo for upload.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      const quality = Math.max(0.42, 0.84 - attempt * 0.08);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
      if (!blob) throw new Error("Could not prepare this photo for upload.");
      if (blob.size <= 1_200_000) return blob;
      scale *= 0.82;
    }
    throw new Error("This photo is too large to optimize. Choose a smaller image.");
  } finally {
    bitmap.close();
  }
}

function Preview({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <Image src={src} alt={alt} fill unoptimized sizes="160px" className={`object-cover ${className}`} />;
}

export default function ProjectImagesEditor({ cover, gallery, onCoverChange, onGalleryChange }: Props) {
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const upload = async (files: File[], target: "cover" | "gallery") => {
    setError("");
    setProgress("");
    if (target === "gallery" && !canAddProjectGalleryImages(gallery, files.length)) {
      setError(`A project can have up to ${MAX_PROJECT_GALLERY_IMAGES} gallery photos.`);
      return;
    }

    target === "cover" ? setUploadingCover(true) : setUploadingGallery(true);
    const uploaded: string[] = [];
    const failures: string[] = [];

    for (const [index, file] of files.entries()) {
      setProgress(files.length > 1 ? `Preparing photo ${index + 1} of ${files.length}…` : "Preparing photo…");
      try {
        const optimized = await optimizeImage(file);
        setProgress(files.length > 1 ? `Saving photo ${index + 1} of ${files.length}…` : "Saving photo…");
        const response = await fetch("/api/admin/project-images", {
          method: "POST",
          headers: { "Content-Type": optimized.type || file.type },
          body: optimized
        });
        const result = await response.json().catch(() => ({})) as { url?: string; error?: string };
        if (!response.ok || !result.url) throw new Error(result.error || "Could not save this photo.");
        uploaded.push(result.url);
      } catch (uploadError) {
        failures.push(uploadError instanceof Error ? uploadError.message : "Could not upload this photo.");
      }
    }

    if (uploaded.length > 0) {
      if (target === "cover") onCoverChange(uploaded[uploaded.length - 1]);
      else onGalleryChange([...gallery, ...uploaded]);
    }
    setError(failures.join(" "));
    setProgress("");
    setUploadingCover(false);
    setUploadingGallery(false);
  };

  const handleCoverInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void upload([file], "cover");
  };

  const handleGalleryInput = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length > 0) void upload(files, "gallery");
  };

  return (
    <section className="space-y-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5" aria-label="Project photos">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Cover photo</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">Shown on the project card.</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="relative h-24 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white">
              {cover ? <Preview src={cover} alt="Project cover preview" /> : <div className="grid h-full place-items-center px-3 text-center text-xs text-slate-400">No cover photo</div>}
            </div>
            <div className="flex flex-col items-start gap-2">
              <label className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:border-brand-navy hover:text-brand-navy focus-within:ring-2 focus-within:ring-brand-accent">
                {uploadingCover ? "Uploading…" : cover ? "Replace cover" : "Add cover photo"}
                <input type="file" accept={imageAccept} disabled={uploadingCover || uploadingGallery} className="sr-only" onChange={handleCoverInput} aria-label="Add or replace cover photo" />
              </label>
              {cover && <button type="button" disabled={uploadingCover || uploadingGallery} onClick={() => { onCoverChange(""); setError(""); }} className="min-h-11 rounded-lg px-3 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50">Remove cover</button>}
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Project gallery <span className="font-normal text-slate-500">({gallery.length}/{MAX_PROJECT_GALLERY_IMAGES})</span></h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">Add photos, then save changes to publish and keep them.</p>
            </div>
            <label className={`inline-flex min-h-11 cursor-pointer items-center rounded-lg bg-brand-navy px-3.5 text-sm font-semibold text-white transition hover:bg-brand-navy2 focus-within:ring-2 focus-within:ring-brand-accent focus-within:ring-offset-2 ${(uploadingCover || uploadingGallery || gallery.length >= MAX_PROJECT_GALLERY_IMAGES) ? "pointer-events-none opacity-50" : ""}`}>
              {uploadingGallery ? "Uploading…" : "Add photos"}
              <input type="file" accept={imageAccept} multiple disabled={uploadingCover || uploadingGallery || gallery.length >= MAX_PROJECT_GALLERY_IMAGES} className="sr-only" onChange={handleGalleryInput} aria-label="Add project gallery photos" />
            </label>
          </div>

          {gallery.length > 0 ? <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {gallery.map((image, index) => <li key={`${image.slice(0, 48)}-${index}`} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="relative aspect-[4/3] bg-slate-100"><Preview src={image} alt={`Project gallery photo ${index + 1}`} /></div>
              <div className="flex items-center justify-between gap-2 px-2.5 py-2">
                <span className="text-xs text-slate-500">Photo {index + 1}</span>
                <button type="button" disabled={uploadingCover || uploadingGallery} onClick={() => { onGalleryChange(gallery.filter((_, itemIndex) => itemIndex !== index)); setError(""); }} aria-label={`Remove gallery photo ${index + 1}`} className="min-h-11 rounded-md px-2 text-xs font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50">Remove</button>
              </div>
            </li>)}
          </ul> : <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">No gallery photos yet. Add photos to show them in the project gallery.</div>}
        </div>
      </div>

      {(progress || error) && <p role={error ? "alert" : "status"} aria-live="polite" className={`text-sm ${error ? "text-red-700" : "text-slate-600"}`}>{error || progress}</p>}
      <p className="text-xs leading-5 text-slate-500">PNG, JPEG, WebP and AVIF supported. Photos are optimized before upload and saved with this project on the server when you select Save changes.</p>
    </section>
  );
}
