// storage.js

import supabase from "./supabase.js";

const BUCKET = "imagens";

export async function uploadImage(file, pasta) {
  if (!file) return { ok: false };

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const nome = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(nome, file, { cacheControl: "3600", upsert: false });

  if (error) return { ok: false };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nome);
  return { ok: true, url: data.publicUrl };
}

export async function uploadVideo(file, pasta = "videos") {
  if (!file) return { ok: false };

  const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
  const nome = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(nome, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "video/mp4",
    });

  if (error) {
    console.error("uploadVideo falhou:", error);
    return { ok: false, reason: error.message || "upload_error" };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nome);
  return { ok: true, url: data.publicUrl };
}