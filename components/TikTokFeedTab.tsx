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
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export interface PostItem {
  id: string;
  pet_name: string;
  media_url: string;
  media_type: "image" | "video";
  caption: string | null;
  likes_count: number;
  created_at: string;
}

const FALLBACK_POSTS: PostItem[] = [
  {
    id: "f-1",
    pet_name: "Mochi Corgi",
    media_url:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1080&q=80",
    media_type: "image",
    caption:
      "Hôm nay trời đẹp đưa bé Mochi đi dạo công viên bắt bướm 🐾 #corgi #pettinder #cute",
    likes_count: 128,
    created_at: new Date().toISOString(),
  },
  {
    id: "f-2",
    pet_name: "Bơ Lông Ngắn",
    media_url:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1080&q=80",
    media_type: "image",
    caption:
      "Ngủ nướng cả ngày nhưng hễ nghe tiếng mở hộp pate là mở mắt liền 🐱 #britishshorthair",
    likes_count: 94,
    created_at: new Date().toISOString(),
  },
  {
    id: "f-3",
    pet_name: "Simba Golden",
    media_url:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1080&q=80",
    media_type: "image",
    caption:
      "Kỷ lục bắt 10 quả bóng liên tiếp không trượt phát nào! 🎾 #golden #goodboy",
    likes_count: 260,
    created_at: new Date().toISOString(),
  },
];

export default function TikTokFeedTab() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [activeCommentPost, setActiveCommentPost] = useState<PostItem | null>(null);
  const [comments, setComments] = useState<Record<string, string[]>>({
    "f-1": ["Bé cưng xỉu luôn á!", "Chân ngắn đáng yêu quá 😍"],
    "f-2": ["Giống hệt mèo nhà mình haha", "Cặp mắt tròn xoe cưng ghê"],
  });
  const [newComment, setNewComment] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        setPosts(FALLBACK_POSTS);
      } else {
        setPosts(data as PostItem[]);
      }
    } catch {
      setPosts(FALLBACK_POSTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Cập nhật index khi cuộn
  const handleScroll = () => {
    if (!containerRef.current) return;
    const height = containerRef.current.clientHeight;
    const scrollTop = containerRef.current.scrollTop;
    const newIdx = Math.round(scrollTop / height);
    if (newIdx !== currentIndex && newIdx >= 0 && newIdx < posts.length) {
      setCurrentIndex(newIdx);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleLike = async (postId: string, initialLikes: number) => {
    const isLiked = likedPosts[postId];
    const currentLikes = likeCounts[postId] ?? initialLikes;
    const newCount = isLiked ? currentLikes - 1 : currentLikes + 1;

    setLikedPosts((prev) => ({ ...prev, [postId]: !isLiked }));
    setLikeCounts((prev) => ({ ...prev, [postId]: newCount }));

    try {
      await supabase
        .from("posts")
        .update({ likes_count: newCount })
        .eq("id", postId);
    } catch {
      // ignore
    }
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;
    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment.trim()],
    }));
    setNewComment("");
  };

  const handleShare = (post: PostItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(post.media_url);
      showToast("Đã sao chép liên kết video! 📋");
    } else {
      showToast("Đã chia sẻ bài viết!");
    }
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-hidden">
      {/* Nút bật/tắt âm thanh chung */}
      <button
        type="button"
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-black/70 transition"
        title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-neutral-300" />
        ) : (
          <Volume2 className="w-4 h-4 text-emerald-400" />
        )}
      </button>

      {/* Toast thông báo nhanh */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-pink-500 text-white text-xs font-semibold shadow-lg backdrop-blur-md"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Container Cuộn Dọc TikTok (snap-y) */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-neutral-400">
            <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
            <span className="text-xs">Đang tải video thú cưng TikTok...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-neutral-400">
            <p className="text-sm mb-4">Chưa có video hoặc ảnh nào trong Feed!</p>
            <button
              type="button"
              onClick={fetchPosts}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500 text-white text-xs font-semibold"
            >
              <RotateCcw className="w-4 h-4" /> Tải lại
            </button>
          </div>
        ) : (
          posts.map((post, index) => {
            const isActive = index === currentIndex;
            const isLiked = likedPosts[post.id] ?? false;
            const likesDisplay = likeCounts[post.id] ?? post.likes_count;
            const postComments = comments[post.id] || [];

            return (
              <TikTokPostCard
                key={post.id}
                post={post}
                isActive={isActive}
                isMuted={isMuted}
                isLiked={isLiked}
                likesDisplay={likesDisplay}
                commentsCount={postComments.length}
                onToggleLike={() => handleToggleLike(post.id, post.likes_count)}
                onOpenComments={() => setActiveCommentPost(post)}
                onShare={() => handleShare(post)}
              />
            );
          })
        )}
      </div>

      {/* Bottom Sheet Bình luận */}
      <AnimatePresence>
        {activeCommentPost && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 top-1/3 bg-neutral-900 border-t border-neutral-800 rounded-t-3xl z-50 flex flex-col p-4 shadow-2xl"
          >
            {/* Header Sheet */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-sm font-bold text-white">
                Bình luận ({comments[activeCommentPost.id]?.length || 0})
              </span>
              <button
                type="button"
                onClick={() => setActiveCommentPost(null)}
                className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Danh sách bình luận */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {(comments[activeCommentPost.id] || []).length === 0 ? (
                <div className="text-center text-xs text-neutral-500 py-8">
                  Hãy là người đầu tiên bình luận về bé {activeCommentPost.pet_name}! 🐾
                </div>
              ) : (
                comments[activeCommentPost.id]?.map((cmt, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                      U{i + 1}
                    </div>
                    <div className="flex-1 bg-neutral-800/80 rounded-xl p-2 text-neutral-200">
                      <div className="font-semibold text-neutral-300 text-[11px] mb-0.5">
                        Bạn thú cưng #{i + 1}
                      </div>
                      <p>{cmt}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Ô nhập bình luận */}
            <div className="pt-2 flex items-center gap-2 border-t border-neutral-800">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddComment(activeCommentPost.id);
                }}
                placeholder="Gửi lời khen cho bé..."
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-full px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500"
              />
              <button
                type="button"
                onClick={() => handleAddComment(activeCommentPost.id)}
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

// Subcomponent: 1 Thẻ Video/Ảnh Full màn hình chuẩn TikTok
interface TikTokPostCardProps {
  post: PostItem;
  isActive: boolean;
  isMuted: boolean;
  isLiked: boolean;
  likesDisplay: number;
  commentsCount: number;
  onToggleLike: () => void;
  onOpenComments: () => void;
  onShare: () => void;
}

function TikTokPostCard({
  post,
  isActive,
  isMuted,
  isLiked,
  likesDisplay,
  commentsCount,
  onToggleLike,
  onOpenComments,
  onShare,
}: TikTokPostCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const isVideo =
    post.media_type === "video" ||
    post.media_url.endsWith(".mp4") ||
    post.media_url.endsWith(".webm");

  useEffect(() => {
    if (isVideo && videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
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
      {/* Media Display */}
      {isVideo ? (
        <video
          ref={videoRef}
          src={post.media_url}
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="relative w-full h-full">
          {/* Background blur cho ảnh */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
            style={{ backgroundImage: `url(${post.media_url})` }}
          />
          <img
            src={post.media_url}
            alt={post.pet_name}
            className="relative z-10 w-full h-full object-cover"
          />
        </div>
      )}

      {/* Icon tạm dừng khi bấm pause video */}
      {isVideo && !isPlaying && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
            <Play className="w-8 h-8 fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Hiệu ứng bay tim khi double tap */}
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

      {/* Gradient tối đáy để text luôn đọc rõ */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

      {/* Thanh Action Bên Phải (TikTok Style Sidebar) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-3 bottom-14 z-20 flex flex-col items-center gap-4 text-white"
      >
        {/* Avatar Pet */}
        <div className="relative group">
          <div className="w-12 h-12 rounded-full border-2 border-pink-500 overflow-hidden bg-neutral-800 shadow-lg">
            <img
              src={post.media_url}
              alt={post.pet_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center text-[10px] font-black text-white shadow-md">
            +
          </div>
        </div>

        {/* Nút Like (Trái tim) */}
        <button
          type="button"
          onClick={onToggleLike}
          className="flex flex-col items-center gap-1 group focus:outline-none"
        >
          <motion.div
            whileTap={{ scale: 1.3 }}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              isLiked
                ? "bg-rose-500/20 text-rose-500"
                : "bg-black/40 backdrop-blur-md text-white group-hover:text-rose-400"
            }`}
          >
            <Heart
              className={`w-6 h-6 transition-all ${
                isLiked ? "fill-rose-500 stroke-rose-500" : "stroke-white"
              }`}
            />
          </motion.div>
          <span className="text-[11px] font-bold drop-shadow">
            {likesDisplay}
          </span>
        </button>

        {/* Nút Bình luận */}
        <button
          type="button"
          onClick={onOpenComments}
          className="flex flex-col items-center gap-1 group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:text-cyan-400 transition-colors">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold drop-shadow">
            {commentsCount}
          </span>
        </button>

        {/* Nút Lưu Bookmark */}
        <button
          type="button"
          className="flex flex-col items-center gap-1 group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:text-amber-400 transition-colors">
            <Bookmark className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold drop-shadow">Lưu</span>
        </button>

        {/* Nút Chia sẻ */}
        <button
          type="button"
          onClick={onShare}
          className="flex flex-col items-center gap-1 group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:text-emerald-400 transition-colors">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold drop-shadow">Share</span>
        </button>

        {/* Đĩa nhạc xoay TikTok */}
        <div className="relative mt-2">
          <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center animate-[spin_4s_linear_infinite] shadow-xl overflow-hidden">
            <img
              src={post.media_url}
              alt="disc"
              className="w-5 h-5 rounded-full object-cover"
            />
          </div>
          <Music className="w-3 h-3 text-pink-400 absolute -top-1 -right-1 animate-bounce" />
        </div>
      </div>

      {/* Thông tin mô tả bên góc dưới trái */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute left-4 bottom-5 right-20 z-20 text-white"
      >
        {/* Tên Pet */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-extrabold text-base tracking-wide drop-shadow">
            @{post.pet_name}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/80 font-bold tracking-tight">
            Follow
          </span>
        </div>

        {/* Caption */}
        <p className="text-xs text-neutral-200 line-clamp-2 leading-relaxed drop-shadow mb-2 font-normal">
          {post.caption || "Bé cưng siêu đáng yêu trên PetTinder! 🐾"}
        </p>

        {/* Âm thanh chạy chữ */}
        <div className="flex items-center gap-2 text-[11px] text-neutral-300">
          <Music className="w-3 h-3 text-pink-400 shrink-0" />
          <span className="truncate">
            Âm thanh gốc - Giai điệu vui nhộn PetTinder • {post.pet_name}
          </span>
        </div>
      </div>
    </div>
  );
}
