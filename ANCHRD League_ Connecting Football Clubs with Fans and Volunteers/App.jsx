import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Users, Target, Briefcase, Calendar, MapPin, Clock, ArrowRight, Anchor, TrendingUp, Heart, Zap, Network, Menu, X, Search } from 'lucide-react'
import Logo from '@/components/Logo.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      description: 'Vi söker entusiastiska värdar för att välkomna fans på matchdag.'
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
      description: 'Ansvarig för klubbens sociala medier och digitala närvaro.'
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
      description: 'Träna och utveckla våra unga spelare i åldrarna 10-12 år.'
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
      description: 'Stötta styrelsen i strategiska beslut och affärsutveckling.'
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
      description: 'Koordinera och genomföra matchdagsevent och aktiviteter.'
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
      description: 'Analysera matchdata och spelare för att optimera prestanda.'
    }
  ]

  const filteredOpportunities = opportunities.filter(opp => {
    // Category filter
    const matchesCategory = activeTab === 'all' || opp.category === activeTab
    
    // Search filter
