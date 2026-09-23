"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Search,
  Phone,
  MapPin,
  Calendar,
  Gift,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Upload,
  User,
  X,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface LostPetPost {
  id: string;
  type: "lost" | "found";
  petName: string;
  species: string;
  breed: string;
  image: string;
  lostLocation: string;
  lostDate: string;
  reward?: string;
  phone: string;
  description: string;
  tagId?: string;
}

const INITIAL_LOST_POSTS: LostPetPost[] = [
  {
    id: "lost-1",
    type: "lost",
    petName: "Bé Cún Bông",
    species: "Chó",
    breed: "Poodle Trắng",
    image: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80",
    lostLocation: "Khu vực Công viên Cầu Giấy, Hà Nội",
    lostDate: "Hôm qua (22/09)",
    reward: "5.000.000 VNĐ",
    phone: "0987 112 233",
    description: "Bé đeo vòng cổ da màu đỏ có gắn chuông nhỏ, rất nhát người lạ. Ai thấy xin giữ bé giúp gia đình!",
    tagId: "PET-VN-8821",
  },
  {
    id: "lost-2",
    type: "lost",
    petName: "Mèo Miu Miu",
    species: "Mèo",
    breed: "Mèo Xiêm Mắt Xanh",
    image: "https://images.unsplash.com/photo-1513360309081-38f076278f1e?auto=format&fit=crop&w=600&q=80",
    lostLocation: "Chung cư Sunrise City, Quận 7, TP.HCM",
    lostDate: "20/09/2026",
    reward: "3.000.000 VNĐ",
    phone: "0912 334 455",
    description: "Bé chạy ra ngoài khi mở cửa giao hàng, có vệt lông nâu ở mũi và mắt xanh biếc.",
    tagId: "PET-SG-4412",
  },
  {
    id: "found-1",
    type: "found",
    petName: "Bé Corgi Lạc (Chưa rõ tên)",
    species: "Chó",
    breed: "Corgi Vàng Trắng",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
    lostLocation: "Gần Hồ Con Rùa, Quận 3, TP.HCM",
    lostDate: "Sáng nay (23/09)",
    phone: "0908 667 788",
    description: "Nhặt được bé đang đi lạc ướt lông dưới mưa. Bé rất ngoan, hiện đang được chăm sóc tại quán cafe thú cưng.",
    tagId: "PET-SG-9931",
  },
];

export default function LostAndFoundTab() {
  const [posts, setPosts] = useState<LostPetPost[]>(INITIAL_LOST_POSTS);
  const [activeSubTab, setActiveSubTab] = useState<"all" | "lost" | "found" | "lookup">("all");
  const [showPostModal, setShowPostModal] = useState(false);
  const [postType, setPostType] = useState<"lost" | "found">("lost");

  // Form đăng tin
  const [formName, setFormName] = useState("");
  const [formSpecies, setFormSpecies] = useState("Chó");
  const [formBreed, setFormBreed] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formReward, setFormReward] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formImage, setFormImage] = useState<string | null>(null);

  // Tra cứu vòng cổ / SĐT
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResult, setLookupResult] = useState<LostPetPost | null>(null);
  const [lookupSearched, setLookupSearched] = useState(false);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLocation || !formPhone) {
      alert("Vui lòng nhập địa điểm và số điện thoại liên hệ!");
      return;
    }

    const newPost: LostPetPost = {
      id: `custom-${Date.now()}`,
      type: postType,
      petName: formName || (postType === "lost" ? "Bé chưa đặt tên" : "Bé đi lạc"),
      species: formSpecies,
      breed: formBreed || "Không rõ",
      image:
        formImage ||
        (formSpecies === "Mèo"
          ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80"
          : "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80"),
      lostLocation: formLocation,
      lostDate: "Vừa đăng",
      reward: formReward ? `${formReward} VNĐ` : undefined,
      phone: formPhone,
      description: formDesc,
      tagId: `TAG-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setPosts([newPost, ...posts]);
    setShowPostModal(false);
    // Reset form
    setFormName("");
    setFormBreed("");
    setFormLocation("");
    setFormPhone("");
    setFormReward("");
    setFormDesc("");
    setFormImage(null);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    setLookupSearched(true);
    const q = lookupQuery.toLowerCase().trim();
    const found = posts.find(
      (p) =>
        p.phone.replace(/\s+/g, "").includes(q.replace(/\s+/g, "")) ||
        p.tagId?.toLowerCase().includes(q) ||
        p.petName.toLowerCase().includes(q)
    );
    setLookupResult(found || null);
  };

  const filteredPosts = posts.filter((p) => {
    if (activeSubTab === "all") return true;
    if (activeSubTab === "lost") return p.type === "lost";
    if (activeSubTab === "found") return p.type === "found";
    return true;
  });

  return (
    <div className="w-full h-full bg-neutral-900 overflow-y-auto flex flex-col select-none font-sans">
      {/* Header & Sub-tabs */}
      <div className="p-3 bg-neutral-950/80 border-b border-neutral-800 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-black text-white">Tìm Thú Cưng Đi Lạc</h2>
              <p className="text-[10px] text-neutral-400">
                Mạng lưới hỗ trợ tìm kiếm & cứu hộ thú cưng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 hover:brightness-110 active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Đăng tin</span>
          </button>
        </div>

        {/* 4 Tabs phụ: Tất cả | Cần tìm (Mất) | Nhặt được | Tra cứu vòng cổ */}
        <div className="flex p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-[11px] font-bold">
          {[
            { id: "all", label: "Tất cả tin" },
            { id: "lost", label: "🚨 Bé đi lạc" },
            { id: "found", label: "🐾 Nhặt được" },
            { id: "lookup", label: "🔍 Tra cứu chủ" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 py-1.5 rounded-lg transition ${
                activeSubTab === tab.id
                  ? "bg-rose-500 text-white shadow"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3.5 sm:p-4 flex-1 space-y-3.5">
        {/* ======================================================== */}
        {/* PHẦN 1: TRA CỨU SỐ ĐIỆN THOẠI / VÒNG CỔ                   */}
        {/* ======================================================== */}
        {activeSubTab === "lookup" ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700 shadow-md">
              <h3 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Tra cứu chủ nhân qua Vòng cổ & SĐT</span>
              </h3>
              <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
                Nếu bạn nhặt được thú cưng có đeo bảng tên, mã microchip hoặc số điện thoại, hãy nhập vào ô bên dưới để tra cứu thông tin chủ nhân trong hệ thống PetTinder.
              </p>

              <form onSubmit={handleLookup} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  placeholder="Nhập SĐT hoặc Mã vòng cổ (VD: PET-VN-8821)..."
                  className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-md hover:bg-rose-600 transition"
                >
                  Tra cứu
                </button>
              </form>
            </div>

            {/* Kết quả tra cứu */}
            {lookupSearched && (
              <div>
                {lookupResult ? (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 shadow-xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Đã tìm thấy thông tin trong hệ thống PetTinder!</span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                        <img
                          src={lookupResult.image}
                          alt={lookupResult.petName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-sm text-white">
                          {lookupResult.petName}
                        </h4>
                        <div className="text-[11px] text-neutral-300">
                          {lookupResult.species} • {lookupResult.breed}
                        </div>
                        <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                          Mã ID: {lookupResult.tagId}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800">
                      {lookupResult.description}
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400">
                        SĐT Chủ nuôi: <strong className="text-white">{lookupResult.phone}</strong>
                      </span>
                      <a
                        href={`tel:${lookupResult.phone.replace(/\s+/g, "")}`}
                        className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/25"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Gọi cho chủ ngay</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-neutral-800/40 border border-neutral-700/60 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-neutral-700/50 flex items-center justify-center mx-auto text-neutral-400">
                      ✕
                    </div>
                    <h4 className="text-xs font-bold text-white">Không tìm thấy kết quả</h4>
                    <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                      Không có thông tin khớp với từ khóa "{lookupQuery}". Bạn có thể đăng bài "Nhặt được bé" để chủ nhân nhận diện!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setPostType("found");
                        setShowPostModal(true);
                      }}
                      className="px-4 py-2 rounded-full bg-pink-500 text-white text-xs font-bold shadow transition"
                    >
                      Đăng tin nhặt được bé
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ======================================================== */
          /* PHẦN 2: DANH SÁCH BÀI ĐĂNG TÌM BÉ ĐI LẠC / NHẶT ĐƯỢC    */
          /* ======================================================== */
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`p-3.5 rounded-2xl border transition shadow-lg ${
                  post.type === "lost"
                    ? "bg-rose-950/20 border-rose-500/40 hover:border-rose-500"
                    : "bg-neutral-800/70 border-neutral-700 hover:border-cyan-500"
                }`}
              >
                {/* Header thẻ bài */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        post.type === "lost"
                          ? "bg-rose-500 text-white shadow-sm"
                          : "bg-cyan-500 text-white shadow-sm"
                      }`}
                    >
                      {post.type === "lost" ? "Cần tìm bé" : "Nhặt được"}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-medium">
                      {post.lostDate}
                    </span>
                  </div>

                  {post.reward && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px]">
                      <Gift className="w-3 h-3 text-amber-400" />
                      <span>Hậu tạ: {post.reward}</span>
                    </span>
                  )}
                </div>

                {/* Nội dung chính: Ảnh & Chi tiết */}
                <div className="flex gap-3 mb-2.5">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700 shrink-0">
                    <img
                      src={post.image}
                      alt={post.petName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-sm text-white truncate mb-0.5">
                      {post.petName}
                    </h3>
                    <div className="text-[11px] text-neutral-300 font-medium mb-1">
                      {post.species} • {post.breed}
                    </div>
                    <div className="flex items-start gap-1 text-[11px] text-rose-300/90 leading-tight">
                      <MapPin className="w-3 h-3 shrink-0 text-rose-400 mt-0.5" />
                      <span className="line-clamp-2">{post.lostLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Mô tả chi tiết */}
                <p className="text-[11.5px] text-neutral-300 leading-relaxed mb-3 bg-neutral-900/50 p-2 rounded-xl">
                  {post.description}
                </p>

                {/* Footer thẻ: Nút gọi điện khẩn cấp */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {post.tagId ? `Mã: ${post.tagId}` : ""}
                  </span>

                  <a
                    href={`tel:${post.phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 hover:brightness-110 active:scale-95 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi {post.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL ĐĂNG TIN TÌM BÉ / BÁO NHẶT ĐƯỢC                   */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm max-h-[92vh] bg-neutral-900 border border-neutral-700 rounded-3xl p-5 flex flex-col overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-neutral-800 mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <h3 className="font-bold text-xs text-white">Đăng tin thú cưng thất lạc</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Toggle Loại tin: Báo mất / Nhặt được */}
              <div className="flex p-1 bg-neutral-800 rounded-xl mb-3 border border-neutral-700 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPostType("lost")}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    postType === "lost"
                      ? "bg-rose-500 text-white shadow"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Cần tìm bé (Mất)
                </button>
                <button
                  type="button"
                  onClick={() => setPostType("found")}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    postType === "found"
                      ? "bg-cyan-500 text-white shadow"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Nhặt được bé
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-3">
                {/* Tải ảnh */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Ảnh chụp bé
                  </label>
                  <label className="w-full h-24 border-2 border-dashed border-neutral-700 hover:border-rose-500 rounded-2xl bg-neutral-800/50 flex flex-col items-center justify-center gap-1 text-neutral-400 cursor-pointer">
                    {formImage ? (
                      <img src={formImage} alt="preview" className="h-full rounded-xl object-contain" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-rose-400" />
                        <span className="text-[10px]">Tải ảnh nhận diện bé</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setFormImage(URL.createObjectURL(f));
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      Tên bé
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="VD: Cún Bông..."
                      className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      Loài
                    </label>
                    <select
                      value={formSpecies}
                      onChange={(e) => setFormSpecies(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs"
                    >
                      <option value="Chó">Chó</option>
                      <option value="Mèo">Mèo</option>
                      <option value="Chim">Chim</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Địa điểm thất lạc / Nhặt được <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="VD: Khu vực đường Lê Lợi, Quận 1, TP.HCM"
                    className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      SĐT liên hệ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="09xx xxx xxx"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  {postType === "lost" && (
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                        Mức thưởng (VNĐ)
                      </label>
                      <input
                        type="text"
                        value={formReward}
                        onChange={(e) => setFormReward(e.target.value)}
                        placeholder="VD: 2.000.000"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Đặc điểm nhận diện chi tiết
                  </label>
                  <textarea
                    rows={2}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Màu lông, vòng cổ, vết đốm đặc biệt..."
                    className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 hover:brightness-110 active:scale-95 transition"
                >
                  Đăng tin tìm kiếm ngay 📢
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
