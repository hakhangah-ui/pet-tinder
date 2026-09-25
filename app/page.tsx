'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, X, Star, Volume2, VolumeX, MapPin, Search, 
  PlusCircle, ShieldCheck, Stethoscope, BookOpen, AlertTriangle, 
  MessageCircle, Share2, Flame, Music, Upload, CheckCircle2,
  Filter, Sparkles
} from 'lucide-react'

// --- DỮ LIỆU MẪU BAN ĐẦU ---
const INITIAL_PETS = [
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

const INITIAL_GUIDES = [
  { id: 'g1', species: 'dog', author: 'Bác sĩ Thú y Tuấn', title: 'Lịch tiêm phòng chuẩn cho chó con dưới 1 tuổi', likes: 89, category: 'Y tế' },
  { id: 'g2', species: 'cat', author: 'Sen Cần Mẫn', title: 'Mẹo chữa tiêu chảy nhẹ cho mèo bằng men vi sinh', likes: 142, category: 'Kinh nghiệm' },
  { id: 'g3', species: 'small', author: 'Hamster Club', title: 'Thức ăn chuẩn cho Hamster không bị béo phì', likes: 56, category: 'Dinh dưỡng' },
]

const MUSIC_TRACKS = [
  'Âm thanh gốc',
  'Nhạc vui nhộn - Cute Whistle 🎵',
  'Lo-Fi Chill Pet Vibes 🎧',
  'Tiếng Mèo Kêu Remix 🐱'
]

export default function PetTinderApp() {
  const [activeTab, setActiveTab] = useState<'match' | 'reels' | 'health' | 'lost'>('match')
  const [pets, setPets] = useState(INITIAL_PETS)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // States cho Form Đăng Thú cưng
  const [showAddPetModal, setShowAddPetModal] = useState(false)
  const [newPetName, setNewPetName] = useState('')
  const [newPetSpecies, setNewPetSpecies] = useState('Chó')
  const [newPetBreed, setNewPetBreed] = useState('')
  const [newPetAge, setNewPetAge] = useState('1')
  const [newPetImg, setNewPetImg] = useState('')

  // States cho Cẩm nang & Kinh nghiệm
  const [selectedSpecies, setSelectedSpecies] = useState('all')
  const [guides, setGuides] = useState(INITIAL_GUIDES)
  const [showAddGuideModal, setShowAddGuideModal] = useState(false)
  const [newGuideTitle, setNewGuideTitle] = useState('')

  // States cho Reels
  const [isMuted, setIsMuted] = useState(true)
  const [showUploadReelModal, setShowUploadReelModal] = useState(false)
  const [selectedMusic, setSelectedMusic] = useState(MUSIC_TRACKS[0])

  // Xử lý Thêm Thú cưng mới vào Match
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

    setPets([createdPet, ...pets])
    setShowAddPetModal(false)
    setNewPetName('')
    setNewPetBreed('')
    alert('Đã thêm thú cưng của bạn lên danh sách Match thành công!')
  }

  // Xử lý Đăng bài chia sẻ Kinh nghiệm
  const handleCreateGuide = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGuideTitle) return
    const newG = {
      id: Date.now().toString(),
      species: selectedSpecies === 'all' ? 'dog' : selectedSpecies,
      author: 'Bạn (Chủ nuôi)',
      title: newGuideTitle,
      likes: 1,
      category: 'Kinh nghiệm'
    }
    setGuides([newG, ...guides])
    setShowAddGuideModal(false)
    setNewGuideTitle('')
  }

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
          
          {/* Nút Thêm Thú Cưng / Bài viết nhanh tùy vào Tab */}
          {activeTab === 'match' && (
            <button 
              onClick={() => setShowAddPetModal(true)}
              className="flex items-center gap-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition shadow-lg shadow-pink-600/30"
            >
              <PlusCircle className="w-4 h-4" /> Đăng bé
            </button>
          )}

          {activeTab === 'reels' && (
            <button 
              onClick={() => setShowUploadReelModal(true)}
              className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition border border-neutral-700"
            >
              <Upload className="w-4 h-4 text-pink-400" /> Đăng Reels
            </button>
          )}
        </header>

        {/* NỘI DUNG CHÍNH CÁC TAB */}
        <main className="flex-1 relative overflow-y-auto">
          
          {/* --- TAB 1: GHÉP ĐÔI MATCH --- */}
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
                        {currentPet.tags.map((tag, idx) => (
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

              {/* BỘ NÚT TƯƠNG TÁC */}
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

          {/* --- TAB 2: PET REELS TỐI ƯU LOAD & ĐĂNG NHẠC --- */}
          {activeTab === 'reels' && (
            <div className="h-full w-full relative bg-neutral-950 flex flex-col justify-between">
              <video 
                src="https://assets.mixkit.co/videos/preview/mixkit-playful-cat-in-the-grass-41544-large.mp4" 
                className="w-full h-full object-cover"
                autoPlay 
                loop 
                muted={isMuted}
                preload="metadata"
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
                <button className="flex flex-col items-center text-xs gap-1">
                  <div className="bg-neutral-800/80 p-3 rounded-full backdrop-blur-md"><MessageCircle className="w-5 h-5 text-white" /></div>
                  <span>128</span>
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-16 z-10 bg-black/40 p-3 rounded-2xl backdrop-blur-md">
                <h4 className="font-bold text-sm mb-1">@Mochi_Corgi</h4>
                <p className="text-xs text-neutral-200 mb-2">Hôm nay đưa Mochi đi dạo công viên 🐶</p>
                <div className="flex items-center gap-1.5 text-[11px] text-pink-300">
                  <Music className="w-3.5 h-3.5 animate-spin" />
                  <span>{selectedMusic}</span>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB 3: Y TẾ & ĐA DẠNG CẨM NANG HƯỚNG DẪN --- */}
          {activeTab === 'health' && (
            <div className="p-4 space-y-4">
              
              {/* THANH LỌC THÚ CƯNG TRUYÊN SÂU */}
              <div>
                <span className="text-xs text-neutral-400 font-semibold mb-2 block">CHỌN LOÀI THÚ CƯNG:</span>
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

              {/* NÚT VIẾT BÀI CHIA SẺ KINH NGHIỆM */}
              <div className="flex justify-between items-center bg-gradient-to-r from-pink-900/30 to-purple-900/30 p-3.5 rounded-2xl border border-pink-500/20">
                <div>
                  <h4 className="text-xs font-bold text-pink-300">Cộng đồng Chia sẻ Kinh nghiệm</h4>
                  <p className="text-[11px] text-neutral-400">Bạn có mẹo chăm sóc hay? Hãy đăng bài nhé!</p>
                </div>
                <button 
                  onClick={() => setShowAddGuideModal(true)}
                  className="bg-pink-600 hover:bg-pink-500 text-xs text-white px-3 py-1.5 rounded-xl font-semibold"
                >
                  Viết bài
                </button>
              </div>

              {/* DANH SÁCH CẨM NANG */}
              <div className="space-y-2.5">
                <h3 className="font-bold text-sm text-neutral-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-pink-400" /> Hướng dẫn & Kinh nghiệm
                </h3>
                {guides
                  .filter(g => selectedSpecies === 'all' || g.species === selectedSpecies)
                  .map(guide => (
                    <div key={guide.id} className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-2xl space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-md font-medium">{guide.category}</span>
                        <span className="text-neutral-500">Tác giả: {guide.author}</span>
                      </div>
                      <h4 className="font-semibold text-xs leading-snug">{guide.title}</h4>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-400 pt-1">
                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-pink-500" /> {guide.likes} yêu thích</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* --- TAB 4: THÚ CƯNG ĐI LẠC --- */}
          {activeTab === 'lost' && (
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-5 h-5" /> Tìm Thú Cưng Đi Lạc
                </h3>
              </div>
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

        {/* MODAL 1: ĐĂNG THÚ CƯNG MỚI LÊN MATCH */}
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
                      <option value="Bò sát/Chim">Bò sát / Chim</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Giống loài:</label>
                    <input type="text" required value={newPetBreed} onChange={e=>setNewPetBreed(e.target.value)} placeholder="VD: Poodle, Corgi" className="w-full bg-neutral-800 p-2.5 rounded-xl border border-neutral-700 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Link ảnh đại diện (URL):</label>
                  <input type="url" value={newPetImg} onChange={e=>setNewPetImg(e.target.value)} placeholder="Dán link ảnh từ điện thoại/mạng" className="w-full bg-neutral-800 p-2.5 rounded-xl border border-neutral-700 outline-none" />
                </div>
                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 font-bold py-3 rounded-xl text-white mt-2">
                  Hoàn tất Đăng hồ sơ
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: ĐĂNG REELS & CHỌN NHẠC NỀN */}
        {showUploadReelModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 p-5 flex flex-col justify-center">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                <h3 className="font-bold text-base text-pink-400">Đăng Pet Reel mới</h3>
                <button onClick={() => setShowUploadReelModal(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3 text-xs">
                <div className="border-2 border-dashed border-neutral-700 p-6 rounded-2xl text-center cursor-pointer hover:border-pink-500 transition">
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-neutral-300 font-semibold">Chọn Video hoặc Ảnh từ thiết bị</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Hỗ trợ MP4, MOV, JPG, PNG</p>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Chọn nhạc nền:</label>
                  <select value={selectedMusic} onChange={e=>setSelectedMusic(e.target.value)} className="w-full bg-neutral-800 p-2.5 rounded-xl border border-neutral-700 outline-none">
                    {MUSIC_TRACKS.map((m, i) => <option key={i} value={m}>{m}</option>)}
                  </select>
                </div>
                <button onClick={() => { setShowUploadReelModal(false); alert('Đã tải thước phim lên thành công!'); }} className="w-full bg-pink-600 font-bold py-3 rounded-xl text-white">
                  Xuất bản Reels
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: VIẾT BÀI CHIA SẺ KINH NGHIỆM */}
        {showAddGuideModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 p-5 flex flex-col justify-center">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                <h3 className="font-bold text-base text-pink-400">Chia sẻ kinh nghiệm nuôi bé</h3>
                <button onClick={() => setShowAddGuideModal(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateGuide} className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Tiêu đề chia sẻ / Mẹo hay:</label>
                  <textarea rows={3} required value={newGuideTitle} onChange={e=>setNewGuideTitle(e.target.value)} placeholder="Ví dụ: Cách làm pate tươi tại nhà cho mèo siêu ngon..." className="w-full bg-neutral-800 p-2.5 rounded-xl border border-neutral-700 outline-none" />
                </div>
                <button type="submit" className="w-full bg-pink-600 font-bold py-3 rounded-xl text-white">
                  Đăng bài viết
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
