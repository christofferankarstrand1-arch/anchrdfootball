import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { 
  Users, Target, Briefcase, Calendar, MapPin, Clock, ArrowRight, Anchor, 
  TrendingUp, Heart, Zap, Network, Menu, X, Search, Star, CheckCircle,
  Award, Shield, Phone, Mail, ExternalLink, Quote, Sparkles
} from 'lucide-react'
import Logo from '@/components/ui/logo.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [emailSignup, setEmailSignup] = useState('')
  const [liveStats, setLiveStats] = useState({
    jobs: 247,
    seekers: 2847,
    clubs: 156,
    applications: 12
  })

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !showExitIntent) {
        setShowExitIntent(true)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [showExitIntent])

  // Simulate live stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        applications: prev.applications + Math.floor(Math.random() * 2)
      }))
    }, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const opportunities = [
    {
      id: 1,
      club: 'Hammarby IF',
      logo: '/club-logos/hammarby.png',
      role: 'Matchdagsvärdar',
      category: 'matchday',
      type: 'Matchdagsuppdrag',
      location: 'Tele2 Arena, Stockholm',
      city: 'Stockholm',
      time: '4 timmar',
      date: '15 oktober 2025',
      description: 'Vi söker entusiastiska värdar för att välkomna fans på matchdag.',
      applicants: 23,
      featured: true,
      daysLeft: 5
    },
    {
      id: 2,
      club: 'Malmö FF',
      logo: '/club-logos/malmo.jpg',
      role: 'Social Media Manager',
      category: 'professional',
      type: 'Professionell roll',
      location: 'Malmö',
      city: 'Malmö',
      time: 'Heltid',
      date: 'Löpande',
      description: 'Ansvarig för klubbens sociala medier och digitala närvaro.',
      applicants: 67,
      featured: false,
      daysLeft: null
    },
    {
      id: 3,
      club: 'AIK',
      logo: '/club-logos/aik.png',
      role: 'Ungdomstränare',
      category: 'volunteer',
      type: 'Volontärroll',
      location: 'Stockholm',
      city: 'Stockholm',
      time: '6 timmar/vecka',
      date: 'Säsongsstart',
      description: 'Träna och utveckla våra unga spelare i åldrarna 10-12 år.',
      applicants: 45,
      featured: false,
      daysLeft: 12
    },
    {
      id: 4,
      club: 'IFK Göteborg',
      logo: '/club-logos/ifk-goteborg.png',
      role: 'Strategisk Rådgivare',
      category: 'strategic',
      type: 'Strategiskt uppdrag',
      location: 'Göteborg',
      city: 'Göteborg',
      time: 'Konsultbasis',
      date: 'Q4 2025',
      description: 'Stötta styrelsen i strategiska beslut och affärsutveckling.',
      applicants: 12,
      featured: false,
      daysLeft: 30
    },
    {
      id: 5,
      club: 'Djurgårdens IF',
      logo: '/club-logos/djurgarden.png',
      role: 'Eventkoordinator',
      category: 'matchday',
      type: 'Matchdagsuppdrag',
      location: 'Tele2 Arena, Stockholm',
      city: 'Stockholm',
      time: '5 timmar',
      date: '22 oktober 2025',
      description: 'Koordinera och genomföra matchdagsevent och aktiviteter.',
      applicants: 34,
      featured: true,
      daysLeft: 8
    },
    {
      id: 6,
      club: 'BK Häcken',
      logo: '/club-logos/hacken.png',
      role: 'Dataanalytiker',
      category: 'professional',
      type: 'Professionell roll',
      location: 'Göteborg',
      city: 'Göteborg',
      time: 'Heltid',
      date: 'Omgående',
      description: 'Analysera matchdata och spelare för att optimera prestanda.',
      applicants: 89,
      featured: false,
      daysLeft: 3
    }
  ]

  const testimonials = [
    {
      name: 'Anna Svensson',
      role: 'Sportchef',
      club: 'Hammarby IF',
      logo: '/club-logos/hammarby.png',
      quote: 'Tack vare ANCHRD hittade vi vår nya Social Media Manager på 2 veckor. Plattformen sparade oss 20+ timmar rekryteringsarbete.',
      image: '/testimonials/anna.jpg'
    },
    {
      name: 'Erik Johansson',
      role: 'Eventkoordinator',
      club: 'Djurgårdens IF',
      logo: '/club-logos/djurgarden.png',
      quote: 'Jag fick mitt drömjobb som Eventkoordinator på Djurgården via ANCHRD. Processen var smidig och jag hade kontakt med klubben inom 24 timmar.',
      image: '/testimonials/erik.jpg'
    },
    {
      name: 'Maria Andersson',
      role: 'Ungdomstränare',
      club: 'IFK Göteborg',
      logo: '/club-logos/ifk-goteborg.png',
      quote: 'Som nyexaminerad tränare var det svårt att hitta jobb. ANCHRD gav mig tillgång till hundratals möjligheter jag aldrig hade hittat annars.',
      image: '/testimonials/maria.jpg'
    }
  ]

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesCategory = activeTab === 'all' || opp.category === activeTab
    const matchesSearch = searchQuery === '' || 
      opp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = locationFilter === 'all' || opp.city === locationFilter
    return matchesCategory && matchesSearch && matchesLocation
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowExitIntent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-[#FF6B35] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Vänta! Missa Inte Ditt Drömjobb 🎯
                </h3>
                <p className="text-gray-600 mb-6">
                  Få nya fotbollsjobb direkt i din inbox
                </p>
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="din@email.se"
                    value={emailSignup}
                    onChange={(e) => setEmailSignup(e.target.value)}
                    className="text-center"
                  />
                  <Button className="w-full bg-[#1B4332] hover:bg-[#2E8B57]">
                    Prenumerera Gratis →
                  </Button>
                  <p className="text-xs text-gray-500">
                    Gratis, avsluta när som helst. 2,500+ prenumeranter.
                  </p>
                </div>
                <button
                  onClick={() => setShowExitIntent(false)}
                  className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                >
                  Nej tack, jag vill inte ha nya jobb
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo size="default" />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#jobs" className="text-gray-700 hover:text-[#1B4332] transition-colors">
                Hitta Jobb
              </a>
              <a href="#for-clubs" className="text-gray-700 hover:text-[#1B4332] transition-colors">
                För Klubbar
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-[#1B4332] transition-colors">
                Priser
              </a>
              <a href="#about" className="text-gray-700 hover:text-[#1B4332] transition-colors">
                Om Oss
              </a>
              <Button variant="outline" className="border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-white">
                Logga in
              </Button>
              <Button className="bg-[#FF6B35] hover:bg-[#FF8555] text-white">
                Kom Igång →
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 space-y-3"
            >
              <a href="#jobs" className="block py-2 text-gray-700 hover:text-[#1B4332]">
                Hitta Jobb
              </a>
              <a href="#for-clubs" className="block py-2 text-gray-700 hover:text-[#1B4332]">
                För Klubbar
              </a>
              <a href="#pricing" className="block py-2 text-gray-700 hover:text-[#1B4332]">
                Priser
              </a>
              <a href="#about" className="block py-2 text-gray-700 hover:text-[#1B4332]">
                Om Oss
              </a>
              <Button variant="outline" className="w-full border-[#1B4332] text-[#1B4332]">
                Logga in
              </Button>
              <Button className="w-full bg-[#FF6B35] hover:bg-[#FF8555] text-white">
                Kom Igång →
              </Button>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section - World Class */}
      <section className="relative bg-gradient-to-br from-[#1B4332] via-[#2E8B57] to-[#52796F] text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Lansering 2025</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
            >
              Bygg Din Karriär Inom<br />
              <span className="text-[#FF6B35]">Svensk Fotboll</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-white/90"
              style={{ textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}
            >
              Från matchdagsvärdar till sportchefer - hitta ditt drömjobb inom fotbollen
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button 
                size="lg" 
                className="bg-[#FF6B35] hover:bg-[#FF8555] text-white text-lg px-8 py-6 shadow-2xl hover:shadow-[#FF6B35]/50 transition-all hover:scale-105"
              >
                Hitta Jobb →
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-[#1B4332] text-lg px-8 py-6 transition-all hover:scale-105"
              >
                Se Hur Det Fungerar
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-white/80"
            >
              <p className="mb-4">Används av Hammarby, AIK, Malmö FF och 150+ klubbar</p>
              <div className="flex justify-center gap-6 flex-wrap">
                {['/club-logos/hammarby.png', '/club-logos/aik.png', '/club-logos/malmo.jpg', '/club-logos/djurgarden.png'].map((logo, i) => (
                  <motion.img
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    src={logo}
                    alt="Club logo"
                    className="h-12 w-12 object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F8F9FA"/>
          </svg>
        </div>
      </section>

      {/* Live Stats Bar */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white py-6 shadow-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Just nu på ANCHRD:</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-[#1B4332]" />
              <strong>{liveStats.jobs}</strong> aktiva jobb
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <Users className="w-4 h-4 text-[#2E8B57]" />
              <strong>{liveStats.seekers.toLocaleString()}</strong> jobbsökande
            </div>
            <div className="hidden md:flex items-center gap-1">
              <Target className="w-4 h-4 text-[#FF6B35]" />
              <strong>{liveStats.clubs}</strong> klubbar
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <strong>{liveStats.applications}</strong> ansökningar idag
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { icon: Users, label: 'Klubbar', value: '+150', color: 'text-[#1B4332]' },
              { icon: Target, label: 'Aktiva sökande', value: '2,500+', color: 'text-[#2E8B57]' },
              { icon: Briefcase, label: 'Uppdrag', value: '800+', color: 'text-[#FF6B35]' },
              { icon: Heart, label: 'Nöjdhet', value: '95%', color: 'text-[#52796F]' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg mb-4 group-hover:shadow-xl transition-shadow"
                >
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </motion.div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Value Props with Icons */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Varför ANCHRD League?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Den kompletta plattformen för fotbollskarriärer i Sverige
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Anchor,
                title: 'Stabilitet',
                description: 'ANCHRD representerar en stabil grund för svenska fotbollsklubbar att bygga sina framtider på.',
                color: 'bg-[#1B4332]'
              },
              {
                icon: Zap,
                title: 'Dynamik',
                description: 'Livfull energi som speglar fotbollens passion och den konstanta rörelsen på marknaden.',
                color: 'bg-[#FF6B35]'
              },
              {
                icon: Network,
                title: 'Tillgänglighet',
                description: 'Öppen för alla nivåer - från Allsvenskan till division 7, alla klubbar är välkomna.',
                color: 'bg-[#2E8B57]'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="h-full border-2 border-transparent hover:border-gray-200 transition-all hover:shadow-xl">
                  <CardHeader>
                    <div className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - World Class */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Vad Våra Användare Säger
            </h2>
            <p className="text-xl text-gray-600">
              Riktiga berättelser från klubbar och jobbsökande
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all border-2 border-transparent hover:border-[#1B4332]/20">
                  <CardContent className="pt-6">
                    <Quote className="w-10 h-10 text-[#FF6B35] mb-4 opacity-50" />
                    <p className="text-gray-700 mb-6 leading-relaxed italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1B4332] to-[#2E8B57] flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                        <div className="text-sm text-[#1B4332] font-medium">{testimonial.club}</div>
                      </div>
                      <img
                        src={testimonial.logo}
                        alt={testimonial.club}
                        className="w-10 h-10 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex flex-wrap justify-center gap-8 items-center"
          >
            {[
              { icon: Shield, text: 'GDPR-compliant' },
              { icon: CheckCircle, text: 'Verifierade klubbar' },
              { icon: Award, text: 'Svensk support' },
              { icon: Star, text: '4.8/5 betyg' }
            ].map((badge, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md"
              >
                <badge.icon className="w-5 h-5 text-[#1B4332]" />
                <span className="text-sm font-medium text-gray-700">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Hur det fungerar
            </h2>
            <p className="text-xl text-gray-600">
              En enkel och transparent process som kopplar samman rätt personer med rätt möjligheter
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* For Clubs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1B4332] text-white flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                För klubbar
              </h3>
              <div className="space-y-6">
                {[
                  { step: '1', title: 'Skapa uppdrag', desc: 'Publicera allt från matchdagsuppdrag till strategiska roller' },
                  { step: '2', title: 'Ta emot ansökningar', desc: 'Granska profiler och välj de bästa kandidaterna' },
                  { step: '3', title: 'Anställ och samarbeta', desc: 'Kom igång direkt med din nya teammedlem' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* For Job Seekers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF6B35] text-white flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                För jobbsökande
              </h3>
              <div className="space-y-6">
                {[
                  { step: '1', title: 'Skapa profil', desc: 'Visa upp dina färdigheter och erfarenheter' },
                  { step: '2', title: 'Sök uppdrag', desc: 'Bläddra bland hundratals möjligheter från olika klubbar' },
                  { step: '3', title: 'Få jobbet', desc: 'Börja arbeta med din favoritklubb' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FF6B35] text-white flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Jobs Section with Enhanced Filters */}
      <section id="jobs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Aktuella uppdrag
            </h2>
            <p className="text-xl text-gray-600">
              Utforska möjligheter från ledande fotbollsklubbar över hela Sverige
            </p>
          </motion.div>

          {/* Enhanced Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Sök efter roll, klubb eller nyckelord..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-lg border-2 focus:border-[#1B4332]"
                />
              </div>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-3 border-2 rounded-lg focus:border-[#1B4332] focus:outline-none bg-white"
              >
                <option value="all">Alla städer</option>
                <option value="Stockholm">Stockholm</option>
                <option value="Göteborg">Göteborg</option>
                <option value="Malmö">Malmö</option>
              </select>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'all', label: 'Alla uppdrag' },
                  { id: 'matchday', label: 'Matchdag' },
                  { id: 'volunteer', label: 'Volontär' },
                  { id: 'professional', label: 'Professionell' },
                  { id: 'strategic', label: 'Strategisk' }
                ].map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'outline'}
                    onClick={() => setActiveTab(tab.id)}
                    className={activeTab === tab.id ? 'bg-[#1B4332] hover:bg-[#2E8B57]' : ''}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                Visar <strong>{filteredOpportunities.length}</strong> av <strong>{opportunities.length}</strong> uppdrag
              </div>
            </div>
          </motion.div>

          {/* Job Cards with Enhanced Design */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredOpportunities.map((opp, index) => (
              <motion.div
                key={opp.id}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all border-l-4 border-l-transparent hover:border-l-[#1B4332] relative overflow-hidden">
                  {opp.featured && (
                    <div className="absolute top-0 right-0 bg-[#FF6B35] text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Utvalda
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <img
                        src={opp.logo}
                        alt={opp.club}
                        className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                      />
                      <Badge className={`
                        ${opp.category === 'matchday' ? 'bg-blue-100 text-blue-800' : ''}
                        ${opp.category === 'volunteer' ? 'bg-green-100 text-green-800' : ''}
                        ${opp.category === 'professional' ? 'bg-purple-100 text-purple-800' : ''}
                        ${opp.category === 'strategic' ? 'bg-orange-100 text-orange-800' : ''}
                      `}>
                        {opp.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-[#1B4332] transition-colors">
                      {opp.role}
                    </CardTitle>
                    <CardDescription className="text-base font-medium text-gray-700">
                      {opp.club}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">{opp.description}</p>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#1B4332]" />
                        {opp.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#2E8B57]" />
                        {opp.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#FF6B35]" />
                        {opp.date}
                      </div>
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center justify-between mb-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span><strong>{opp.applicants}</strong> ansökningar</span>
                      </div>
                      {opp.daysLeft && opp.daysLeft <= 7 && (
                        <div className="flex items-center gap-1 text-sm text-orange-600 font-medium">
                          <Clock className="w-4 h-4" />
                          {opp.daysLeft} dagar kvar
                        </div>
                      )}
                    </div>

                    <Button className="w-full bg-[#1B4332] hover:bg-[#2E8B57] group-hover:shadow-lg transition-all">
                      Ansök nu
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - World Class */}
      <section className="py-20 bg-gradient-to-br from-[#1B4332] to-[#2E8B57] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Redo att komma igång?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Gå med i ANCHRD League idag och ta nästa steg i din fotbollsresa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#FF6B35] hover:bg-[#FF8555] text-white text-lg px-8 py-6 shadow-2xl hover:shadow-[#FF6B35]/50 transition-all hover:scale-105"
              >
                Skapa konto gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-[#1B4332] text-lg px-8 py-6 transition-all hover:scale-105"
              >
                Läs mer
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Logo size="small" />
              </div>
              <p className="text-gray-400 text-sm">
                Sveriges största marknadsplats för fotbollsjobb
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">För Jobbsökande</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Hitta Jobb</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Skapa Profil</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karriärtips</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">För Klubbar</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Publicera Jobb</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hitta Kandidater</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Priser</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Företag</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Om Oss</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integritetspolicy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Användarvillkor</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 ANCHRD League. Alla rättigheter förbehållna.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
