import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Badge } from './components/ui/badge';
import Logo from './components/Logo';
import {
  Plus,
  Briefcase,
  Users,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  TrendingUp,
  Mail,
  Phone,
  DollarSign
} from 'lucide-react';

// Mock club user data
const mockClubUser = {
  id: 'club_1234567890',
  type: 'club',
  clubName: 'Hammarby IF',
  email: 'info@hammarbyfotboll.se',
  phone: '08-123 456 78',
  city: 'Stockholm',
  division: 'Allsvenskan',
  about: 'Hammarby IF är en av Sveriges största fotbollsklubbar med en rik historia sedan 1897.',
  founded: 1897,
  members: 25000,
  website: 'https://www.hammarbyfotboll.se',
  contactName: 'Anna Svensson',
  contactRole: 'Sportchef',
  contactEmail: 'anna.svensson@hammarbyfotboll.se',
  contactPhone: '08-123 456 79'
};

// Mock opportunities with diverse roles
const mockOpportunities = [
  {
    id: 'opp_1',
    clubId: 'club_1234567890',
    title: 'Anläggningsskötare',
    category: 'facility',
    type: 'Anläggning',
    description: 'Vi söker en anläggningsskötare för underhåll av gräsplan, omklädningsrum och träningsanläggningar. Arbetet inkluderar gräsklippning, linjedragning och allmänt underhåll.',
    location: 'Tele2 Arena & Årsta IP, Stockholm',
    city: 'Stockholm',
    timeCommitment: 'Heltid',
    employmentType: 'Heltid',
    startDate: '2025-11-01',
    compensation: '28 000-32 000 kr/mån',
    spots: 1,
    status: 'active'
  },
  {
    id: 'opp_2',
    clubId: 'club_1234567890',
    title: 'Content Creator - Video & Foto',
    category: 'content',
    type: 'Content & Media',
    description: 'Skapa engagerande videoinnehåll och fotografera matcher, träningar och event. Redigera material för sociala medier och klubbens kanaler. Kreativ frihet att bygga vårt varumärke.',
    location: 'Tele2 Arena, Stockholm',
    city: 'Stockholm',
    timeCommitment: 'Deltid (50%)',
    employmentType: 'Deltid',
    startDate: '2025-10-20',
    compensation: '18 000 kr/mån',
    spots: 1,
    status: 'active'
  },
  {
    id: 'opp_3',
    clubId: 'club_1234567890',
    title: 'Ungdomstränare U12',
    category: 'coaching',
    type: 'Tränarroll',
    description: 'Träna och utveckla våra unga spelare i åldrarna 10-12 år. Vi söker en engagerad tränare med UEFA C-licens eller motsvarande som vill vara med och forma framtidens Hammarby-spelare.',
    location: 'Årsta IP, Stockholm',
    city: 'Stockholm',
    timeCommitment: '3 träningar/vecka + match',
    employmentType: 'Deltid',
    startDate: '2025-10-15',
    compensation: '8 000 kr/mån',
    spots: 2,
    status: 'active'
  },
  {
    id: 'opp_4',
    clubId: 'club_1234567890',
    title: 'Matchdagsvärdar',
    category: 'matchday',
    type: 'Matchdagsuppdrag',
    description: 'Välkomna fans, svara på frågor och skapa en fantastisk atmosfär på Tele2 Arena. Perfekt för dig som älskar fotboll och att möta människor.',
    location: 'Tele2 Arena, Stockholm',
    city: 'Stockholm',
    timeCommitment: '4 timmar per matchdag',
    employmentType: 'Timanställning',
    startDate: '2025-10-15',
    compensation: '180 kr/timme',
    spots: 8,
    status: 'active'
  },
  {
    id: 'opp_5',
    clubId: 'club_1234567890',
    title: 'Sponsoransvarig',
    category: 'sponsorship',
    type: 'Sponsring & Partnerskap',
    description: 'Ansvarig för att hitta och vårda sponsorrelationer. Arbeta med företag som vill associeras med Hammarby IF och skapa värdefulla partnerskap.',
    location: 'Tele2 Arena, Stockholm',
    city: 'Stockholm',
    timeCommitment: 'Heltid',
    employmentType: 'Heltid',
    startDate: '2025-11-15',
    compensation: '35 000-45 000 kr/mån + provision',
    spots: 1,
    status: 'active'
  },
  {
    id: 'opp_6',
    clubId: 'club_1234567890',
    title: 'Volontär - Supporteraktiviteter',
    category: 'volunteer',
    type: 'Volontär',
    description: 'Hjälp till med att organisera supporterevent, tifon och andra aktiviteter. Var med och bygga den starkaste supporterkulturen i Sverige!',
    location: 'Tele2 Arena, Stockholm',
    city: 'Stockholm',
    timeCommitment: 'Flexibelt, ca 5-10 tim/mån',
    employmentType: 'Volontär',
    startDate: '2025-10-10',
    compensation: 'Volontär',
    spots: 5,
    status: 'active'
  }
];

// Mock applications with diverse applicants
const mockApplications = [
  {
    id: 'app_1',
    opportunityId: 'opp_1',
    applicantName: 'Lars Eriksson',
    status: 'pending',
    appliedAt: '2025-10-02T08:30:00.000Z'
  },
  {
    id: 'app_2',
    opportunityId: 'opp_2',
    applicantName: 'Sofia Bergman',
    status: 'pending',
    appliedAt: '2025-10-02T10:15:00.000Z'
  },
  {
    id: 'app_3',
    opportunityId: 'opp_3',
    applicantName: 'Johan Andersson',
    status: 'reviewed',
    appliedAt: '2025-10-01T14:20:00.000Z'
  },
  {
    id: 'app_4',
    opportunityId: 'opp_4',
    applicantName: 'Emma Karlsson',
    status: 'pending',
    appliedAt: '2025-10-01T16:45:00.000Z'
  },
  {
    id: 'app_5',
    opportunityId: 'opp_3',
    applicantName: 'Michael Johansson',
    status: 'accepted',
    appliedAt: '2025-09-30T11:15:00.000Z'
  },
  {
    id: 'app_6',
    opportunityId: 'opp_5',
    applicantName: 'Anna Lindström',
    status: 'pending',
    appliedAt: '2025-10-02T09:00:00.000Z'
  },
  {
    id: 'app_7',
    opportunityId: 'opp_6',
    applicantName: 'David Nilsson',
    status: 'accepted',
    appliedAt: '2025-09-29T13:30:00.000Z'
  }
];

const ClubDashboardDemo = () => {
  const user = mockClubUser;
  const [opportunities] = useState(mockOpportunities);
  const [applications] = useState(mockApplications);
  const [stats] = useState({
    activeOpportunities: 6,
    totalApplications: 7,
    pendingReview: 4,
    acceptedApplicants: 2
  });

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      closed: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const labels = {
      active: 'Aktiv',
      draft: 'Utkast',
      closed: 'Stängd'
    };
    
    return (
      <Badge className={`${styles[status]} border`}>
        {labels[status]}
      </Badge>
    );
  };

  const getApplicationStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const labels = {
      pending: 'Väntande',
      reviewed: 'Granskad',
      accepted: 'Accepterad',
      rejected: 'Avvisad'
    };
    
    return (
      <Badge className={`${styles[status]} border text-xs`}>
        {labels[status]}
      </Badge>
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      facility: 'bg-amber-100 text-amber-800',
      content: 'bg-purple-100 text-purple-800',
      coaching: 'bg-blue-100 text-blue-800',
      matchday: 'bg-green-100 text-green-800',
      sponsorship: 'bg-orange-100 text-orange-800',
      volunteer: 'bg-pink-100 text-pink-800',
      professional: 'bg-indigo-100 text-indigo-800',
      strategic: 'bg-violet-100 text-violet-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getEmploymentTypeBadge = (type) => {
    const styles = {
      'Heltid': 'bg-blue-50 text-blue-700 border-blue-200',
      'Deltid': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      'Timanställning': 'bg-teal-50 text-teal-700 border-teal-200',
      'Volontär': 'bg-pink-50 text-pink-700 border-pink-200'
    };
    
    return (
      <Badge className={`${styles[type] || 'bg-gray-50 text-gray-700 border-gray-200'} border text-xs`}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Logo size="default" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">{user.clubName}</h1>
                <p className="text-sm text-foreground/60">{user.division} • {user.city}</p>
              </div>
            </div>
            <Button className="btn-primary rounded-button">
              <Plus className="w-4 h-4 mr-2" />
              Skapa annons
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Välkommen tillbaka!</h2>
          <p className="text-foreground/70">
            Här är en översikt över dina annonser och ansökningar.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Aktiva annonser</p>
                  <p className="text-3xl font-bold text-primary">{stats.activeOpportunities}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Totalt ansökningar</p>
                  <p className="text-3xl font-bold text-secondary">{stats.totalApplications}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Väntar granskning</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingReview}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Accepterade</p>
                  <p className="text-3xl font-bold text-green-600">{stats.acceptedApplicants}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Opportunities */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Dina annonser</h3>
              <Button variant="outline" className="rounded-button">
                <Eye className="w-4 h-4 mr-2" />
                Visa alla
              </Button>
            </div>

            <div className="space-y-4">
              {opportunities.slice(0, 4).map((opp) => (
                <Card key={opp.id} className="rounded-card card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge className={getCategoryColor(opp.category)}>
                            {opp.type}
                          </Badge>
                          {getEmploymentTypeBadge(opp.employmentType)}
                          {getStatusBadge(opp.status)}
                        </div>
                        <CardTitle className="text-xl">{opp.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {opp.description.substring(0, 120)}...
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-foreground/60 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{opp.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{opp.startDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{opp.timeCommitment}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{opp.compensation}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{applications.filter(app => app.opportunityId === opp.id).length} ansökningar</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-button flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Visa
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-button flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Redigera
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-button">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Quick Actions & Applications */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="rounded-card">
              <CardHeader>
                <CardTitle>Snabbåtgärder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full btn-primary rounded-button justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Skapa ny annons
                </Button>
                <Button variant="outline" className="w-full rounded-button justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Sök kandidater
                </Button>
                <Button variant="outline" className="w-full rounded-button justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Visa statistik
                </Button>
                <Button variant="outline" className="w-full rounded-button justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Redigera profil
                </Button>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card className="rounded-card">
              <CardHeader>
                <CardTitle>Senaste ansökningar</CardTitle>
                <CardDescription>
                  {stats.pendingReview} väntar på granskning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.slice(0, 5).map((app) => {
                    const opportunity = opportunities.find(opp => opp.id === app.opportunityId);
                    return (
                      <div key={app.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-sm">{app.applicantName}</p>
                            <p className="text-xs text-foreground/60">
                              {opportunity?.title}
                            </p>
                          </div>
                          {getApplicationStatusBadge(app.status)}
                        </div>
                        <p className="text-xs text-foreground/60 mb-2">
                          {new Date(app.appliedAt).toLocaleDateString('sv-SE')}
                        </p>
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" className="btn-secondary rounded-button text-xs flex-1">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Acceptera
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-button text-xs flex-1">
                              <XCircle className="w-3 h-3 mr-1" />
                              Avslå
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Club Info */}
            <Card className="rounded-card">
              <CardHeader>
                <CardTitle>Kontaktinformation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-foreground/60 mb-1">Kontaktperson</p>
                  <p className="font-medium">{user.contactName}</p>
                  <p className="text-xs text-foreground/60">{user.contactRole}</p>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs">{user.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/70">
                  <Phone className="w-4 h-4" />
                  <span>{user.contactPhone}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboardDemo;
