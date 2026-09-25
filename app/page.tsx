'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, X, Star, Volume2, VolumeX, MapPin, Search, 
  PlusCircle, ShieldCheck, Stethoscope, BookOpen, AlertTriangle, 
  MessageCircle, Share2, Flame, Music, Upload, CheckCircle2,
  Sparkles, Lock, Mail, User, LogOut, KeyRound, ShieldAlert
} from 'lucide-react'

// --- DỮ LIỆU MẪU BAN ĐẦU (NẾU CHƯA CÓ TRONG BỘ NHỚ) ---
const DEFAULT_PETS = [
  {
    id: '1',
    name: 'Lu',
    age: 2,
    species: 'Chó',
    breed: 'Shiba Inu',
    distance: '1.2 km',
    vaccinated: true,
    tags: ['Cá tính', 'Ngoan ngoãn'],
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=75'
  },
  {
    id: '2',
    name: 'Mochi',
    age: 1,
    species: 'Mèo',
    breed: 'Mèo Anh Lông Ngắn',
    distance: '2.5 km',
    vaccinated: true,
    tags: ['Quấn người', 'Thích ngủ'],
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=75'
  }
]

const SPECIES_CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: '🐾' },
  { id: 'dog', name: 'Chó', icon: '🐶' },
  { id: 'cat', name: 'Mèo', icon: '🐱' },
  { id: 'small', name: 'Thỏ & Hamster', icon: '🐹' },
  { id: 'bird', name: 'Chim & Bò sát', icon: '🦜' },
]

const DEFAULT_GUIDES = [
  { id: 'g1', species: 'dog', author: 'Bác sĩ Thú y Tuấn', title: 'Lịch tiêm phòng chuẩn cho chó con dưới 1 tuổi', likes: 89, category: 'Y tế' },
  { id: 'g2', species: 'cat', author: 'Sen Cần Mẫn', title: 'Mẹo chữa tiêu chảy nhẹ cho mèo bằng men vi sinh', likes: 142, category: 'Kinh nghiệm' },
]

const MUSIC_TRACKS = [
  'Âm thanh gốc',
  'Nhạc vui nhộn - Cute Whistle 🎵',
  'Lo-Fi Chill Pet Vibes 🎧',
  'Tiếng Mèo Kêu Remix 🐱'
]

export default function PetTinderApp() {
  // --- TRẠNG THÁI XÁC THỰC & ĐĂNG NHẬP ---
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'verify'>('login')

  // Form Đăng nhập / Đăng ký
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [authError, setAuthError] = useState('')
  const [pendingUser, setPendingUser] = useState<any>(null)

  // --- TRẠNG THÁI ỨNG DỤNG ---
  const [activeTab, setActiveTab] = useState<'match' | 'reels' | 'health' | 'lost'>('match')
  const [pets, setPets] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Modals
  const [showAddPetModal, setShowAddPetModal] = useState(false)
  const [newPetName, setNewPetName] = useState('')
  const [newPetSpecies, setNewPetSpecies] = useState('Chó')
  const [newPetBreed, setNewPetBreed] = useState('')
  const [newPetAge, setNewPetAge] = useState('1')
  const [newPetImg, setNewPetImg] = useState('')

  const [selectedSpecies, setSelectedSpecies] = useState('all')
  const [guides, setGuides] = useState<any[]>([])
  const [showAddGuideModal, setShowAddGuideModal] = useState(false)
  const [newGuideTitle, setNewGuideTitle] = useState('')

  const [isMuted, setIsMuted] = useState(true)
  const [showUploadReelModal, setShowUploadReelModal] = useState(false)
  const [selectedMusic, setSelectedMusic] = useState(MUSIC_TRACKS[0])

  // --- TẢI VÀ LƯU DỮ LIỆU TỰ ĐỘNG (LOCALSTORAGE) ---
  useEffect(() => {
    // 1. Tải phiên đăng nhập cũ
    const savedUser = localStorage.getItem('pettinder_session_user')
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('pettinder_session_user')
      }
    }

    // 2. Tải danh sách thú cưng
    const savedPets = localStorage.getItem('pettinder_pets')
    if (savedPets) {
      try { setPets(JSON.parse(savedPets)) } catch (e) { setPets(DEFAULT_PETS) }
    } else {
      setPets(DEFAULT_PETS)
      localStorage.setItem('pettinder_pets', JSON.stringify(DEFAULT_PETS))
    }

    // 3. Tải danh sách cẩm nang
    const savedGuides = localStorage.getItem('pettinder_guides')
    if (savedGuides) {
      try { setGuides(JSON.parse(savedGuides)) } catch (e) { setGuides(DEFAULT_GUIDES) }
    } else {
      setGuides(DEFAULT_GUIDES)
      localStorage.setItem('pettinder_guides', JSON.stringify(DEFAULT_GUIDES))
    }

    setIsAuthLoading(false)
  }, [])

  // --- XỬ LÝ ĐĂNG KÝ & BẢO MẬT XÁC THỰC ---
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')

    if (!authEmail || !authPassword || !authName) {
      setAuthError('Vui lòng điền đầy đủ thông tin!')
      return
    }

    // Kiểm tra xem email đã tồn tại trong danh sách người dùng chưa
    const existingUsers = JSON.parse(localStorage.getItem('pettinder_db_users') || '[]')
    const userExists = existingUsers.some((u: any) => u.email.toLowerCase() === authEmail.toLowerCase().trim())

    if (userExists) {
      setAuthError('Email này đã được đăng ký! Vui lòng chuyển sang Đăng nhập.')
      return
    }

    // Tạo mã xác minh ngẫu thực (OTP 6 số)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(otp)
    setPendingUser({
      name: authName,
      email: authEmail.toLowerCase().trim(),
      password: authPassword
    })

    // Chuyển sang màn hình xác minh mã bảo mật
    setAuthMode('verify')
  }

  // Xử lý xác nhận OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (otpInput.trim() !== generatedOtp) {
      setAuthError('Mã xác nhận không chính xác! Vui lòng thử lại.')
      return
    }

    // Lưu người dùng mới vào CSDL vĩnh viễn
    const existingUsers = JSON.parse(localStorage.getItem('pettinder_db_users') || '[]')
    const newUser = { ...pendingUser, id: Date.now().toString() }
    existingUsers.push(newUser)
    localStorage.setItem('pettinder_db_users', JSON.stringify(existingUsers))

    // Lưu phiên đăng nhập tự động
    localStorage.setItem('pettinder_session_user', JSON.stringify(newUser))
    setCurrentUser(newUser)
    setAuthError('')
    alert('Chúc mừng! Tài khoản của bạn đã được xác minh & khởi tạo thành công.')
  }

  // --- XỬ LÝ ĐĂNG NHẬP CHUẨN XÁC ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')

    const existingUsers = JSON.parse(localStorage.getItem('pettinder_db_users') || '[]')
    const foundUser = existingUsers.find(
      (u: any) => u.email.toLowerCase() === authEmail.toLowerCase().trim()
    )

    // Bắt lỗi nếu email chưa được đăng ký
    if (!foundUser) {
      setAuthError('⚠️ Email này CHƯA ĐƯỢC ĐĂNG KÝ! Vui lòng chọn "Đăng ký tài khoản" bên dưới.')
      return
    }

    // Kiểm tra mật khẩu
    if (foundUser.password !== authPassword) {
      setAuthError('🔒 Mật khẩu không chính xác! Vui lòng kiểm tra lại.')
      return
    }

    // Đăng nhập thành công -> Lưu session
    localStorage.setItem('pettinder_session_user', JSON.stringify(foundUser))
    setCurrentUser(foundUser)
  }

  // Đăng xuất
  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
      localStorage.removeItem('pettinder_session_user')
      setCurrentUser(null)
      setAuthEmail('')
      setAuthPassword('')
    }
  }

  // --- XỬ LÝ THÊM THÚ CƯNG ---
  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPetName || !newPetBreed) return

    const createdPet = {
      id: Date.now().toString(),
      name: newPetName,
      age: parseInt(newPetAge) || 1,
      species: newPetSpecies,
      breed: newPetBreed,
      distance: '0.1 km',
      vaccinated: true,
      tags: ['Thú cưng mới', 'Đáng yêu'],
      image: newPetImg || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=75'
    }

    const updatedPets = [createdPet, ...pets]
    setPets(updatedPets)
    localStorage.setItem('pettinder_pets', JSON.stringify(updatedPets))
    setShowAddPetModal(false)
    setNewPetName('')
    setNewPetBreed('')
    alert('Đã thêm thú cưng thành công và lưu vĩnh viễn!')
  }

  // --- XỬ LÝ ĐĂNG CẨM NANG ---
  const handleCreateGuide = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGuideTitle) return
    const newG = {
      id: Date.now().toString(),
      species: selectedSpecies === 'all' ? 'dog' : selectedSpecies,
      author: currentUser?.name || 'Bạn (Chủ nuôi)',
      title: newGuideTitle,
      likes: 1,
      category: 'Kinh nghiệm'
    }
    const updatedGuides = [newG, ...guides]
    setGuides(updatedGuides)
    localStorage.setItem('pettinder_guides', JSON.stringify(updatedGuides))
    setShowAddGuideModal(false)
    setNewGuideTitle('')
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    )
  }

  // --- 1. MÀN HÌNH BẢO MẬT ĐĂNG NHẬP / ĐĂNG KÝ (NẾU CHƯA DỰNG PHIÊN) ---
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-950 text-white p-4 font-sans">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-pink-500/10 border border-pink-500/30 rounded-2xl flex items-center justify-center mb-2">
              <Flame className="w-8 h-8 text-pink-500 fill-pink-500" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
              PetTinder Security
            </h1>
            <p className="text-xs text-neutral-400 mt-1">Hệ thống Xác thực & Bảo mật Tài khoản</p>
          </div>

          {authError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* FORM ĐĂNG NHẬP */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Email tài khoản:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                  <input 
                    type="email" 
                    required 
                    value={authEmail} 
                    onChange={e => setAuthEmail(e.target.value)}
                    placeholder="nhapemail@gmail.com" 
                    className="w-full bg-neutral-800 border border-neutral-700 pl-9 pr-3 py-2.5 rounded-xl text-xs outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Mật khẩu:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                  <input 
                    type="password" 
                    required 
                    value={authPassword} 
                    onChange={e => setAuthPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-neutral-800 border border-neutral-700 pl-9 pr-3 py-2.5 rounded-xl text-xs outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 font-bold py-3 rounded-xl text-xs text-white transition shadow-lg shadow-pink-600/20">
                Xác thực & Đăng nhập
              </button>

              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(''); }}
                  className="text-xs text-pink-400 hover:underline"
                >
                  Chưa có tài khoản? Đăng ký mới tại đây
                </button>
              </div>
            </form>
          )}

          {/* FORM ĐĂNG KÝ TÀI KHOẢN MỚI */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Họ và tên chủ nuôi:</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                  <input 
                    type="text" 
                    required 
                    value={authName} 
                    onChange={e => setAuthName(e.target.value)}
                    placeholder="Nguyễn Văn A" 
                    className="w-full bg-neutral-800 border border-neutral-700 pl-9 pr-3 py-2.5 rounded-xl text-xs outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Email đăng ký:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                  <input 
                    type="email" 
                    required 
                    value={authEmail} 
                    onChange={e => setAuthEmail(e.target.value)}
                    placeholder="chunuoi@gmail.com" 
                    className="w-full bg-neutral-800 border border-neutral-700 pl-9 pr-3 py-2.5 rounded-xl text-xs outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Tạo mật khẩu:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                  <input 
                    type="password" 
                    required 
                    value={authPassword} 
                    onChange={e => setAuthPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự" 
                    className="w-full bg-neutral-800 border border-neutral-700 pl-9 pr-3 py-2.5 rounded-xl text-xs outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 font-bold py-3 rounded-xl text-xs text-white transition">
                Tiếp tục: Nhận mã xác minh OTP
              </button>

              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                  className="text-xs text-neutral-400 hover:underline"
                >
                  Đã có tài khoản? Quay lại Đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* MÀN HÌNH XÁC MINH OTP BẢO MẬT */}
          {authMode === 'verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="bg-pink-500/10 border border-pink-500/20 p-3 rounded-xl text-xs text-pink-300">
                Mã xác minh bảo mật của bạn là: <strong className="text-base text-white underline tracking-widest">{generatedOtp}</strong>
                <p className="text-[10px] text-neutral-400 mt-1">(Trong thực tế mã này sẽ gửi về Email {pendingUser?.email})</p>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Nhập mã OTP xác minh 6 số:</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                  <input 
                    type="text" 
                    required 
                    maxLength={6}
                    value={otpInput} 
                    onChange={e => setOtpInput(e.target.value)}
                    placeholder="123456" 
                    className="w-full bg-neutral-800 border border-neutral-700 pl-9 pr-3 py-2.5 rounded-xl text-xs tracking-widest text-center font-bold outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl text-xs text-white transition">
                Kích hoạt tài khoản & Vào ứng dụng
              </button>

              <button 
                type="button"
                onClick={() => setAuthMode('register')}
                className="w-full text-xs text-neutral-400 hover:underline text-center block pt-1"
              >
                Hủy bỏ & Nhập lại thông tin
              </button>
            </form>
          )}

        </div>
      </div>
    )
  }

  // --- 2. GIAO DIỆN CHÍNH ỨNG DỤNG SAU KHI ĐÃ ĐĂNG NHẬP BẢO MẬT ---
  const currentPet = pets[currentIndex]

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950 text-white font-sans p-0 sm:p-4">
      <div className="w-full max-w-md h-[94vh] bg-black rounded-3xl overflow-hidden flex flex-col relative border border-neutral-800 shadow-2xl">
        
        {/* HEADER TOP */}
        <header className="px-4 py-3 flex items-center justify-between border-b border-neutral-800/60 z-20 bg-black/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Flame className="w-7 h-7 text-pink-500 fill-pink-500" />
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
              PetTinder
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {activeTab === 'match' && (
              <button 
                onClick={() => setShowAddPetModal(true)}
                className="flex items-center gap-1 bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full transition shadow-lg shadow-pink-600/30"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Đăng bé
              </button>
            )}

            {/* Nút Đăng xuất an toàn */}
            <button 
              onClick={handleLogout}
              title="Đăng xuất tài khoản"
              className="p-1.5 bg-neutral-900 border border-neutral-800 hover:border-red-500/50 rounded-full text-neutral-400 hover:text-red-400 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* NỘI DUNG CHÍNH CÁC TAB */}
        <main className="flex-1 relative overflow-y-auto">
          
          {/* TAB 1: GHÉP ĐÔI MATCH */}
          {activeTab === 'match' && (
            <div className="h-full flex flex-col justify-between p-4">
              {currentPet ? (
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentPet.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full h-[72%] rounded-3xl overflow-hidden shadow-lg border border-neutral-800"
                  >
                    <img 
                      src={currentPet.image} 
                      alt={currentPet.name} 
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-3xl font-extrabold">{currentPet.name}, {currentPet.age}t</h2>
                        {currentPet.vaccinated && (
                          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-500/30">
                            <ShieldCheck className="w-3.5 h-3.5" /> Tiêm ngừa
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-300 flex items-center gap-3 mb-2">
                        <span>{currentPet.species} • {currentPet.breed}</span>
                        <span className="flex items-center gap-1 text-pink-400"><MapPin className="w-3.5 h-3.5" /> {currentPet.distance}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {currentPet.tags.map((tag: string, idx: number) => (
                          <span key={idx} className="bg-neutral-800/80 backdrop-blur-md text-xs px-2.5 py-1 rounded-lg text-neutral-200">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center h-[70%] text-center p-6">
                  <Sparkles className="w-12 h-12 text-pink-500 mb-3 animate-bounce" />
                  <p className="text-neutral-400 text-sm">Đã xem hết danh sách thú cưng quanh bạn!</p>
                  <button onClick={() => setCurrentIndex(0)} className="mt-4 text-xs bg-neutral-800 text-pink-400 px-4 py-2 rounded-xl">
                    Xem lại từ đầu
                  </button>
                </div>
              )}

              {/* NÚT TƯƠNG TÁC */}
              <div className="flex justify-center items-center gap-5 my-2">
                <button 
                  onClick={() => setCurrentIndex(prev => (prev + 1) % pets.length)} 
                  className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:scale-110 active:scale-95 text-red-500 transition shadow-lg"
                >
                  <X className="w-7 h-7" />
                </button>
                <button 
                  onClick={() => setCurrentIndex(prev => (prev + 1) % pets.length)} 
                  className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:scale-110 active:scale-95 text-emerald-400 transition shadow-lg"
                >
                  <Heart className="w-7 h-7 fill-emerald-400" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: REELS */}
          {activeTab === 'reels' && (
            <div className="h-full w-full relative bg-neutral-950 flex flex-col justify-between">
              <video 
                src="https://assets.mixkit.co/videos/preview/mixkit-playful-cat-in-the-grass-41544-large.mp4" 
                className="w-full h-full object-cover"
                autoPlay 
                loop 
                muted={isMuted}
                playsInline
              />
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="absolute top-4 right-4 bg-black/60 p-2 rounded-full backdrop-blur-md"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
              </button>

              <div className="absolute right-3 bottom-16 flex flex-col items-center gap-5 z-10">
                <button className="flex flex-col items-center text-xs gap-1">
                  <div className="bg-neutral-800/80 p-3 rounded-full backdrop-blur-md"><Heart className="w-5 h-5 text-pink-500 fill-pink-500" /></div>
                  <span>2.4k</span>
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-16 z-10 bg-black/40 p-3 rounded-2xl backdrop-blur-md">
                <h4 className="font-bold text-sm mb-1">@{currentUser?.name}</h4>
                <p className="text-xs text-neutral-200 mb-2">Đưa Mochi đi dạo công viên 🐶</p>
                <div className="flex items-center gap-1.5 text-[11px] text-pink-300">
                  <Music className="w-3.5 h-3.5 animate-spin" />
                  <span>{selectedMusic}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CẨM NANG Y TẾ */}
          {activeTab === 'health' && (
            <div className="p-4 space-y-4">
              <div>
                <span className="text-xs text-neutral-400 font-semibold mb-2 block">LỌC THEO LOÀI:</span>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {SPECIES_CATEGORIES.map(spec => (
                    <button
                      key={spec.id}
                      onClick={() => setSelectedSpecies(spec.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition ${
                        selectedSpecies === spec.id ? 'bg-pink-600 text-white' : 'bg-neutral-900 border border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <span>{spec.icon}</span>
                      <span>{spec.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center bg-gradient-to-r from-pink-900/30 to-purple-900/30 p-3.5 rounded-2xl border border-pink-500/20">
                <div>
                  <h4 className="text-xs font-bold text-pink-300">Cộng đồng Pet Lovers</h4>
                  <p className="text-[11px] text-neutral-400">Chia sẻ kinh nghiệm nuôi bé của bạn</p>
                </div>
                <button 
                  onClick={() => setShowAddGuideModal(true)}
                  className="bg-pink-600 hover:bg-pink-500 text-xs text-white px-3 py-1.5 rounded-xl font-semibold"
                >
                  Viết bài
                </button>
              </div>

              <div className="space-y-2.5">
                {guides
                  .filter(g => selectedSpecies === 'all' || g.species === selectedSpecies)
                  .map(guide => (
                    <div key={guide.id} className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-2xl space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-md font-medium">{guide.category}</span>
                        <span className="text-neutral-500">Tác giả: {guide.author}</span>
                      </div>
                      <h4 className="font-semibold text-xs leading-snug">{guide.title}</h4>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: ĐI LẠC */}
          {activeTab === 'lost' && (
            <div className="p-4 space-y-3">
              <h3 className="font-bold text-base text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5" /> Tìm Thú Cưng Đi Lạc
              </h3>
              <div className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-2xl flex gap-3">
                <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=75" className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1 text-xs space-y-1">
                  <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-md font-bold text-[10px]">CẦN TÌM BÉ</span>
                  <h4 className="font-bold text-sm">Chó Beagle tên Poodle</h4>
                  <p className="text-neutral-400 text-[11px]">Lạc tại KV Q.10 ngày 22/09</p>
                  <p className="text-amber-400 font-semibold text-[11px]">Liên hệ: 0912.345.678</p>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* MODAL 1: ĐĂNG THÚ CƯNG MỚI */}
        {showAddPetModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 p-5 flex flex-col justify-center">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                <h3 className="font-bold text-base text-pink-400">Đăng hồ sơ bé lên Match</h3>
                <button onClick={() => setShowAddPetModal(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreatePet} className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Tên thú cưng:</label>
                  <input type="text" required value={newPetName} onChange={e=>setNewPetName(e.target.value)} placeholder="Ví dụ: Củ Đậu" className="w-full bg-neutral-800 p-2.5 rounded-xl border border-neutral-700 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-400 mb-1">Loài:</label>
                    <select value={newPetSpecies} onChange={e=>setNewPetSpecies(e.target.value)} className="w-full bg-neutral-800 p-2.5 rounded-xl border border-neutral-700 outline-none">
                      <option value="Chó">Chó</option>
                      <option value="Mèo">Mèo</option>
                      <option value="Hamster">Hamster/Thỏ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Giống loài:</label>
                    <input type="text" required value={newPetBreed} onChange={e=>setNewPetBreed(e.target.value)} placeholder="VD: Poodle, Corgi" className="w-full bg-neutral-800 p-2.5 rounded-xl border border-neutral-700 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Link ảnh đại diện (URL):</label>
                  <input type="url" value={newPetImg} onChange={e=>setNewPetImg(e.target.value)} placeholder="Dán link ảnh" className="w-full bg-neutral-800 p-2.5 rounded-xl border border-neutral-700 outline-none" />
                </div>
                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 font-bold py-3 rounded-xl text-white mt-2">
                  Lưu & Đăng bài
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: VIẾT BÀI CHIA SẺ */}
        {showAddGuideModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 p-5 flex flex-col justify-center">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                <h3 className="font-bold text-base text-pink-400">Chia sẻ kinh nghiệm</h3>
                <button onClick={() => setShowAddGuideModal(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateGuide} className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Tiêu đề chia sẻ:</label>
                  <textarea rows={3} required value={newGuideTitle} onChange={e=>setNewGuideTitle(e.target.value)} placeholder="Nội dung bài viết..." className="w-full bg-neutral-800 p-2.5 rounded-xl border border-neutral-700 outline-none" />
                </div>
                <button type="submit" className="w-full bg-pink-600 font-bold py-3 rounded-xl text-white">
                  Đăng bài
                </button>
              </form>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION */}
        <nav className="h-16 border-t border-neutral-800 bg-black/90 backdrop-blur-md flex justify-around items-center px-2 z-20">
          <button onClick={() => setActiveTab('match')} className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'match' ? 'text-pink-500 font-bold' : 'text-neutral-500'}`}>
            <Flame className="w-5 h-5" /> Match
          </button>
          <button onClick={() => setActiveTab('reels')} className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'reels' ? 'text-pink-500 font-bold' : 'text-neutral-500'}`}>
            <Volume2 className="w-5 h-5" /> Pet Reels
          </button>
          <button onClick={() => setActiveTab('health')} className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'health' ? 'text-pink-500 font-bold' : 'text-neutral-500'}`}>
            <Stethoscope className="w-5 h-5" /> Cẩm nang
          </button>
          <button onClick={() => setActiveTab('lost')} className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'lost' ? 'text-pink-500 font-bold' : 'text-neutral-500'}`}>
            <AlertTriangle className="w-5 h-5" /> Đi lạc
          </button>
        </nav>

      </div>
    </div>
  )
}
