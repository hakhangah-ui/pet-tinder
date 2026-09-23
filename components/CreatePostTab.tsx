"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface CreatePostTabProps {
  onPostSuccess: () => void;
}

export default function CreatePostTab({ onPostSuccess }: CreatePostTabProps) {
  const [petName, setPetName] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Phân loại ảnh hoặc video
    const isVid = selected.type.startsWith("video/");
    setMediaType(isVid ? "video" : "image");
    setFile(selected);

    // Tạo preview
    const objectUrl = URL.createObjectURL(selected);
    setPreviewUrl(objectUrl);
    setErrorMsg(null);
  };

  const handleClearFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim()) {
      setErrorMsg("Vui lòng nhập tên bé thú cưng!");
      return;
    }
    if (!file) {
      setErrorMsg("Vui lòng chọn 1 ảnh hoặc video để đăng!");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      let finalMediaUrl = "";

      // 1. Tải lên Supabase Storage bucket 'pet-media'
      const fileExt = file.name.split(".").pop() || (mediaType === "video" ? "mp4" : "jpg");
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("pet-media")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicData } = supabase.storage
          .from("pet-media")
          .getPublicUrl(fileName);
        finalMediaUrl = publicData.publicUrl;
      } else {
        console.warn("Storage upload notice (bucket chưa tạo hoặc hạn chế RLS):", uploadError?.message);
        // Fallback: Chuyển file sang Base64 Data URL nếu bucket chưa tạo trên Dashboard
        finalMediaUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      // 2. Lưu thông tin vào bảng 'posts' trên Supabase
      const { error: insertError } = await supabase.from("posts").insert({
        pet_name: petName.trim(),
        media_url: finalMediaUrl,
        media_type: mediaType,
        caption: caption.trim() || null,
        likes_count: 0,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setSuccessMsg("Đăng bài thành công lên Supabase! 🐾");

      // Tự động chuyển qua TikTok Feed sau 1.2s
      setTimeout(() => {
        handleClearFile();
        setPetName("");
        setCaption("");
        onPostSuccess();
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra khi lưu bài viết";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full bg-neutral-900/90 overflow-y-auto p-4 sm:p-5 flex flex-col justify-start">
      <div className="max-w-md mx-auto w-full">
        {/* Header form */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Đăng khoảnh khắc bé cưng</h2>
            <p className="text-[11px] text-neutral-400">
              Chia sẻ video hoặc hình ảnh lên TikTok Feed & Supabase
            </p>
          </div>
        </div>

        {/* Thông báo trạng thái */}
        {errorMsg && (
          <div className="mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Khu vực chọn file Media */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Hình ảnh hoặc Video <span className="text-pink-500">*</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {!previewUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-44 border-2 border-dashed border-neutral-700 hover:border-pink-500/80 rounded-2xl bg-neutral-800/40 hover:bg-neutral-800/70 flex flex-col items-center justify-center gap-2 text-neutral-400 transition group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center group-hover:scale-110 transition text-pink-400">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-xs font-medium text-neutral-300">
                  Nhấn để tải lên Ảnh hoặc Video từ máy
                </div>
                <div className="flex items-center gap-3 text-[10px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> JPG, PNG, WEBP
                  </span>
                  <span className="flex items-center gap-1">
                    <VideoIcon className="w-3 h-3" /> MP4, MOV, WEBM
                  </span>
                </div>
              </button>
            ) : (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-neutral-700 bg-black flex items-center justify-center">
                {mediaType === "video" ? (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition"
                  title="Hủy file đã chọn"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-pink-400 uppercase">
                  {mediaType}
                </span>
              </div>
            )}
          </div>

          {/* Ô nhập tên thú cưng */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Tên bé thú cưng <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="VD: Mochi, Bé Bơ, Simba..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition"
            />
          </div>

          {/* Ô nhập caption */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Nội dung mô tả (Caption)
            </label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Kể về khoảnh khắc đáng yêu của bé... (kèm #hashtag)"
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition resize-none"
            />
          </div>

          {/* Gợi ý Hashtag */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {["#pettinder", "#cute", "#doglife", "#catlover", "#funny"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setCaption((prev) => (prev ? `${prev} ${tag}` : tag))}
                className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 hover:text-pink-400 border border-neutral-700/60 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Nút gửi bài */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang lưu lên Supabase Storage...
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                Đăng bài ngay 🚀
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
