import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Logo from '../components/Logo';
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
  Phone
} from 'lucide-react';

const ClubDashboard = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    activeOpportunities: 0,
    totalApplications: 0,
    pendingReview: 0,
    acceptedTalents: 0
  });

  useEffect(() => {
    // Load opportunities and applications from localStorage
    const storedOpportunities = JSON.parse(localStorage.getItem('club_opportunities') || '[]');
    const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    // Filter opportunities for this club
    const clubOpportunities = storedOpportunities.filter(opp => opp.clubId === user.id);
    setOpportunities(clubOpportunities);
    
    // Filter applications for this club's opportunities
    const opportunityIds = clubOpportunities.map(opp => opp.id);
    const clubApplications = storedApplications.filter(app => 
      opportunityIds.includes(app.opportunityId)
    );
    setApplications(clubApplications);
    
    // Calculate stats
    setStats({
      activeOpportunities: clubOpportunities.filter(opp => opp.status === 'active').length,
      totalApplications: clubApplications.length,
      pendingReview: clubApplications.filter(app => app.status === 'pending').length,
      acceptedTalents: clubApplications.filter(app => app.status === 'accepted').length
    });
  }, [user.id]);

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
      matchday: 'bg-green-100 text-green-800',
      professional: 'bg-blue-100 text-blue-800',
      volunteer: 'bg-pink-100 text-pink-800',
      strategic: 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
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
              Skapa uppdrag
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Välkommen tillbaka!</h2>
          <p className="text-foreground/70">
            Här är en översikt över dina uppdrag och ansökningar.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Aktiva uppdrag</p>
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
                  <p className="text-3xl font-bold text-green-600">{stats.acceptedTalents}</p>
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
              <h3 className="text-2xl font-bold">Dina uppdrag</h3>
              <Button variant="outline" className="rounded-button">
                <Eye className="w-4 h-4 mr-2" />
                Visa alla
              </Button>
            </div>

            {opportunities.length === 0 ? (
              <Card className="rounded-card">
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">Inga uppdrag ännu</h4>
                  <p className="text-foreground/60 mb-6">
                    Skapa ditt första uppdrag och börja hitta talanger!
                  </p>
                  <Button className="btn-primary rounded-button">
                    <Plus className="w-4 h-4 mr-2" />
                    Skapa uppdrag
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {opportunities.slice(0, 3).map((opp) => (
                  <Card key={opp.id} className="rounded-card card-hover">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getCategoryColor(opp.category)}>
                              {opp.type}
                            </Badge>
                            {getStatusBadge(opp.status)}
                          </div>
                          <CardTitle className="text-xl">{opp.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {opp.description.substring(0, 100)}...
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 text-sm text-foreground/60 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{opp.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{opp.startDate}</span>
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
            )}
          </div>

          {/* Right Column - Recent Applications & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="rounded-card">
              <CardHeader>
                <CardTitle>Snabbåtgärder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full btn-primary rounded-button justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Skapa nytt uppdrag
                </Button>
                <Button variant="outline" className="w-full rounded-button justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Sök talanger
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
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-foreground/20 mx-auto mb-2" />
                    <p className="text-sm text-foreground/60">Inga ansökningar ännu</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((app) => (
                      <div key={app.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-sm">{app.talentName}</p>
                            <p className="text-xs text-foreground/60">
                              {opportunities.find(opp => opp.id === app.opportunityId)?.title}
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
                    ))}
                  </div>
                )}
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
                  <span>{user.contactEmail}</span>
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

export default ClubDashboard;
