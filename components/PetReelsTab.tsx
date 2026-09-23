"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  Play,
  Volume2,
  VolumeX,
  Send,
  X,
  Plus,
  RotateCcw,
  Sparkles,
  UploadCloud,
  Loader2,
  PlaySquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export interface ReelItem {
  id: string;
  pet_name: string;
  media_url: string;
  media_type: "image" | "video";
  caption: string | null;
  likes_count: number;
  created_at: string;
}

// Danh sách video và ảnh mẫu sinh động thực tế (HTML5 Video có âm thanh)
const SAMPLE_REELS: ReelItem[] = [
  {
    id: "sample-reel-1",
    pet_name: "Chó Corgi Bánh Mì",
    media_url: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
    media_type: "video",
    caption:
      "Tập chạy bộ buổi sáng cùng sen nè, mông lắc lư đáng yêu chưa cả nhà! 🐾 #corgi #petreels #cute",
    likes_count: 542,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-reel-2",
    pet_name: "Bơ Mèo Anh Ngủ Ngày",
    media_url:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1080&q=80",
    media_type: "image",
    caption:
      "Hễ ai gọi ăn cá ngừ là đôi mắt sáng như ngọc bích 🐱 #britishshorthair #meow",
    likes_count: 320,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-reel-3",
    pet_name: "Simba Golden Bắt Bóng",
    media_url: "https://www.w3schools.com/html/mov_bbb.mp4",
    media_type: "video",
    caption:
      "Cùng xem lại khoảnh khắc bắt bóng thần tốc siêu đáng yêu 🎾 #goldenretriever #energy",
    likes_count: 819,
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-reel-4",
    pet_name: "Lu Shiba Cười Đẹp",
    media_url:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1080&q=80",
    media_type: "image",
    caption:
      "Nụ cười 100 điểm không có nhưng của Lu Shiba Nhật Bản 😎 #shibainu #doglover",
    likes_count: 671,
    created_at: new Date().toISOString(),
  },
];

export default function PetReelsTab() {
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // Mặc định mở tiếng để nghe âm thanh video
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [activeCommentReel, setActiveCommentReel] = useState<ReelItem | null>(null);
  const [comments, setComments] = useState<Record<string, string[]>>({
    "sample-reel-1": ["Bé cưng xỉu luôn á!", "Chạy mông lắc cưng quá trời 😍"],
    "sample-reel-2": ["Mắt tròn xoe long lanh ghê!", "Mèo vàng xinh xắn quá"],
    "sample-reel-3": ["Thông minh quá bé ơi!", "Bắt bóng đỉnh thật sự 🎾"],
  });
  const [newComment, setNewComment] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // State upload Reels mới
  const [uploadPetName, setUploadPetName] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadMediaType, setUploadMediaType] = useState<"image" | "video">("video");
  const [isUploading, setIsUploading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchReels = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        setReels(SAMPLE_REELS);
      } else {
        // Hợp nhất bài từ Supabase và bài mẫu phong phú
        const merged = [
          ...data.map((d) => ({
            id: String(d.id),
            pet_name: d.pet_name,
            media_url: d.media_url,
            media_type: (d.media_type as "image" | "video") || "image",
            caption: d.caption,
            likes_count: d.likes_count || 0,
            created_at: d.created_at || new Date().toISOString(),
          })),
          ...SAMPLE_REELS,
        ];
        setReels(merged);
      }
    } catch {
      setReels(SAMPLE_REELS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const height = containerRef.current.clientHeight;
    const scrollTop = containerRef.current.scrollTop;
    const newIdx = Math.round(scrollTop / height);
    if (newIdx !== currentIndex && newIdx >= 0 && newIdx < reels.length) {
      setCurrentIndex(newIdx);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleLike = async (reelId: string, initialLikes: number) => {
    const isLiked = likedPosts[reelId];
    const currentLikes = likeCounts[reelId] ?? initialLikes;
    const newCount = isLiked ? currentLikes - 1 : currentLikes + 1;

    setLikedPosts((prev) => ({ ...prev, [reelId]: !isLiked }));
    setLikeCounts((prev) => ({ ...prev, [reelId]: newCount }));

    try {
      await supabase
        .from("posts")
        .update({ likes_count: newCount })
        .eq("id", reelId);
    } catch {
      // ignore
    }
  };

  const handleAddComment = (reelId: string) => {
    if (!newComment.trim()) return;
    setComments((prev) => ({
      ...prev,
      [reelId]: [...(prev[reelId] || []), newComment.trim()],
    }));
    setNewComment("");
  };

  const handleShare = (reel: ReelItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Đã sao chép liên kết Pet Reels! 📋");
    } else {
      showToast("Đã chia sẻ thước phim!");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    const isVid = file.type.startsWith("video/");
    setUploadMediaType(isVid ? "video" : "image");
    setUploadPreview(URL.createObjectURL(file));
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadPetName.trim() || !uploadFile) {
      showToast("Vui lòng nhập tên bé và chọn file video/ảnh!");
      return;
    }

    setIsUploading(true);
    try {
      let finalUrl = "";
      const fileExt = uploadFile.name.split(".").pop() || "mp4";
      const fileName = `reels_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${fileExt}`;

      const { data: upData, error: upError } = await supabase.storage
        .from("pet-media")
        .upload(fileName, uploadFile, { upsert: true });

      if (!upError && upData) {
        finalUrl = supabase.storage.from("pet-media").getPublicUrl(fileName).data.publicUrl;
      } else {
        finalUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(uploadFile);
        });
      }

      const { data: newRow, error: insertError } = await supabase
        .from("posts")
        .insert({
          pet_name: uploadPetName.trim(),
          media_url: finalUrl,
          media_type: uploadMediaType,
          caption: uploadCaption.trim() || null,
          likes_count: 0,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (newRow) {
        setReels((prev) => [newRow as ReelItem, ...prev]);
      }
      showToast("Đăng Pet Reels thành công! 🎉");
      setShowCreateModal(false);
      setUploadFile(null);
      setUploadPreview(null);
      setUploadPetName("");
      setUploadCaption("");
      setCurrentIndex(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi đăng Reels";
      showToast(`Lỗi: ${msg}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-hidden select-none">
      {/* Top Header Reels: Tiêu đề & Nút Mute / Nút Đăng Reels */}
      <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs font-bold">
          <PlaySquare className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
          <span>Pet Reels</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>

        <div className="flex items-center gap-2">
          {/* Nút Đăng Reels Mới */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold shadow-lg shadow-pink-500/25 hover:brightness-110 active:scale-95 transition"
            title="Đăng thước phim mới"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Đăng Reels</span>
          </button>

          {/* Nút Bật / Tắt âm thanh */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition"
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-neutral-300" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* Toast thông báo */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-pink-500 text-white text-xs font-semibold shadow-lg backdrop-blur-md"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Container Cuộn Dọc Reels Snap-y */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-neutral-400">
            <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
            <span className="text-xs">Đang tải các thước phim Pet Reels...</span>
          </div>
        ) : reels.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-neutral-400">
            <p className="text-sm mb-4">Chưa có thước phim nào!</p>
            <button
              type="button"
              onClick={fetchReels}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500 text-white text-xs font-semibold"
            >
              <RotateCcw className="w-4 h-4" /> Tải lại
            </button>
          </div>
        ) : (
          reels.map((reel, index) => {
            const isActive = index === currentIndex;
            const isLiked = likedPosts[reel.id] ?? false;
            const likesDisplay = likeCounts[reel.id] ?? reel.likes_count;
            const reelComments = comments[reel.id] || [];

            return (
              <ReelCard
                key={reel.id}
                reel={reel}
                isActive={isActive}
                isMuted={isMuted}
                isLiked={isLiked}
                likesDisplay={likesDisplay}
                commentsCount={reelComments.length}
                onToggleLike={() => handleToggleLike(reel.id, reel.likes_count)}
                onOpenComments={() => setActiveCommentReel(reel)}
                onShare={() => handleShare(reel)}
              />
            );
          })
        )}
      </div>

      {/* Modal Đăng Reels Mới */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>Đăng Pet Reels</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Chọn Video hoặc Ảnh từ máy <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-neutral-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600 cursor-pointer"
                  />
                </div>

                {uploadPreview && (
                  <div className="w-full h-36 rounded-2xl overflow-hidden bg-black border border-neutral-700 flex items-center justify-center">
                    {uploadMediaType === "video" ? (
                      <video src={uploadPreview} controls className="w-full h-full object-contain" />
                    ) : (
                      <img src={uploadPreview} alt="preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Tên bé thú cưng <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadPetName}
                    onChange={(e) => setUploadPetName(e.target.value)}
                    placeholder="VD: Corgi Mochi, Bơ Mèo..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Mô tả / Caption
                  </label>
                  <textarea
                    rows={2}
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    placeholder="Chia sẻ khoảnh khắc vui nhộn kèm #hashtag..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs focus:outline-none focus:border-pink-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang đăng tải...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      Xuất bản ngay
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Sheet Bình Luận */}
      <AnimatePresence>
        {activeCommentReel && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 top-1/3 bg-neutral-900 border-t border-neutral-800 rounded-t-3xl z-50 flex flex-col p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-sm font-bold text-white">
                Bình luận ({comments[activeCommentReel.id]?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => setActiveCommentReel(null)}
                className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {(comments[activeCommentReel.id] || []).length === 0 ? (
                <div className="text-center text-xs text-neutral-500 py-8">
                  Hãy là người đầu tiên bình luận về bé {activeCommentReel.pet_name}! 🐾
                </div>
              ) : (
                comments[activeCommentReel.id]?.map((cmt, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                      P{i + 1}
                    </div>
                    <div className="flex-1 bg-neutral-800/80 rounded-xl p-2 text-neutral-200">
                      <div className="font-semibold text-neutral-300 text-[11px] mb-0.5">
                        Người yêu thú cưng #{i + 1}
                      </div>
                      <p>{cmt}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex items-center gap-2 border-t border-neutral-800">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddComment(activeCommentReel.id);
                }}
                placeholder="Gửi lời khen cho bé..."
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-full px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500"
              />
              <button
                type="button"
                onClick={() => handleAddComment(activeCommentReel.id)}
                className="w-9 h-9 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponent: Thẻ 1 thước phim Pet Reel
interface ReelCardProps {
  reel: ReelItem;
  isActive: boolean;
  isMuted: boolean;
  isLiked: boolean;
  likesDisplay: number;
  commentsCount: number;
  onToggleLike: () => void;
  onOpenComments: () => void;
  onShare: () => void;
}

function ReelCard({
  reel,
  isActive,
  isMuted,
  isLiked,
  likesDisplay,
  commentsCount,
  onToggleLike,
  onOpenComments,
  onShare,
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const isVideo =
    reel.media_type === "video" ||
    reel.media_url.endsWith(".mp4") ||
    reel.media_url.endsWith(".webm");

  useEffect(() => {
    if (isVideo && videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Trình duyệt có thể chặn autoplay có tiếng nếu chưa tương tác
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, isVideo]);

  const togglePlayPause = () => {
    if (isVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      onToggleLike();
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);
  };

  return (
    <div
      onDoubleClick={handleDoubleTap}
      onClick={togglePlayPause}
      className="relative w-full h-full snap-start flex items-center justify-center bg-black overflow-hidden select-none cursor-pointer"
    >
      {/* Media: Video HTML5 hoặc Ảnh chất lượng cao */}
      {isVideo ? (
        <video
          ref={videoRef}
          src={reel.media_url}
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
            style={{ backgroundImage: `url(${reel.media_url})` }}
          />
          <img
            src={reel.media_url}
            alt={reel.pet_name}
            className="relative z-10 w-full h-full object-cover"
          />
        </div>
      )}

      {/* Icon Play khi tạm dừng */}
      {isVideo && !isPlaying && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
            <Play className="w-8 h-8 fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Hiệu ứng tim bay khi double tap */}
      <AnimatePresence>
        {showHeartAnim && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          >
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient đáy bảo vệ chữ */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

      {/* Thanh Action Bên Phải (Sidebar) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-3 bottom-12 z-20 flex flex-col items-center gap-4 text-white"
      >
        <div className="relative group">
          <div className="w-11 h-11 rounded-full border-2 border-pink-500 overflow-hidden bg-neutral-800 shadow-lg">
            <img src={reel.media_url} alt={reel.pet_name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center text-[10px] font-black text-white shadow-md">
            +
          </div>
        </div>

        {/* Nút Like */}
        <button
          type="button"
          onClick={onToggleLike}
          className="flex flex-col items-center gap-0.5 group focus:outline-none"
        >
          <motion.div
            whileTap={{ scale: 1.3 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isLiked ? "bg-rose-500/20 text-rose-500" : "bg-black/40 backdrop-blur-md text-white"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-rose-500 stroke-rose-500" : "stroke-white"}`} />
          </motion.div>
          <span className="text-[10px] font-bold drop-shadow">{likesDisplay}</span>
        </button>

        {/* Nút Bình luận */}
        <button
          type="button"
          onClick={onOpenComments}
          className="flex flex-col items-center gap-0.5 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold drop-shadow">{commentsCount}</span>
        </button>

        {/* Nút Bookmark */}
        <button type="button" className="flex flex-col items-center gap-0.5 group focus:outline-none">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
            <Bookmark className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold drop-shadow">Lưu</span>
        </button>

        {/* Nút Share */}
        <button
          type="button"
          onClick={onShare}
          className="flex flex-col items-center gap-0.5 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold drop-shadow">Share</span>
        </button>

        {/* Đĩa xoay âm nhạc */}
        <div className="relative mt-1">
          <div className="w-9 h-9 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center animate-[spin_4s_linear_infinite] shadow-xl overflow-hidden">
            <img src={reel.media_url} alt="disc" className="w-4 h-4 rounded-full object-cover" />
          </div>
          <Music className="w-3 h-3 text-pink-400 absolute -top-1 -right-1 animate-bounce" />
        </div>
      </div>

      {/* Thông tin mô tả bên góc dưới trái */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute left-4 bottom-4 right-18 z-20 text-white"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="font-extrabold text-sm tracking-wide drop-shadow">
            @{reel.pet_name}
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-pink-500/80 font-bold tracking-tight">
            Follow
          </span>
        </div>

        <p className="text-[11.5px] text-neutral-200 line-clamp-2 leading-relaxed drop-shadow mb-1.5 font-normal">
          {reel.caption || "Khoảnh khắc siêu đáng yêu cùng bé cưng trên Pet Reels! 🐾"}
        </p>

        <div className="flex items-center gap-1.5 text-[10px] text-neutral-300">
          <Music className="w-3 h-3 text-pink-400 shrink-0" />
          <span className="truncate">
            Âm thanh gốc có bản quyền • Pet Reels • {reel.pet_name}
          </span>
        </div>
      </div>
    </div>
  );
}
