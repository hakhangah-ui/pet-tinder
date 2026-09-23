"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  PanInfo,
} from "framer-motion";
import {
  Heart,
  X,
  Star,
  CheckCircle2,
  MapPin,
  RotateCcw,
  Sparkles,
  Info,
  ChevronDown,
  SlidersHorizontal,
  Filter,
} from "lucide-react";
import { PetCardData } from "@/app/page";
import { supabase } from "@/lib/supabase";

interface MatchTabProps {
  pets: PetCardData[];
  setPets: React.Dispatch<React.SetStateAction<PetCardData[]>>;
  loadPets: () => void;
  isLoading: boolean;
  onSwipeSuccess?: () => void;
}

type SwipeAction = "left" | "right" | "up";

export default function MatchTab({
  pets,
  setPets,
  loadPets,
  isLoading,
  onSwipeSuccess,
}: MatchTabProps) {
  const [history, setHistory] = useState<PetCardData[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [matchNotification, setMatchNotification] = useState<PetCardData | null>(null);

  // Bộ lọc Match Linh Hoạt
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterPurpose, setFilterPurpose] = useState<string>("Tất cả");
  const [filterSpecies, setFilterSpecies] = useState<string>("Tất cả");
  const [filterRadius, setFilterRadius] = useState<number>(30); // 1 - 50 km
  const [filterOnlyVaccinated, setFilterOnlyVaccinated] = useState<boolean>(false);

  // Lọc danh sách theo tiêu chí
  const filteredPets = pets.filter((pet) => {
    if (filterPurpose !== "Tất cả" && pet.purpose && pet.purpose !== filterPurpose) {
      return false;
    }
    if (filterSpecies !== "Tất cả" && !pet.species.toLowerCase().includes(filterSpecies.toLowerCase())) {
      return false;
    }
    if (filterOnlyVaccinated && !pet.vaccinated) {
      return false;
    }
    // Giả lập tính khoảng cách
    const distanceNum = parseFloat(pet.distance.replace(/[^0-9.]/g, "")) || 5;
    if (distanceNum > filterRadius) {
      return false;
    }
    return true;
  });

  const activePet = filteredPets[filteredPets.length - 1];

  const saveSwipeToSupabase = async (petId: string, actionType: string) => {
    try {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(petId);
      await supabase.from("swipes").insert({
        to_pet_id: isUuid ? petId : null,
        action: actionType,
      });
      onSwipeSuccess?.();
    } catch (e) {
      console.warn("Lỗi khi ghi swipes:", e);
    }
  };

  const handleSwipe = (direction: SwipeAction) => {
    if (!activePet) return;

    setShowDetail(false);
    const poppedPet = filteredPets[filteredPets.length - 1];
    setHistory((prev) => [...prev, poppedPet]);
    setPets((prev) => prev.filter((p) => p.id !== poppedPet.id));

    let actionLabel = "";
    let dbAction = "pass";

    if (direction === "right") {
      actionLabel = `Bạn đã thích ${poppedPet.name}! 💖`;
      dbAction = "like";
      if (Math.random() > 0.35) {
        setMatchNotification(poppedPet);
      }
    } else if (direction === "left") {
      actionLabel = `Đã bỏ qua ${poppedPet.name}.`;
      dbAction = "pass";
    } else if (direction === "up") {
      actionLabel = `⭐ Bạn đã SUPER LIKE ${poppedPet.name}!`;
      dbAction = "super_like";
      setMatchNotification(poppedPet);
    }

    setLastAction(actionLabel);
    saveSwipeToSupabase(poppedPet.id, dbAction);
  };

  const handleRewind = () => {
    if (history.length === 0) return;
    const lastPet = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setPets((prev) => [...prev, lastPet]);
    setLastAction(`Đã hoàn tác: ${lastPet.name}`);
  };

  const isFilterActive =
    filterPurpose !== "Tất cả" ||
    filterSpecies !== "Tất cả" ||
    filterRadius < 50 ||
    filterOnlyVaccinated;

  return (
    <div className="relative flex-1 flex flex-col justify-between overflow-hidden">
      {/* Thanh điều khiển phụ: Bật bộ lọc Match */}
      <div className="px-4 py-1.5 flex items-center justify-between text-xs text-neutral-400 z-20">
        <span className="text-[11px] font-medium">
          Còn <strong className="text-white">{filteredPets.length}</strong> bé phù hợp
        </span>

        <button
          type="button"
          onClick={() => setShowFilterModal(true)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold transition ${
            isFilterActive
              ? "bg-pink-500/20 border-pink-500 text-pink-300"
              : "bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:text-white"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-pink-400" />
          <span>Bộ lọc Match</span>
          {isFilterActive && (
            <span className="w-2 h-2 rounded-full bg-pink-500 ml-0.5" />
          )}
        </button>
      </div>

      {/* Vùng Thẻ Bài Quẹt */}
      <div className="relative flex-1 p-3.5 flex items-center justify-center overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 text-neutral-400">
            <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
            <span className="text-xs">Đang tải danh sách thú cưng...</span>
          </div>
        ) : (
          <AnimatePresence>
            {filteredPets.length > 0 ? (
              filteredPets.map((pet, index) => {
                const isTop = index === filteredPets.length - 1;
                const isUnder = index === filteredPets.length - 2;

                if (!isTop && !isUnder) return null;

                return (
                  <SwipeableCard
                    key={pet.id}
                    pet={pet}
                    isTop={isTop}
                    showDetail={isTop && showDetail}
                    setShowDetail={setShowDetail}
                    onSwipe={handleSwipe}
                  />
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center px-6 py-8"
              >
                <div className="w-20 h-20 rounded-full bg-neutral-800/80 border border-neutral-700 flex items-center justify-center mb-4 text-3xl shadow-inner">
                  🐾
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Đã xem hết thú cưng quanh bạn!
                </h3>
                <p className="text-xs text-neutral-400 mb-5 max-w-xs">
                  {isFilterActive
                    ? "Không có thêm bé nào thỏa mãn bộ lọc hiện tại. Thử nới rộng bán kính hoặc chọn mục đích khác nhé!"
                    : "Bạn đã quẹt qua tất cả các bé trong khu vực. Hãy làm mới danh sách để quẹt lại nhé!"}
                </p>
                <div className="flex gap-2">
                  {isFilterActive && (
                    <button
                      type="button"
                      onClick={() => {
                        setFilterPurpose("Tất cả");
                        setFilterSpecies("Tất cả");
                        setFilterRadius(50);
                        setFilterOnlyVaccinated(false);
                      }}
                      className="px-4 py-2 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold"
                    >
                      Đặt lại bộ lọc
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={loadPets}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold text-xs shadow-lg shadow-pink-500/25 hover:brightness-110 active:scale-95 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Tải lại danh sách
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Thông báo thao tác nhanh */}
      {lastAction && filteredPets.length > 0 && (
        <div className="text-center text-[11px] text-neutral-400 py-0.5 font-medium tracking-wide">
          {lastAction}
        </div>
      )}

      {/* 3 Nút Thao Tác Bên Dưới: Bỏ qua (X), Super Like (Ngôi sao), Like (Trái tim) */}
      <footer className="px-5 py-2.5 pb-3 flex items-center justify-center gap-4 sm:gap-5 z-20">
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.08 }}
          onClick={handleRewind}
          disabled={history.length === 0}
          className="w-10 h-10 rounded-full bg-neutral-800/90 border border-neutral-700 text-amber-400 flex items-center justify-center shadow-md disabled:opacity-30 disabled:pointer-events-none transition"
          title="Quay lại bé trước"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08 }}
          onClick={() => handleSwipe("left")}
          disabled={filteredPets.length === 0}
          className="w-14 h-14 rounded-full bg-neutral-900 border-2 border-red-500/80 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center shadow-lg shadow-red-500/15 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          title="Bỏ qua (X)"
        >
          <X className="w-7 h-7 stroke-[2.5]" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08 }}
          onClick={() => handleSwipe("up")}
          disabled={filteredPets.length === 0}
          className="w-11 h-11 rounded-full bg-neutral-900 border-2 border-cyan-400/80 text-cyan-400 hover:bg-cyan-400 hover:text-neutral-950 flex items-center justify-center shadow-lg shadow-cyan-400/20 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          title="Super Like (Ngôi sao)"
        >
          <Star className="w-5 h-5 fill-current stroke-[1.5]" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08 }}
          onClick={() => handleSwipe("right")}
          disabled={filteredPets.length === 0}
          className="w-14 h-14 rounded-full bg-neutral-900 border-2 border-emerald-400/80 text-emerald-400 hover:bg-emerald-400 hover:text-white flex items-center justify-center shadow-lg shadow-emerald-400/20 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          title="Thích (Trái tim)"
        >
          <Heart className="w-7 h-7 fill-current stroke-[1.5]" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.08 }}
          className="w-10 h-10 rounded-full bg-neutral-800/90 border border-neutral-700 text-purple-400 flex items-center justify-center shadow-md hover:bg-neutral-800 transition"
          title="Tăng tốc"
        >
          <Sparkles className="w-4 h-4 fill-current" />
        </motion.button>
      </footer>

      {/* ======================================================== */}
      {/* MODAL BỘ LỌC MATCH LINH HOẠT                             */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-3xl p-5 shadow-2xl flex flex-col space-y-4 font-sans"
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-pink-500" />
                  <h3 className="font-bold text-xs text-white">Bộ lọc tìm bạn ghép đôi</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilterModal(false)}
                  className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Lọc theo Mục đích */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1.5">
                  Mục đích ghép đôi
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {["Tất cả", "Phối giống", "Tìm bạn đi dạo", "Nhận nuôi"].map((pur) => (
                    <button
                      key={pur}
                      type="button"
                      onClick={() => setFilterPurpose(pur)}
                      className={`py-2 px-2.5 rounded-xl border text-center font-medium transition ${
                        filterPurpose === pur
                          ? "bg-pink-500/20 border-pink-500 text-pink-300 font-bold"
                          : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {pur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lọc theo Giống loài */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1.5">
                  Giống loài
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {["Tất cả", "Chó", "Mèo"].map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => setFilterSpecies(sp)}
                      className={`py-2 rounded-xl border text-center font-medium transition ${
                        filterSpecies === sp
                          ? "bg-pink-500/20 border-pink-500 text-pink-300 font-bold"
                          : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bán kính vị trí Slider (1km - 50km) */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-neutral-300">Bán kính khoảng cách:</span>
                  <span className="text-pink-400 font-bold">{filterRadius} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={filterRadius}
                  onChange={(e) => setFilterRadius(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 mt-0.5">
                  <span>1 km</span>
                  <span>25 km</span>
                  <span>50 km</span>
                </div>
              </div>

              {/* Chỉ hiện bé có tích xanh */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700">
                <span className="text-xs text-neutral-300 font-medium">
                  Chỉ hiện bé đã tiêm chủng vắc-xin
                </span>
                <input
                  type="checkbox"
                  checked={filterOnlyVaccinated}
                  onChange={(e) => setFilterOnlyVaccinated(e.target.checked)}
                  className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
                />
              </div>

              {/* 2 Nút Áp dụng / Hủy */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilterPurpose("Tất cả");
                    setFilterSpecies("Tất cả");
                    setFilterRadius(50);
                    setFilterOnlyVaccinated(false);
                  }}
                  className="py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700 transition"
                >
                  Đặt lại
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilterModal(false)}
                  className="py-2.5 rounded-xl bg-pink-500 text-white text-xs font-bold shadow-lg shadow-pink-500/25 hover:bg-pink-600 transition"
                >
                  Áp dụng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Tương Hợp (Match Celebration) */}
      <AnimatePresence>
        {matchNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="absolute inset-0 bg-neutral-950/95 z-50 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center mb-3 shadow-xl shadow-pink-500/30">
              <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
            </div>

            <h2 className="text-2xl font-black bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent mb-1">
              TƯƠNG HỢP MỚI!
            </h2>
            <p className="text-neutral-300 text-xs mb-5 max-w-xs">
              Chủ nhân của <span className="font-bold text-white">{matchNotification.name}</span> đã phản hồi tín hiệu của bạn!
            </p>

            <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-pink-500 shadow-2xl mb-6">
              <Image
                src={matchNotification.image}
                alt={matchNotification.name}
                fill
                className="object-cover"
                sizes="130px"
              />
            </div>

            <div className="w-full flex flex-col gap-2.5 max-w-xs">
              <button
                type="button"
                onClick={() => setMatchNotification(null)}
                className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-95 transition"
              >
                Gửi lời chào ngay 💬
              </button>
              <button
                type="button"
                onClick={() => setMatchNotification(null)}
                className="w-full py-2.5 rounded-full bg-neutral-800 text-neutral-300 font-semibold text-xs hover:bg-neutral-700 active:scale-95 transition"
              >
                Tiếp tục quẹt
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponent: Card vuốt với Framer Motion
interface SwipeableCardProps {
  pet: PetCardData;
  isTop: boolean;
  showDetail: boolean;
  setShowDetail: (show: boolean) => void;
  onSwipe: (direction: SwipeAction) => void;
}

function SwipeableCard({
  pet,
  isTop,
  showDetail,
  setShowDetail,
  onSwipe,
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-200, 200], [-18, 18]);

  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);
  const superLikeOpacity = useTransform(y, [-20, -90], [0, 1]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipe("right");
    } else if (
      info.offset.x < -threshold ||
      info.velocity.x < -velocityThreshold
    ) {
      onSwipe("left");
    } else if (
      info.offset.y < -threshold ||
      info.velocity.y < -velocityThreshold
    ) {
      onSwipe("up");
    }
  };

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        y: isTop ? y : 0,
        rotate: isTop ? rotate : 0,
        zIndex: isTop ? 20 : 10,
      }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={isTop ? handleDragEnd : undefined}
      initial={{
        scale: isTop ? 1 : 0.95,
        y: isTop ? 0 : 10,
        opacity: isTop ? 1 : 0.7,
      }}
      animate={{
        scale: isTop ? 1 : 0.95,
        y: isTop ? 0 : 10,
        opacity: isTop ? 1 : 0.7,
      }}
      exit={{
        x: x.get() === 0 ? 0 : x.get() > 0 ? 400 : -400,
        y: y.get() < -60 ? -400 : 0,
        opacity: 0,
        transition: { duration: 0.25 },
      }}
      className={`absolute inset-0 cursor-grab active:cursor-grabbing rounded-[26px] overflow-hidden border border-neutral-700/60 shadow-2xl bg-neutral-900 flex flex-col justify-end ${
        !isTop && "pointer-events-none select-none"
      }`}
    >
      <div className="absolute inset-0">
        <Image
          src={pet.image}
          alt={pet.name}
          fill
          priority={isTop}
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 420px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-neutral-900/10 pointer-events-none" />
      </div>

      {isTop && (
        <>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-7 left-5 border-[3px] border-emerald-400 text-emerald-400 px-3 py-1 rounded-xl font-black text-xl tracking-wider rotate-[-15deg] pointer-events-none z-30 shadow-lg bg-neutral-950/40 backdrop-blur-xs"
          >
            LIKE 💖
          </motion.div>

          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-7 right-5 border-[3px] border-rose-500 text-rose-500 px-3 py-1 rounded-xl font-black text-xl tracking-wider rotate-[15deg] pointer-events-none z-30 shadow-lg bg-neutral-950/40 backdrop-blur-xs"
          >
            NOPE ✖
          </motion.div>

          <motion.div
            style={{ opacity: superLikeOpacity }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 border-[3px] border-cyan-400 text-cyan-400 px-4 py-1.5 rounded-xl font-black text-lg tracking-wider pointer-events-none z-30 shadow-lg bg-neutral-950/40 backdrop-blur-xs text-center"
          >
            ⭐ SUPER LIKE
          </motion.div>
        </>
      )}

      {/* Thông tin thú cưng */}
      <div className="relative z-20 p-5 text-white flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-md">
              {pet.name}
            </h2>
            <span className="text-2xl font-light text-neutral-300">
              {pet.age}
            </span>

            {/* TÍCH XANH VẮC-XIN */}
            {pet.vaccinated && (
              <span
                className="inline-flex items-center gap-1 bg-sky-500/20 text-sky-400 border border-sky-400/40 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm"
                title={pet.vaccineDetails}
              >
                <CheckCircle2 className="w-3.5 h-3.5 fill-sky-400 text-neutral-950" />
                <span>Đã tiêm vắc-xin</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetail(!showDetail);
            }}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition text-white"
            title="Xem chi tiết"
          >
            {showDetail ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Loài, Giống & Mục đích ghép đôi */}
        <div className="flex items-center gap-2 flex-wrap text-sm text-neutral-300 font-medium">
          <span className="px-2.5 py-0.5 rounded-md bg-white/15 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider text-pink-200">
            {pet.species} • {pet.breed}
          </span>
          {pet.purpose && (
            <span className="px-2.5 py-0.5 rounded-md bg-pink-500/25 border border-pink-500/40 text-pink-300 text-xs font-bold">
              🎯 {pet.purpose}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
            <MapPin className="w-3 h-3 text-rose-400" />
            {pet.distance}
          </span>
        </div>

        {/* Tags tính cách */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          {pet.personality.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-900/70 border border-neutral-700/60 text-neutral-300 backdrop-blur-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {showDetail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 pt-2 border-t border-white/10 text-xs text-neutral-300 leading-relaxed overflow-hidden"
            >
              <p className="mb-2 italic text-neutral-200">"{pet.bio}"</p>
              <div className="p-2.5 rounded-xl bg-sky-950/50 border border-sky-800/50 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sky-300">
                    Hồ sơ tiêm phòng vắc-xin
                  </div>
                  <div className="text-[11px] text-sky-200/80">
                    {pet.vaccineDetails}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
