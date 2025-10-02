import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Progress } from '../ui/progress';
import { Users, Building2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import TalentOnboarding from './TalentOnboarding';
import ClubOnboarding from './ClubOnboarding';

const OnboardingWizard = () => {
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setStep(1);
  };

  const handleComplete = (userData) => {
    // Create complete user object
    const completeUser = {
      ...userData,
      type: userType,
      id: `${userType}_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to auth context and localStorage
    login(completeUser);

    // Navigate to appropriate dashboard
    if (userType === 'talent') {
      navigate('/dashboard/talent');
    } else {
      navigate('/dashboard/club');
    }
  };

  const handleBack = () => {
    if (step === 1) {
      setStep(0);
      setUserType(null);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Välkommen till ANCHRD League</h1>
          <p className="text-lg text-foreground/70">
            {step === 0 ? 'Låt oss komma igång!' : 'Fyll i din information'}
          </p>
        </div>

        {/* User Type Selection */}
        {step === 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className="rounded-card cursor-pointer card-hover border-2 border-border hover:border-primary transition-all"
              onClick={() => handleUserTypeSelect('talent')}
            >
              <CardHeader className="text-center">
                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Jag är en talang</CardTitle>
                <CardDescription className="text-base">
                  Sök jobb, gig och volontäruppdrag hos fotbollsklubbar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-secondary" />
                    Skapa din profil
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-secondary" />
                    Ansök till uppdrag
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-secondary" />
                    Bygg din karriär
                  </li>
                </ul>
                <Button className="w-full mt-6 btn-secondary rounded-button">
                  Välj talang
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card
              className="rounded-card cursor-pointer card-hover border-2 border-border hover:border-primary transition-all"
              onClick={() => handleUserTypeSelect('club')}
            >
              <CardHeader className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Jag är en klubb</CardTitle>
                <CardDescription className="text-base">
                  Publicera uppdrag och hitta rätt talanger för din klubb
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Skapa klubbprofil
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Publicera uppdrag
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Hitta talanger
                  </li>
                </ul>
                <Button className="w-full mt-6 btn-primary rounded-button">
                  Välj klubb
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Onboarding Forms */}
        {step === 1 && userType === 'talent' && (
          <TalentOnboarding onComplete={handleComplete} onBack={handleBack} />
        )}

        {step === 1 && userType === 'club' && (
          <ClubOnboarding onComplete={handleComplete} onBack={handleBack} />
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
