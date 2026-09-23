"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  LogOut,
  ShieldCheck,
  Heart,
  Flame,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Phone,
  MapPin,
  Edit3,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface UserPetProfile {
  ownerName: string;
  phone: string;
  city: string;
  avatarUrl?: string;
  petName: string;
  species: string;
  breed: string;
  weight: number;
  height: number;
  age: string;
  gender: "Đực" | "Cái";
  vaccinated: boolean;
  vaccineDetails: string;
  purpose: "Phối giống" | "Tìm bạn đi dạo" | "Nhận nuôi";
}

export default function ProfileTab() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Trạng thái Onboarding (Hồ sơ đầy đủ)
  const [onboardingProfile, setOnboardingProfile] = useState<UserPetProfile | null>(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // Form Onboarding
  const [obOwnerName, setObOwnerName] = useState("");
  const [obPhone, setObPhone] = useState("");
  const [obCity, setObCity] = useState("TP.HCM");
  const [obPetName, setObPetName] = useState("");
  const [obSpecies, setObSpecies] = useState("Chó");
  const [obBreed, setObBreed] = useState("Corgi Chân Ngắn");
  const [obWeight, setObWeight] = useState("10.5");
  const [obHeight, setObHeight] = useState("35");
  const [obAge, setObAge] = useState("2 tuổi");
  const [obGender, setObGender] = useState<"Đực" | "Cái">("Đực");
  const [obVaccinated, setObVaccinated] = useState(true);
  const [obVaccineDetails, setObVaccineDetails] = useState("Đầy đủ sổ tiêm 7 bệnh & Dại");
  const [obPurpose, setObPurpose] = useState<"Phối giống" | "Tìm bạn đi dạo" | "Nhận nuôi">(
    "Tìm bạn đi dạo"
  );

  // Load user & hồ sơ
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const currentUser = data.session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // Kiểm tra xem đã có hồ sơ Onboarding lưu trong localStorage hoặc Supabase metadata chưa
          const saved = localStorage.getItem(`pettinder_profile_${currentUser.id}`);
          if (saved) {
            setOnboardingProfile(JSON.parse(saved));
          } else {
            // Mở modal bắt buộc Onboarding
            setShowOnboardingModal(true);
          }
        }
      } catch (e) {
        console.warn("Auth check error:", e);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          const saved = localStorage.getItem(`pettinder_profile_${u.id}`);
          if (saved) {
            setOnboardingProfile(JSON.parse(saved));
          } else {
            setShowOnboardingModal(true);
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Vui lòng điền đầy đủ email và mật khẩu");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (authMode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setUser(data.user);
        setSuccessMsg("Đăng nhập thành công!");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName || email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        if (data.session) {
          setUser(data.user);
          setSuccessMsg("Đăng ký thành công!");
        } else {
          setSuccessMsg("Đăng ký thành công! Hãy kiểm tra hòm thư xác thực.");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Thao tác không thành công";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const demoEmail = "demo.pettinder@gmail.com";
      const demoPass = "PetTinder123456";
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPass,
      });

      if (error) {
        const signUpRes = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPass,
          options: {
            data: { display_name: "Anh Tuấn (Sen của Mochi)" },
          },
        });
        if (signUpRes.error) throw signUpRes.error;
        setUser(signUpRes.data.user);
      } else {
        setUser(data.user);
      }
      setSuccessMsg("Đã đăng nhập với tài khoản Demo!");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Lỗi đăng nhập nhanh";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setOnboardingProfile(null);
      setSuccessMsg("Đã đăng xuất");
    } catch (e) {
      console.warn("Sign out error:", e);
    }
  };

  // Lưu Form Onboarding
  const handleSaveOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obOwnerName || !obPhone || !obPetName) {
      alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Tên thú cưng!");
      return;
    }

    const newProfile: UserPetProfile = {
      ownerName: obOwnerName,
      phone: obPhone,
      city: obCity,
      petName: obPetName,
      species: obSpecies,
      breed: obBreed,
      weight: parseFloat(obWeight) || 5,
      height: parseFloat(obHeight) || 30,
      age: obAge,
      gender: obGender,
      vaccinated: obVaccinated,
      vaccineDetails: obVaccineDetails,
      purpose: obPurpose,
    };

    setOnboardingProfile(newProfile);
    if (user) {
      localStorage.setItem(`pettinder_profile_${user.id}`, JSON.stringify(newProfile));
    }
    setShowOnboardingModal(false);
    setSuccessMsg("Cập nhật hồ sơ thành công! 🐾");
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-neutral-400">
        <div className="w-8 h-8 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
        <span className="text-xs">Đang kiểm tra tài khoản Supabase...</span>
      </div>
    );
  }

  // Giao diện khi ĐÃ ĐĂNG NHẬP
  if (user) {
    const profile = onboardingProfile || {
      ownerName: user.user_metadata?.display_name || user.email?.split("@")[0] || "Chủ nuôi",
      phone: "0988 776 655",
      city: "TP.HCM",
      petName: "Mochi Chân Ngắn",
      species: "Chó",
      breed: "Corgi",
      weight: 10.5,
      height: 35,
      age: "2 tuổi",
      gender: "Đực" as const,
      vaccinated: true,
      vaccineDetails: "Đầy đủ sổ tiêm 7 bệnh & Dại",
      purpose: "Tìm bạn đi dạo" as const,
    };

    return (
      <div className="w-full h-full bg-neutral-900/90 overflow-y-auto p-3.5 sm:p-5 flex flex-col justify-start font-sans">
        <div className="max-w-md mx-auto w-full space-y-4">
          {/* Card Hồ Sơ Chủ Nuôi */}
          <div className="relative bg-neutral-800/80 border border-neutral-700 rounded-3xl p-4 shadow-xl flex flex-col items-center text-center">
            <button
              type="button"
              onClick={() => setShowOnboardingModal(true)}
              className="absolute top-3.5 right-3.5 flex items-center gap-1 text-[11px] font-bold text-pink-400 hover:text-pink-300 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa</span>
            </button>

            {/* Avatar */}
            <div className="relative mb-2.5">
              <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-[3px] shadow-lg shadow-pink-500/25">
                <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-2xl font-black text-white">
                  {profile.ownerName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <span>{profile.ownerName}</span>
              <ShieldCheck className="w-4 h-4 text-sky-400 fill-sky-400/20" />
            </h2>
            <p className="text-xs text-neutral-400">{user.email}</p>

            <div className="flex items-center gap-3 text-xs text-neutral-300 mt-2">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-pink-400" /> {profile.phone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-400" /> {profile.city}
              </span>
            </div>
          </div>

          {/* Card Hồ Sơ Bé Cưng (Pet Profile) */}
          <div className="bg-neutral-800/80 border border-neutral-700 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-700/60 pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>🐾 Hồ sơ thú cưng của bạn</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
                🎯 {profile.purpose}
              </span>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-700 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80"
                  alt={profile.petName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-white truncate">
                    {profile.petName}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-700 text-neutral-300">
                    {profile.gender}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-300">
                  {profile.species} • {profile.breed} • {profile.age}
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  Nặng: <strong className="text-white">{profile.weight} kg</strong> • Cao:{" "}
                  <strong className="text-white">{profile.height} cm</strong>
                </div>
              </div>
            </div>

            {/* Tích xanh tiêm chủng */}
            <div className="p-2.5 rounded-2xl bg-sky-950/40 border border-sky-800/40 flex items-start gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sky-300">
                  {profile.vaccinated ? "Đã tiêm chủng vắc-xin" : "Chưa hoàn tất tiêm phòng"}
                </span>
                <p className="text-[11px] text-sky-200/80 leading-relaxed">
                  {profile.vaccineDetails}
                </p>
              </div>
            </div>
          </div>

          {/* Thống kê Hoạt động */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-neutral-800/60 border border-neutral-700/60 rounded-2xl p-2.5">
              <div className="w-7 h-7 rounded-full bg-pink-500/15 text-pink-400 flex items-center justify-center mx-auto mb-1">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <div className="text-sm font-black text-white">12</div>
              <div className="text-[10px] text-neutral-400">Tương hợp</div>
            </div>

            <div className="bg-neutral-800/60 border border-neutral-700/60 rounded-2xl p-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto mb-1">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <div className="text-sm font-black text-white">48</div>
              <div className="text-[10px] text-neutral-400">Đã Like</div>
            </div>

            <div className="bg-neutral-800/60 border border-neutral-700/60 rounded-2xl p-2.5">
              <div className="w-7 h-7 rounded-full bg-cyan-500/15 text-cyan-400 flex items-center justify-center mx-auto mb-1">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-sm font-black text-white">6</div>
              <div className="text-[10px] text-neutral-400">Pet Reels</div>
            </div>
          </div>

          {/* Nút Đăng Xuất */}
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-rose-400 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất tài khoản
          </button>
        </div>

        {/* ======================================================== */}
        {/* MODAL ONBOARDING BẮT BUỘC / CHỈNH SỬA HỒ SƠ            */}
        {/* ======================================================== */}
        <AnimatePresence>
          {showOnboardingModal && (
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
                className="w-full max-w-sm max-h-[90vh] bg-neutral-900 border border-neutral-700 rounded-3xl p-5 flex flex-col overflow-y-auto shadow-2xl font-sans"
              >
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-3">
                  <div>
                    <h3 className="font-extrabold text-xs text-white">
                      Hoàn thiện hồ sơ Chủ nuôi & Thú cưng
                    </h3>
                    <p className="text-[10px] text-neutral-400">
                      Bắt buộc để ghép đôi và mở khóa toàn bộ tính năng
                    </p>
                  </div>
                  {onboardingProfile && (
                    <button
                      type="button"
                      onClick={() => setShowOnboardingModal(false)}
                      className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveOnboarding} className="space-y-3.5 text-xs">
                  {/* PHẦN 1: CHỦ NUÔI */}
                  <div className="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-700 space-y-2.5">
                    <span className="font-bold text-pink-400 uppercase text-[10px] tracking-wider block">
                      1. Thông tin Chủ nuôi
                    </span>

                    <div>
                      <label className="block text-[11px] text-neutral-300 mb-1">
                        Họ và tên <span className="text-pink-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={obOwnerName}
                        onChange={(e) => setObOwnerName(e.target.value)}
                        placeholder="VD: Nguyễn Văn A..."
                        className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-neutral-300 mb-1">
                          Số điện thoại <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={obPhone}
                          onChange={(e) => setObPhone(e.target.value)}
                          placeholder="09xx xxx xxx"
                          className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-300 mb-1">
                          Thành phố
                        </label>
                        <select
                          value={obCity}
                          onChange={(e) => setObCity(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                        >
                          <option value="TP.HCM">TP.HCM</option>
                          <option value="Hà Nội">Hà Nội</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                          <option value="Hải Phòng">Hải Phòng</option>
                          <option value="Cần Thơ">Cần Thơ</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* PHẦN 2: THÚ CƯNG */}
                  <div className="p-3 rounded-2xl bg-neutral-800/60 border border-neutral-700 space-y-2.5">
                    <span className="font-bold text-pink-400 uppercase text-[10px] tracking-wider block">
                      2. Thông tin Thú cưng
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-neutral-300 mb-1">
                          Tên bé cưng <span className="text-pink-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={obPetName}
                          onChange={(e) => setObPetName(e.target.value)}
                          placeholder="VD: Mochi, Bơ..."
                          className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-300 mb-1">
                          Loài
                        </label>
                        <select
                          value={obSpecies}
                          onChange={(e) => setObSpecies(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                        >
                          <option value="Chó">Chó</option>
                          <option value="Mèo">Mèo</option>
                          <option value="Chim">Chim</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-neutral-300 mb-1">
                          Giống
                        </label>
                        <input
                          type="text"
                          value={obBreed}
                          onChange={(e) => setObBreed(e.target.value)}
                          placeholder="VD: Corgi, Golden..."
                          className="w-full px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-300 mb-1">
                          Giới tính
                        </label>
                        <div className="flex gap-1.5 pt-0.5">
                          {(["Đực", "Cái"] as const).map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setObGender(g)}
                              className={`flex-1 py-1 rounded-lg border font-bold transition ${
                                obGender === g
                                  ? "bg-pink-500 text-white border-pink-500"
                                  : "bg-neutral-900 border-neutral-700 text-neutral-400"
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-neutral-300 mb-1">
                          Cân nặng (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={obWeight}
                          onChange={(e) => setObWeight(e.target.value)}
                          className="w-full px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-300 mb-1">
                          Chiều cao (cm)
                        </label>
                        <input
                          type="number"
                          value={obHeight}
                          onChange={(e) => setObHeight(e.target.value)}
                          className="w-full px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-300 mb-1">
                          Độ tuổi
                        </label>
                        <input
                          type="text"
                          value={obAge}
                          onChange={(e) => setObAge(e.target.value)}
                          placeholder="VD: 2 tuổi"
                          className="w-full px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                        />
                      </div>
                    </div>

                    {/* Mục đích */}
                    <div>
                      <label className="block text-[11px] text-neutral-300 mb-1">
                        Mục đích tham gia
                      </label>
                      <div className="grid grid-cols-3 gap-1 text-[10.5px]">
                        {(["Phối giống", "Tìm bạn đi dạo", "Nhận nuôi"] as const).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setObPurpose(p)}
                            className={`py-1.5 px-1 rounded-xl border text-center font-semibold transition truncate ${
                              obPurpose === p
                                ? "bg-pink-500/20 border-pink-500 text-pink-300 font-bold"
                                : "bg-neutral-900 border-neutral-700 text-neutral-400"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tích xanh vắc-xin */}
                    <div className="pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={obVaccinated}
                          onChange={(e) => setObVaccinated(e.target.checked)}
                          className="w-4 h-4 accent-pink-500 rounded"
                        />
                        <span className="text-[11px] font-semibold text-sky-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Có tích xanh sổ tiêm chủng vắc-xin
                        </span>
                      </label>
                      {obVaccinated && (
                        <input
                          type="text"
                          value={obVaccineDetails}
                          onChange={(e) => setObVaccineDetails(e.target.value)}
                          placeholder="Chi tiết mũi tiêm (VD: Đủ 7 bệnh, dại)..."
                          className="w-full mt-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-[11px]"
                        />
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white font-extrabold text-xs shadow-lg shadow-pink-500/25 hover:brightness-110 active:scale-95 transition"
                  >
                    Lưu hồ sơ & Bắt đầu ghép đôi 🐾
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Giao diện khi CHƯA ĐĂNG NHẬP
  return (
    <div className="w-full h-full bg-neutral-900/90 overflow-y-auto p-4 sm:p-5 flex flex-col justify-start font-sans">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-6 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-pink-500/25">
            <User className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h2 className="text-xl font-black text-white">Tài khoản PetTinder</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Đăng nhập để cập nhật hồ sơ & tìm kiếm bạn thú cưng
          </p>
        </div>

        <div className="flex p-1 bg-neutral-800 rounded-xl mb-4 border border-neutral-700">
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              authMode === "login"
                ? "bg-pink-500 text-white shadow"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("register");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              authMode === "register"
                ? "bg-pink-500 text-white shadow"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Đăng ký
          </button>
        </div>

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

        <form onSubmit={handleAuth} className="space-y-3.5">
          {authMode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Tên chủ nuôi
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="VD: Anh Tuấn..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-pink-500"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tenban@email.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-pink-500"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-pink-500"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:brightness-110 active:scale-95 disabled:opacity-50 transition flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </>
            ) : authMode === "login" ? (
              "Đăng nhập ngay"
            ) : (
              "Tạo tài khoản mới"
            )}
          </motion.button>
        </form>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800" />
          </div>
          <span className="relative bg-neutral-900 px-3 text-[11px] text-neutral-500 font-medium">
            HOẶC
          </span>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-semibold transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          Đăng nhập nhanh với tài khoản Demo
        </button>
      </div>
    </div>
  );
}
