"use client";

import React, { useState } from "react";
import {
  Search,
  X,
  Flame,
  PlaySquare,
  Stethoscope,
  BookOpen,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TabType } from "@/components/BottomNav";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  onNavigateTab,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");

  const searchCategories = [
    {
      type: "match" as TabType,
      categoryName: "Thú cưng ghép đôi (Match)",
      icon: Flame,
      color: "text-pink-400 bg-pink-500/15",
      items: [
        { title: "Mochi Corgi", subtitle: "Chó Corgi • 2 tuổi • Mục đích: Tìm bạn đi dạo" },
        { title: "Bơ Lông Ngắn", subtitle: "Mèo Anh • 1.5 tuổi • Mục đích: Phối giống" },
        { title: "Simba Golden", subtitle: "Chó Golden • 2.5 tuổi • Mục đích: Giao lưu" },
        { title: "Bông Samoyed", subtitle: "Chó Samoyed • 3 tuổi • Mục đích: Nhận nuôi" },
      ],
    },
    {
      type: "reels" as TabType,
      categoryName: "Thước phim (Pet Reels)",
      icon: PlaySquare,
      color: "text-purple-400 bg-purple-500/15",
      items: [
        { title: "Video Corgi lắc mông", subtitle: "Thước phim chạy bộ buổi sáng #corgi" },
        { title: "Mèo Bơ ăn cá hồi", subtitle: "Video ASMR thú cưng siêu cuốn #catfood" },
        { title: "Simba bắt bóng đỉnh", subtitle: "Kỷ lục bắt 10 trái bóng tennis #doglife" },
      ],
    },
    {
      type: "health" as TabType,
      categoryName: "Bệnh viện & Y tế",
      icon: Stethoscope,
      color: "text-emerald-400 bg-emerald-500/15",
      items: [
        { title: "Bệnh Viện Thú Y PetCare Quốc Tế", subtitle: "Cấp cứu 24/7 • Q7, TP.HCM • 1.2 km" },
        { title: "Bệnh Viện Thú Y 2Vet Hà Nội", subtitle: "Cấp cứu 24/7 • Ba Đình, Hà Nội • 2.1 km" },
        { title: "Samyang Animal Clinic", subtitle: "Thảo Điền, TP. Thủ Đức • 2.8 km" },
      ],
    },
    {
      type: "health" as TabType,
      categoryName: "Cẩm nang chăm sóc (Handbook)",
      icon: BookOpen,
      color: "text-cyan-400 bg-cyan-500/15",
      items: [
        { title: "Chế độ dinh dưỡng cho cún con", subtitle: "Lượng canxi, protein & thức ăn cấm kỵ" },
        { title: "Lịch tiêm phòng vắc-xin 7 bệnh", subtitle: "Thời điểm tiêm phòng Parvo, Care chuẩn" },
        { title: "Dấu hiệu bệnh Giảm Bạch Cầu ở mèo", subtitle: "Triệu chứng khẩn cấp cần đi viện ngay" },
      ],
    },
    {
      type: "lost" as TabType,
      categoryName: "Tìm thú cưng đi lạc (Lost & Found)",
      icon: AlertTriangle,
      color: "text-rose-400 bg-rose-500/15",
      items: [
        { title: "Bé Cún Bông đi lạc", subtitle: "Khu vực Cầu Giấy, Hà Nội • Thưởng 5tr" },
        { title: "Mèo Miu Miu thất lạc", subtitle: "Chung cư Quận 7, TP.HCM • Thưởng 3tr" },
      ],
    },
  ];

  const q = query.toLowerCase().trim();

  const filteredCategories = searchCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          cat.categoryName.toLowerCase().includes(q)
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: -20 }}
          className="w-full max-w-sm sm:max-w-md max-h-[85vh] bg-neutral-900 border border-neutral-700 rounded-3xl p-4 flex flex-col shadow-2xl overflow-hidden font-sans"
        >
          {/* Ô Tìm Kiếm Toàn Hệ Thống */}
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm thú cưng, reels, bệnh viện, bài viết..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-neutral-800 border border-neutral-700 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-pink-500 transition"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition shrink-0"
              title="Đóng tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Danh Sách Kết Quả Phân Loại */}
          <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-10 text-neutral-500 text-xs">
                Không tìm thấy kết quả phù hợp với "{query}".
              </div>
            ) : (
              filteredCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.categoryName} className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-1">
                      <Icon className="w-3.5 h-3.5 text-pink-400" />
                      <span>{cat.categoryName}</span>
                    </div>

                    <div className="space-y-1">
                      {cat.items.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            onNavigateTab(cat.type);
                            onClose();
                          }}
                          className="p-2.5 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/50 hover:border-pink-500/50 transition cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition truncate">
                                {item.title}
                              </h4>
                              <p className="text-[10.5px] text-neutral-400 truncate">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-pink-400 group-hover:translate-x-1 transition shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
