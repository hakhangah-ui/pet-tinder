"use client";

import React from "react";
import { Flame, PlaySquare, Stethoscope, AlertTriangle, User } from "lucide-react";
import { motion } from "framer-motion";

export type TabType = "match" | "reels" | "health" | "lost" | "profile";

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadCount?: number;
}

export default function BottomNav({
  activeTab,
  onTabChange,
  unreadCount = 0,
}: BottomNavProps) {
  const tabs = [
    {
      id: "match" as TabType,
      label: "Match",
      icon: Flame,
    },
    {
      id: "reels" as TabType,
      label: "Pet Reels",
      icon: PlaySquare,
    },
    {
      id: "health" as TabType,
      label: "Y tế & Sổ tay",
      icon: Stethoscope,
    },
    {
      id: "lost" as TabType,
      label: "Tìm đi lạc",
      icon: AlertTriangle,
    },
    {
      id: "profile" as TabType,
      label: "Tài khoản",
      icon: User,
    },
  ];

  return (
    <nav className="relative z-40 bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-800/80 px-2 py-2 flex items-center justify-around">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-2 transition-colors focus:outline-none ${
              isActive
                ? "text-pink-500 font-bold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${
                  isActive ? "scale-110 stroke-[2.2]" : "stroke-[1.8]"
                }`}
              />
              {tab.id === "match" && unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-pink-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[9.5px] sm:text-[10px] mt-1 tracking-tight truncate max-w-[62px]">
              {tab.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -bottom-1 w-5 h-1 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
