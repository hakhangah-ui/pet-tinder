"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  BookOpen,
  Activity,
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation,
  Search,
  Upload,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// DỮ LIỆU BỆNH VIỆN THÚ Y
// ==========================================
export interface VetClinic {
  id: string;
  name: string;
  address: string;
  city: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  openHours: string;
  is24h: boolean;
  phone: string;
  specialties: string[];
}

const SAMPLE_CLINICS: VetClinic[] = [
  {
    id: "vet-1",
    name: "Bệnh Viện Thú Y PetCare Quốc Tế",
    address: "124 Nguyễn Thị Thập, P. Tân Hưng, Quận 7, TP.HCM",
    city: "TP.HCM",
    distanceKm: 1.2,
    rating: 4.9,
    reviewsCount: 382,
    openHours: "Cấp cứu 24/7",
    is24h: true,
    phone: "028 3776 0777",
    specialties: ["Phẫu thuật", "Cấp cứu 24/7", "Chụp X-quang", "Khách sạn thú cưng"],
  },
  {
    id: "vet-2",
    name: "Phòng Khám Thú Y Samyang Animal Clinic",
    address: "54 Xuân Thủy, P. Thảo Điền, TP. Thủ Đức, TP.HCM",
    city: "TP.HCM",
    distanceKm: 2.8,
    rating: 4.8,
    reviewsCount: 215,
    openHours: "08:00 - 21:00",
    is24h: false,
    phone: "090 987 6543",
    specialties: ["Nội khoa", "Tiêm phòng vắc-xin", "Nha khoa thú cưng"],
  },
  {
    id: "vet-3",
    name: "Bệnh Viện Thú Y 2Vet Hà Nội",
    address: "236 Kim Mã, Ba Đình, Hà Nội",
    city: "Hà Nội",
    distanceKm: 2.1,
    rating: 4.9,
    reviewsCount: 520,
    openHours: "Cấp cứu 24/7",
    is24h: true,
    phone: "024 3726 3666",
    specialties: ["Phẫu thuật xương", "Siêu âm màu", "Xét nghiệm máu", "Nội soi"],
  },
  {
    id: "vet-4",
    name: "Phòng Khám Thú Y Danang Pet Hospital",
    address: "186 Nguyễn Tri Phương, Hải Châu, Đà Nẵng",
    city: "Đà Nẵng",
    distanceKm: 3.5,
    rating: 4.7,
    reviewsCount: 168,
    openHours: "07:30 - 21:30",
    is24h: false,
    phone: "090 512 3456",
    specialties: ["Spa cắt tỉa lông", "Điều trị da liễu", "Triệt sản an toàn"],
  },
  {
    id: "vet-5",
    name: "Bệnh Viện Thú Y Cộng Đồng Asvelis",
    address: "D1 Khu Ngoại Giao Đoàn, Tây Hồ, Hà Nội",
    city: "Hà Nội",
    distanceKm: 4.3,
    rating: 4.8,
    reviewsCount: 290,
    openHours: "Cấp cứu 24/7",
    is24h: true,
    phone: "024 3758 5960",
    specialties: ["Bác sĩ quốc tế", "Cấp cứu ngộ độc", "Chứng nhận xuất cảnh"],
  },
];

// ==========================================
// DỮ LIỆU SỔ TAY CẨM NANG
// ==========================================
export interface HandbookArticle {
  id: string;
  species: "dog" | "cat" | "bird" | "reptile" | "fish";
  category: "nutrition" | "vaccine" | "training" | "disease";
  title: string;
  summary: string;
  readTime: string;
  content: string[];
}

const HANDBOOK_ARTICLES: HandbookArticle[] = [
  {
    id: "art-1",
    species: "dog",
    category: "nutrition",
    title: "Chế độ dinh dưỡng chuẩn cho chó con từ 2 - 12 tháng tuổi",
    summary:
      "Cách tính lượng calo, phân bổ protein, canxi và những thực phẩm tuyệt đối không cho cún ăn (Socola, nho, hành tỏi).",
    readTime: "4 phút đọc",
    content: [
      "1. Giai đoạn 2-4 tháng: Chia 4-5 bữa nhỏ/ngày với thức ăn ngâm mềm hoặc sữa chuyên dụng cho cún.",
      "2. Nhu cầu Protein: Chiếm tối thiểu 28-30% khẩu phần từ ức gà, thịt bò nạc, trứng gà chín.",
      "3. Bổ sung Canxi & Dầu cá: Giúp khung xương và sụn phát triển chắc khỏe, lông bóng mượt.",
      "4. CẢNH BÁO NGUY HIỂM: Tuyệt đối tránh xương gà sắc nhọn, chocolate, hành tây, nho tươi và nho khô.",
    ],
  },
  {
    id: "art-2",
    species: "dog",
    category: "vaccine",
    title: "Lịch tiêm phòng chuẩn 7 bệnh & Vắc-xin dại cho chó",
    summary:
      "Mốc thời gian tiêm mũi 1, mũi 2, mũi 3 và mũi dại để bảo vệ bé khỏi Parvo, Care nguy hiểm.",
    readTime: "3 phút đọc",
    content: [
      "• Mũi 1 (6-8 tuần tuổi): Vắc-xin 5 bệnh (Care, Parvo, Viêm gan, Ho cũi chó, Cúm).",
      "• Mũi 2 (9-11 tuần tuổi): Vắc-xin 7 bệnh nhắc lại lần 1.",
      "• Mũi 3 (12-14 tuần tuổi): Vắc-xin 7 bệnh nhắc lại lần 2.",
      "• Mũi Dại (Rabies): Tiêm khi bé tròn 3 tháng tuổi.",
      "• Tiêm nhắc lại hàng năm: 1 mũi 7 bệnh + 1 mũi dại định kỳ.",
    ],
  },
  {
    id: "art-3",
    species: "cat",
    category: "disease",
    title: "Dấu hiệu nhận biết bệnh Giảm Bạch Cầu (FPV) ở mèo",
    summary:
      "Các triệu chứng cấp tính cần đưa mèo đi cấp cứu ngay lập tức: Nôn dịch vàng, bỏ ăn, sốt cao.",
    readTime: "5 phút đọc",
    content: [
      "1. Triệu chứng lâm sàng: Mèo ủ rũ nằm gục bên bát nước nhưng không uống, nôn dịch vàng bọt trắng liên tục.",
      "2. Tiêu chảy phân có mùi tanh nồng đặc trưng, thân nhiệt giảm dưới 37.5 độ C.",
      "3. Xử lý cấp cứu: Không tự ý cho uống sữa hoặc nước đường, giữ ấm và đưa ngay đến bệnh viện thú y 24/7 để truyền dịch kháng thể.",
    ],
  },
  {
    id: "art-4",
    species: "cat",
    category: "nutrition",
    title: "Cách phòng ngừa sỏi thận và bệnh tiết niệu ở mèo (FLUTD)",
    summary:
      "Tăng cường uống nước sạch, sử dụng đài phun nước và chế độ ăn hạt kết hợp pate ướt khoa học.",
    readTime: "3 phút đọc",
    content: [
      "• Mèo có bản năng lười uống nước đọng, hãy đầu tư đài phun nước tự động tuần hoàn lọc ion.",
      "• Bổ sung tối thiểu 1 bữa thức ăn ướt (Pate) giàu độ ẩm mỗi ngày.",
      "• Hạn chế cho ăn thức ăn hạt có độ mặn cao hoặc quá nhiều tinh bột.",
    ],
  },
  {
    id: "art-5",
    species: "dog",
    category: "training",
    title: "Huấn luyện chó đi vệ sinh đúng chỗ trong 7 ngày",
    summary:
      "Phương pháp bắt tín hiệu đi vệ sinh sau khi ngủ dậy và quy tắc khen thưởng tức thì.",
    readTime: "4 phút đọc",
    content: [
      "1. Xác định thời điểm vàng: 10-15 phút ngay sau khi thức dậy hoặc sau khi ăn xong.",
      "2. Dẫn bé ra khay vệ sinh hoặc bãi cỏ cố định, dùng khẩu lệnh 'Đi đi bé'.",
      "3. Thưởng ngay một viên snack yêu thích khi bé đi đúng chỗ trong vòng 3 giây.",
      "4. Tuyệt đối không dí mũi đánh mắng nếu bé lỡ đi bậy, chỉ cần lau sạch khử mùi amoniac.",
    ],
  },
  {
    id: "art-6",
    species: "bird",
    category: "nutrition",
    title: "Chế độ hạt và rau xanh cho Vẹt Yến Phụng & Lovebird",
    summary:
      "Cung cấp đa dạng hạt kê, bắp non, cải bó xôi và mai mực bổ sung khoáng chất canxi.",
    readTime: "3 phút đọc",
    content: [
      "• Hỗn hợp hạt kê vàng, hạt hướng dương nhỏ và yến mạch sạch.",
      "• Bổ sung rau xanh mỗi tuần 3 lần: Xà lách xoong, cải bó xôi, cà rốt thái nhỏ.",
      "• Luôn treo mai mực trong lồng để vẹt mài mỏ và nạp canxi tự nhiên.",
    ],
  },
  {
    id: "art-7",
    species: "fish",
    category: "disease",
    title: "Xử lý bệnh nấm trắng và túm đuôi ở Cá Cảnh Thủy Sinh",
    summary:
      "Cách sưởi nhiệt độ nước 30-31 độ C kết hợp muối hột khoáng điều trị an toàn cho cá Guppy, Betta.",
    readTime: "3 phút đọc",
    content: [
      "• Nâng nhiệt độ nước bể lên 30°C bằng cây sưởi để ức chế tế bào nấm.",
      "• Thêm muối hạt chuyên dụng với tỉ lệ 2-3g/lít nước.",
      "• Thay 30% nước mỗi ngày bằng nước đã phơi khử Clo.",
    ],
  },
];

export default function HealthAndHandbookTab() {
  const [activeSection, setActiveSection] = useState<"clinic" | "check" | "handbook">("clinic");

  // State Bệnh viện thú y
  const [cityFilter, setCityFilter] = useState("Tất cả");
  const [searchClinic, setSearchClinic] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // State Đánh giá sức khỏe Online
  const [checkSpecies, setCheckSpecies] = useState("Chó");
  const [checkAge, setCheckAge] = useState("2");
  const [checkWeight, setCheckWeight] = useState("8.5");
  const [checkHeight, setCheckHeight] = useState("32");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [healthPhotoPreview, setHealthPhotoPreview] = useState<string | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<{
    bmiScore: number;
    bodyCondition: string;
    alertLevel: "safe" | "warning" | "danger";
    title: string;
    advice: string;
    recommendedActions: string[];
  } | null>(null);

  // State Cẩm nang
  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeArticle, setActiveArticle] = useState<HandbookArticle | null>(null);

  // Định vị GPS người dùng
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt của bạn không hỗ trợ định vị GPS!");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
        alert("Không thể lấy vị trí. Vui lòng cho phép quyền truy cập vị trí trong trình duyệt.");
      }
    );
  };

  // Tính toán đánh giá sức khỏe Online
  const handleAnalyzeHealth = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = parseFloat(checkWeight) || 5;
    const height = parseFloat(checkHeight) || 30;

    // Tính chỉ số thể trạng tương đối (kg / (m^2))
    const heightInMeters = height / 100;
    const bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));

    let bodyCondition = "Lý tưởng (Chuẩn)";
    if (bmi < 45) bodyCondition = "Gầy thiếu cân";
    else if (bmi > 90) bodyCondition = "Thừa cân / Béo phì";

    // Phân tích mức độ cảnh báo dựa trên triệu chứng
    const dangerKeywords = ["Nôn mửa", "Tiêu chảy", "Co giật", "Sốt cao", "Khó thở"];
    const warningKeywords = ["Biếng ăn", "Rụng lông", "Ngứa ngáy gãi nhiều", "Mắt đỏ chảy ghèn"];

    const hasDanger = selectedSymptoms.some((s) => dangerKeywords.includes(s));
    const hasWarning = selectedSymptoms.some((s) => warningKeywords.includes(s));

    if (hasDanger) {
      setAssessmentResult({
        bmiScore: bmi,
        bodyCondition,
        alertLevel: "danger",
        title: "CẢNH BÁO: Cần đưa bé đến Bác sĩ Thú Y khẩn cấp!",
        advice:
          "Các triệu chứng cấp tính ghi nhận có thể là dấu hiệu của bệnh nhiễm trùng (Parvo/Care/Giảm bạch cầu) hoặc ngộ độc thực phẩm.",
        recommendedActions: [
          "Đưa bé đến phòng khám thú y gần nhất có cấp cứu 24/7",
          "Giữ ấm cho bé, không tự ý cho uống thuốc hạ sốt của người (Paracetamol gây độc)",
          "Mang theo mẫu phân hoặc chất nôn (nếu có) để bác sĩ xét nghiệm nhanh",
        ],
      });
    } else if (hasWarning) {
      setAssessmentResult({
        bmiScore: bmi,
        bodyCondition,
        alertLevel: "warning",
        title: "CHÚ Ý: Cần theo dõi sát tình trạng sức khỏe",
        advice:
          "Bé có biểu hiện kích ứng nhẹ hoặc rối loạn tiêu hóa / da liễu. Cần kiểm tra lại thức ăn và môi trường sống.",
        recommendedActions: [
          "Chuyển sang thức ăn nhạt, dễ tiêu (ức gà luộc xé nhỏ hoặc cháo loãng)",
          "Vệ sinh sạch tai, mắt bằng nước muối sinh lý 0.9%",
          "Nếu triệu chứng kéo dài quá 48h, đặt lịch khám kiểm tra tổng quát",
        ],
      });
    } else {
      setAssessmentResult({
        bmiScore: bmi,
        bodyCondition,
        alertLevel: "safe",
        title: "TUYỆT VỜI: Thể trạng bé đang rất tốt! 🐾",
        advice:
          "Chỉ số cơ thể và năng lượng của bé ở mức lý tưởng. Hãy tiếp tục duy trì chế độ dinh dưỡng và vận động đều đặn!",
        recommendedActions: [
          "Duy trì chế độ ăn đúng định lượng theo cân nặng",
          "Cho bé đi dạo vận động 30-45 phút mỗi ngày",
          "Nhắc lịch tiêm phòng và nhỏ gáy trị ve rận định kỳ hàng tháng",
        ],
      });
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  // Lọc phòng khám
  const filteredClinics = SAMPLE_CLINICS.filter((clinic) => {
    const matchCity = cityFilter === "Tất cả" || clinic.city === cityFilter;
    const matchSearch =
      clinic.name.toLowerCase().includes(searchClinic.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchClinic.toLowerCase());
    return matchCity && matchSearch;
  });

  // Lọc bài viết cẩm nang
  const filteredArticles = HANDBOOK_ARTICLES.filter((art) => {
    const matchSp = selectedSpecies === "all" || art.species === selectedSpecies;
    const matchCat = selectedCategory === "all" || art.category === selectedCategory;
    return matchSp && matchCat;
  });

  return (
    <div className="w-full h-full bg-neutral-900 overflow-y-auto flex flex-col select-none font-sans">
      {/* 3 Thanh chuyển đổi mục lớn: [Phòng khám] - [Khám Online] - [Sổ tay cẩm nang] */}
      <div className="p-3 bg-neutral-950/80 border-b border-neutral-800 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex p-1 bg-neutral-900 rounded-2xl border border-neutral-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveSection("clinic")}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeSection === "clinic"
                ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">Thú Y Gần Bạn</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("check")}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeSection === "check"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="truncate">Khám Online</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("handbook")}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeSection === "handbook"
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="truncate">Sổ Tay Cẩm Nang</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-3.5 sm:p-4 space-y-4">
        {/* ======================================================== */}
        {/* MỤC 1: BỆNH VIỆN THÚ Y GẦN NHẤT (VET CLINIC FINDER)     */}
        {/* ======================================================== */}
        {activeSection === "clinic" && (
          <div className="space-y-3.5">
            {/* Header & Định vị */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-pink-400" />
                  <span>Phòng Khám & Bệnh Viện Thú Y</span>
                </h2>
                <p className="text-[11px] text-neutral-400">
                  {userCoords
                    ? `Đã định vị GPS (${userCoords.lat.toFixed(2)}, ${userCoords.lng.toFixed(2)})`
                    : "Định vị phòng khám cấp cứu gần nhất"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gpsLoading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 hover:border-pink-500 text-neutral-200 text-xs font-semibold shadow transition"
              >
                <Navigation className={`w-3.5 h-3.5 text-pink-400 ${gpsLoading && "animate-spin"}`} />
                <span>{gpsLoading ? "Đang dò GPS..." : "Dò GPS"}</span>
              </button>
            </div>

            {/* Bộ lọc Thành phố & Ô Tìm Kiếm */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchClinic}
                  onChange={(e) => setSearchClinic(e.target.value)}
                  placeholder="Tìm tên bệnh viện hoặc địa chỉ..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-pink-500"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-2.5 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs focus:outline-none focus:border-pink-500"
              >
                <option value="Tất cả">Tất cả TP</option>
                <option value="TP.HCM">TP.HCM</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
            </div>

            {/* Danh sách phòng khám */}
            <div className="space-y-2.5">
              {filteredClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="p-3.5 rounded-2xl bg-neutral-800/80 border border-neutral-700 hover:border-neutral-600 transition shadow-md"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-xs text-white leading-snug">
                      {clinic.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{clinic.rating}</span>
                      <span className="text-[10px] text-neutral-400 font-normal">
                        ({clinic.reviewsCount})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 text-neutral-300 text-[11px] mb-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{clinic.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] mb-3">
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span className={clinic.is24h ? "text-emerald-400 font-bold" : ""}>
                        {clinic.openHours}
                      </span>
                    </span>
                    <span className="text-neutral-400 font-semibold">
                      Cách bạn: <span className="text-pink-400 font-bold">{clinic.distanceKm} km</span>
                    </span>
                  </div>

                  {/* Tags chuyên môn */}
                  <div className="flex items-center gap-1 flex-wrap mb-3">
                    {clinic.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-700/60 text-neutral-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* 2 Nút thao tác: Gọi khẩn cấp & Mở Google Maps chỉ đường */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${clinic.phone.replace(/\s+/g, "")}`}
                      className="py-2 rounded-xl bg-neutral-700/60 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{clinic.phone}</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        clinic.name + " " + clinic.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/20 transition"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Chỉ đường</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MỤC 2: ĐÁNH GIÁ SỨC KHỎE ONLINE (PET HEALTH CHECK)      */}
        {/* ======================================================== */}
        {activeSection === "check" && (
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-start gap-2.5">
              <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <h3 className="font-bold text-emerald-300">Công cụ Đánh giá Sức Khỏe AI</h3>
                <p className="text-emerald-200/80 text-[11px] leading-relaxed">
                  Nhập chỉ số thể trạng và triệu chứng của bé để phân tích BMI thể trạng, đưa ra mức độ cảnh báo và lời khuyên chăm sóc tức thì.
                </p>
              </div>
            </div>

            <form onSubmit={handleAnalyzeHealth} className="space-y-3.5">
              {/* Chọn Loài & Độ tuổi */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Loài thú cưng
                  </label>
                  <select
                    value={checkSpecies}
                    onChange={(e) => setCheckSpecies(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs"
                  >
                    <option value="Chó">Chó (Canine)</option>
                    <option value="Mèo">Mèo (Feline)</option>
                    <option value="Chim">Chim / Vẹt</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Độ tuổi (Năm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={checkAge}
                    onChange={(e) => setCheckAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs"
                  />
                </div>
              </div>

              {/* Cân nặng & Chiều cao */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Cân nặng (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={checkWeight}
                    onChange={(e) => setCheckWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Chiều cao vai (cm)
                  </label>
                  <input
                    type="number"
                    required
                    value={checkHeight}
                    onChange={(e) => setCheckHeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs"
                  />
                </div>
              </div>

              {/* Triệu chứng bất thường */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Chọn các triệu chứng đang xuất hiện:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    "Biếng ăn / Bỏ bữa",
                    "Nôn mửa",
                    "Tiêu chảy",
                    "Rụng lông / Viêm da",
                    "Ngứa ngáy gãi nhiều",
                    "Mắt đỏ chảy ghèn",
                    "Uống nước nhiều bất thường",
                    "Bình thường khỏe mạnh",
                  ].map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom);
                    return (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => toggleSymptom(symptom)}
                        className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-medium text-left transition ${
                          isSelected
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                            : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {symptom}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tải ảnh tình trạng thú cưng */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Ảnh chụp tình trạng (vùng da, mắt, răng miệng)
                </label>
                <label className="w-full h-24 border-2 border-dashed border-neutral-700 hover:border-emerald-500 rounded-2xl bg-neutral-800/40 flex flex-col items-center justify-center gap-1 text-neutral-400 cursor-pointer">
                  {healthPhotoPreview ? (
                    <div className="relative w-full h-full p-1 flex items-center justify-center">
                      <img
                        src={healthPhotoPreview}
                        alt="Health preview"
                        className="max-h-full rounded-xl object-contain"
                      />
                    </div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-emerald-400" />
                      <span className="text-[11px]">Tải ảnh để phân tích trực quan</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setHealthPhotoPreview(URL.createObjectURL(f));
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
              >
                Phân tích tình trạng sức khỏe ngay 🩺
              </button>
            </form>

            {/* Kết quả phân tích */}
            <AnimatePresence>
              {assessmentResult && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className={`p-4 rounded-2xl border ${
                    assessmentResult.alertLevel === "danger"
                      ? "bg-rose-950/40 border-rose-600/50"
                      : assessmentResult.alertLevel === "warning"
                      ? "bg-amber-950/40 border-amber-600/50"
                      : "bg-emerald-950/40 border-emerald-600/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {assessmentResult.alertLevel === "danger" ? (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    ) : assessmentResult.alertLevel === "warning" ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    <h3 className="font-black text-xs text-white">
                      {assessmentResult.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 my-2 border-y border-white/10">
                    <div>
                      <span className="text-neutral-400 text-[11px]">Chỉ số BMI: </span>
                      <span className="font-bold text-white">{assessmentResult.bmiScore}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[11px]">Thể trạng: </span>
                      <span className="font-bold text-pink-300">
                        {assessmentResult.bodyCondition}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-200 mb-3 leading-relaxed">
                    {assessmentResult.advice}
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                      Hành động đề xuất:
                    </span>
                    {assessmentResult.recommendedActions.map((action, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-neutral-300">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ======================================================== */}
        {/* MỤC 3: SỔ TAY NUÔI DƯỠNG THÚ CƯNG (PET HANDBOOK)         */}
        {/* ======================================================== */}
        {activeSection === "handbook" && (
          <div className="space-y-3.5">
            {/* Bộ lọc loài */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {[
                { id: "all", label: "Tất cả" },
                { id: "dog", label: "🐕 Chó" },
                { id: "cat", label: "🐈 Mèo" },
                { id: "bird", label: "🦜 Chim" },
                { id: "reptile", label: "🦎 Bò sát" },
                { id: "fish", label: "🐠 Cá" },
              ].map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setSelectedSpecies(sp.id)}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition ${
                    selectedSpecies === sp.id
                      ? "bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20"
                      : "bg-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>

            {/* Bộ lọc chuyên mục */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
              {[
                { id: "all", label: "Tất cả chủ đề" },
                { id: "nutrition", label: "🍖 Dinh dưỡng" },
                { id: "vaccine", label: "💉 Lịch tiêm phòng" },
                { id: "training", label: "🎾 Huấn luyện" },
                { id: "disease", label: "🩺 Bệnh lý" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? "bg-neutral-700 text-cyan-300 font-bold border border-cyan-500/40"
                      : "bg-neutral-800/60 text-neutral-400"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Danh sách bài viết cẩm nang */}
            <div className="space-y-2.5">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setActiveArticle(art)}
                  className="p-3.5 rounded-2xl bg-neutral-800/80 border border-neutral-700 hover:border-cyan-500/50 transition cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                    <span className="text-[10px] text-neutral-400 shrink-0 font-medium">
                      {art.readTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-2">
                    {art.summary}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-cyan-400 font-semibold">
                    <span>Đọc hướng dẫn chi tiết</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>

            {/* Modal đọc bài viết chi tiết */}
            <AnimatePresence>
              {activeArticle && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="w-full max-w-sm max-h-[85vh] bg-neutral-900 border border-neutral-700 rounded-3xl p-5 flex flex-col overflow-hidden shadow-2xl"
                  >
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-neutral-800 mb-3">
                      <div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                          {activeArticle.category}
                        </span>
                        <h2 className="text-sm font-bold text-white mt-1.5 leading-snug">
                          {activeArticle.title}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveArticle(null)}
                        className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center shrink-0"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 text-xs text-neutral-300 leading-relaxed pr-1">
                      <p className="font-medium text-neutral-200 bg-neutral-800/60 p-2.5 rounded-xl border border-neutral-700/50">
                        {activeArticle.summary}
                      </p>
                      <div className="space-y-2">
                        {activeArticle.content.map((p, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-neutral-800/40">
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-800 mt-2">
                      <button
                        type="button"
                        onClick={() => setActiveArticle(null)}
                        className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs transition"
                      >
                        Đã hiểu hướng dẫn
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
