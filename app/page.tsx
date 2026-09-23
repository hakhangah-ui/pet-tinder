"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Flame, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav, { TabType } from "@/components/BottomNav";
import MatchTab from "@/components/MatchTab";
import PetReelsTab from "@/components/PetReelsTab";
import HealthAndHandbookTab from "@/components/HealthAndHandbookTab";
import LostAndFoundTab from "@/components/LostAndFoundTab";
import ProfileTab from "@/components/ProfileTab";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import { supabase } from "@/lib/supabase";

export interface PetCardData {
  id: string;
  name: string;
  age: string;
  species: string;
  breed: string;
  vaccinated: boolean;
  vaccineDetails: string;
  distance: string;
  image: string;
  bio: string;
  personality: string[];
  purpose: "Phối giống" | "Tìm bạn đi dạo" | "Nhận nuôi" | "Giao lưu";
}

const PET_ENRICHMENTS: Record<
  string,
  {
    age: string;
    image: string;
    vaccineDetails: string;
    distance: string;
    bio: string;
    personality: string[];
    purpose: "Phối giống" | "Tìm bạn đi dạo" | "Nhận nuôi" | "Giao lưu";
  }
> = {
  Mochi: {
    age: "2 tuổi",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80",
    vaccineDetails: "Đã tiêm 7 bệnh & Dại (Sổ tiêm hợp lệ)",
    distance: "Cách bạn 1.8 km",
    bio: "Mông to chân ngắn, mê chạy nhảy ở công viên và ăn ức gà luộc. Đang tìm bạn đi dạo cuối tuần!",
    personality: ["Thân thiện", "Năng động", "Thích vuốt mông"],
    purpose: "Tìm bạn đi dạo",
  },
  Bơ: {
    age: "1.5 tuổi",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80",
    vaccineDetails: "Đầy đủ 3 mũi phòng bệnh & Dại",
    distance: "Cách bạn 2.5 km",
    bio: "Ngoan ngoãn, thích sưởi nắng bên cửa sổ và rên gừ gừ khi được cào cằm. Rất hiền, không cào cắn bao giờ.",
    personality: ["Điềm tĩnh", "Quấn chủ", "Thích cào cằm"],
    purpose: "Phối giống",
  },
  Simba: {
    age: "2.5 tuổi",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80",
    vaccineDetails: "Tiêm chủng định kỳ & Cấy vi mạch ID",
    distance: "Cách bạn 3.2 km",
    bio: "Chàng trai vàng trong làng bơi lội và nhặt bóng tennis. Yêu trẻ con và hòa đồng với mọi bé chó mèo khác.",
    personality: ["Biết bắt tay", "Biết bơi", "Hòa đồng"],
    purpose: "Tìm bạn đi dạo",
  },
  Bông: {
    age: "3 tuổi",
    image:
      "https://images.unsplash.com/photo-1529429617124-95b109e86bb8?auto=format&fit=crop&w=1000&q=80",
    vaccineDetails: "Chứng nhận vắc-xin điện tử chuẩn",
    distance: "Cách bạn 4.0 km",
    bio: "Công chúa tuyết trắng mịn. Nụ cười thiên thần sẵn sàng làm tan chảy trái tim bạn!",
    personality: ["Thích tạo dáng", "Lông mịn", "Nụ cười Samoyed"],
    purpose: "Nhận nuôi",
  },
  "Đậu Phộng": {
    age: "8 tháng",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1000&q=80",
    vaccineDetails: "Đã hoàn thành mũi cơ bản & Sổ giun",
    distance: "Cách bạn 1.2 km",
    bio: "Bé nhỏ xíu mê chui rúc vào hộp các-tông và săn cần câu mèo. Rất thích giao lưu bạn mới!",
    personality: ["Hiếu động", "Đáng yêu", "Mê cỏ mèo"],
    purpose: "Tìm bạn đi dạo",
  },
  Lu: {
    age: "2 tuổi",
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80",
    vaccineDetails: "Hộ chiếu thú cưng & Tiêm ngừa đầy đủ",
    distance: "Cách bạn 5.1 km",
    bio: "Thánh biểu cảm meme nhưng bên trong ấm áp. Cực kỳ trung thành, sạch sẽ và biết nghe lời.",
    personality: ["Cá tính", "Biết giữ nhà", "Chuẩn meme"],
    purpose: "Phối giống",
  },
};

const DEFAULT_PETS: PetCardData[] = [
  {
    id: "mock-1",
    name: "Mochi",
    species: "Chó",
    breed: "Corgi Chân Ngắn",
    vaccinated: true,
    ...PET_ENRICHMENTS["Mochi"],
  },
  {
    id: "mock-2",
    name: "Bơ",
    species: "Mèo",
    breed: "Anh Lông Ngắn (Golden)",
    vaccinated: true,
    ...PET_ENRICHMENTS["Bơ"],
  },
  {
    id: "mock-3",
    name: "Simba",
    species: "Chó",
    breed: "Golden Retriever",
    vaccinated: true,
    ...PET_ENRICHMENTS["Simba"],
  },
  {
    id: "mock-4",
    name: "Bông",
    species: "Chó",
    breed: "Samoyed Tuyết",
    vaccinated: true,
    ...PET_ENRICHMENTS["Bông"],
  },
  {
    id: "mock-5",
    name: "Đậu Phộng",
    species: "Mèo",
    breed: "Munchkin Tai Cụp",
    vaccinated: true,
    ...PET_ENRICHMENTS["Đậu Phộng"],
  },
  {
    id: "mock-6",
    name: "Lu",
    species: "Chó",
    breed: "Shiba Inu",
    vaccinated: true,
    ...PET_ENRICHMENTS["Lu"],
  },
];

export default function PetTinderMainApp() {
  const [activeTab, setActiveTab] = useState<TabType>("match");
  const [pets, setPets] = useState<PetCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const loadPets = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("pets").select("*");

      if (error || !data || data.length === 0) {
        setPets(DEFAULT_PETS);
        setIsSupabaseConnected(false);
      } else {
        setIsSupabaseConnected(true);
        const enriched: PetCardData[] = data.map((item, idx) => {
          const enrich = PET_ENRICHMENTS[item.name] || {
            age: "1-2 tuổi",
            image:
              item.species.toLowerCase() === "mèo" ||
              item.species.toLowerCase() === "cat"
                ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80"
                : "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80",
            vaccineDetails: item.vaccination_verified
              ? "Chứng nhận tiêm chủng hợp lệ"
              : "Đang cập nhật sổ tiêm",
            distance: `Cách bạn ${(1.2 + idx * 0.7).toFixed(1)} km`,
            bio: `Bé ${item.name} thuộc giống ${item.breed}, rất ngoan và đáng yêu.`,
            personality: ["Đáng yêu", "Thân thiện", "Khỏe mạnh"],
            purpose: idx % 2 === 0 ? "Phối giống" : "Tìm bạn đi dạo",
          };

          return {
            id: String(item.id),
            name: item.name,
            species: item.species,
            breed: item.breed,
            vaccinated: Boolean(item.vaccination_verified),
            ...enrich,
          };
        });
        setPets(enriched);
      }
    } catch {
      setPets(DEFAULT_PETS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-2 sm:p-4 select-none overflow-hidden font-sans">
      {/* Khung di động trung tâm */}
      <div className="relative w-full max-w-sm sm:max-w-md h-[844px] max-h-[96vh] bg-neutral-900 rounded-[32px] sm:rounded-[40px] shadow-2xl border border-neutral-800 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md z-30">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
              activeTab === "profile"
                ? "text-pink-500 bg-pink-500/10"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
            title="Tài khoản"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Logo & Tab Header Title */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center shadow-md shadow-pink-500/20">
                <Flame className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span className="text-base font-black tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 bg-clip-text text-transparent">
                PetTinder
              </span>
            </div>
            <div className="flex items-center gap-1 text-[9.5px] text-neutral-400">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSupabaseConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span className="uppercase text-[9px] font-semibold text-neutral-400">
                {activeTab === "match"
                  ? "Ghép đôi"
                  : activeTab === "reels"
                  ? "Pet Reels"
                  : activeTab === "health"
                  ? "Y tế & Cẩm nang"
                  : activeTab === "lost"
                  ? "Tìm thú cưng đi lạc"
                  : "Tài khoản"}
              </span>
            </div>
          </div>

          {/* NÚT TÌM KIẾM TOÀN HỆ THỐNG (KÍNH LÚP) */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-pink-400 hover:bg-neutral-800 transition"
            title="Tìm kiếm toàn hệ thống"
          >
            <Search className="w-4 h-4" />
          </button>
        </header>

        {/* Nội dung chính 5 Tab với Framer Motion mượt mà */}
        <div className="relative flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {/* Tab 1: Match */}
            {activeTab === "match" && (
              <motion.div
                key="tab-match"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col"
              >
                <MatchTab
                  pets={pets}
                  setPets={setPets}
                  loadPets={loadPets}
                  isLoading={isLoading}
                />
              </motion.div>
            )}

            {/* Tab 2: Pet Reels */}
            {activeTab === "reels" && (
              <motion.div
                key="tab-reels"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col"
              >
                <PetReelsTab />
              </motion.div>
            )}

            {/* Tab 3: Y tế & Sổ tay cẩm nang */}
            {activeTab === "health" && (
              <motion.div
                key="tab-health"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col"
              >
                <HealthAndHandbookTab />
              </motion.div>
            )}

            {/* Tab 4: Tìm thú cưng đi lạc */}
            {activeTab === "lost" && (
              <motion.div
                key="tab-lost"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col"
              >
                <LostAndFoundTab />
              </motion.div>
            )}

            {/* Tab 5: Tài khoản */}
            {activeTab === "profile" && (
              <motion.div
                key="tab-profile"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col"
              >
                <ProfileTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Thanh Điều Hướng 5 Tab Dưới Cùng */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          unreadCount={pets.length}
        />

        {/* Modal Tìm Kiếm Toàn Hệ Thống */}
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigateTab={(targetTab) => setActiveTab(targetTab)}
        />
      </div>
    </main>
  );
}
