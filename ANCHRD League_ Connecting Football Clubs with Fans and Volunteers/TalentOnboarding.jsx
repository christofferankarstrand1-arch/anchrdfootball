import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const SKILLS = [
  'Social Media',
  'Event Management',
  'Coaching',
  'Data Analysis',
  'Marketing',
  'Administration',
  'Sponsorship',
  'Fotografi',
  'Video',
  'Annat'
];

const INTERESTS = [
  { value: 'matchday', label: 'Matchdag' },
  { value: 'professional', label: 'Professionell' },
  { value: 'volunteer', label: 'Volontär' },
  { value: 'strategic', label: 'Strategisk' }
];

const AVAILABILITY = [
  { value: 'fulltime', label: 'Heltid' },
  { value: 'parttime', label: 'Deltid' },
  { value: 'volunteer', label: 'Volontär' },
  { value: 'matchday', label: 'Matchdag' }
];

const TalentOnboarding = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    bio: '',
    experience: '1-3',
    availability: [],
    skills: [],
    interests: []
  });

  const [errors, setErrors] = useState({});

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleArrayField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Förnamn krävs';
      if (!formData.lastName.trim()) newErrors.lastName = 'Efternamn krävs';
      if (!formData.email.trim()) newErrors.email = 'Email krävs';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Ogiltig email';
      if (!formData.phone.trim()) newErrors.phone = 'Telefon krävs';
      if (!formData.city.trim()) newErrors.city = 'Stad krävs';
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = 'Lösenord måste vara minst 6 tecken';
      }
    }

    if (step === 2) {
      if (!formData.bio.trim()) newErrors.bio = 'Presentation krävs';
      if (formData.availability.length === 0) newErrors.availability = 'Välj minst en tillgänglighet';
    }

    if (step === 3) {
      if (formData.skills.length === 0) newErrors.skills = 'Välj minst en kompetens';
      if (formData.interests.length === 0) newErrors.interests = 'Välj minst ett intresseområde';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        onComplete(formData);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground/70">
            Steg {currentStep} av {totalSteps}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="rounded-card">
        <CardHeader>
          <CardTitle className="text-2xl">
            {currentStep === 1 && 'Grundläggande information'}
            {currentStep === 2 && 'Din profil'}
            {currentStep === 3 && 'Kompetenser & Intressen'}
            {currentStep === 4 && 'Bekräfta din profil'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Förnamn *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Efternamn *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="city">Stad *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="password">Lösenord *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Profile Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="bio">Presentation *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Berätta lite om dig själv och vad du söker..."
                  rows={4}
                  maxLength={200}
                  className={errors.bio ? 'border-red-500' : ''}
                />
                <p className="text-sm text-foreground/60 mt-1">
                  {formData.bio.length}/200 tecken
                </p>
                {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio}</p>}
              </div>

              <div>
                <Label htmlFor="experience">Erfarenhet</Label>
                <select
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="none">Ingen erfarenhet</option>
                  <option value="1-3">1-3 år</option>
                  <option value="3-5">3-5 år</option>
                  <option value="5+">5+ år</option>
                </select>
              </div>

              <div>
                <Label>Tillgänglighet *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {AVAILABILITY.map(item => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => toggleArrayField('availability', item.value)}
                      className={`px-4 py-3 border-2 rounded-lg transition-all ${
                        formData.availability.includes(item.value)
                          ? 'border-secondary bg-secondary/10 text-secondary font-medium'
                          : 'border-border hover:border-secondary/50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                {errors.availability && <p className="text-sm text-red-500 mt-1">{errors.availability}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Skills & Interests */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label>Kompetenser *</Label>
                <p className="text-sm text-foreground/60 mb-3">Välj dina kompetenser</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SKILLS.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleArrayField('skills', skill)}
                      className={`px-4 py-3 border-2 rounded-lg transition-all text-sm ${
                        formData.skills.includes(skill)
                          ? 'border-secondary bg-secondary/10 text-secondary font-medium'
                          : 'border-border hover:border-secondary/50'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                {errors.skills && <p className="text-sm text-red-500 mt-1">{errors.skills}</p>}
              </div>

              <div>
                <Label>Intresseområden *</Label>
                <p className="text-sm text-foreground/60 mb-3">Vilka typer av uppdrag intresserar dig?</p>
                <div className="grid grid-cols-2 gap-3">
                  {INTERESTS.map(interest => (
                    <button
                      key={interest.value}
                      type="button"
                      onClick={() => toggleArrayField('interests', interest.value)}
                      className={`px-4 py-3 border-2 rounded-lg transition-all ${
                        formData.interests.includes(interest.value)
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {interest.label}
                    </button>
                  ))}
                </div>
                {errors.interests && <p className="text-sm text-red-500 mt-1">{errors.interests}</p>}
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Din profil</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-foreground/60">Namn:</span>
                    <span className="ml-2 font-medium">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div>
                    <span className="text-foreground/60">Email:</span>
                    <span className="ml-2 font-medium">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-foreground/60">Stad:</span>
                    <span className="ml-2 font-medium">{formData.city}</span>
                  </div>
                  <div>
                    <span className="text-foreground/60">Erfarenhet:</span>
                    <span className="ml-2 font-medium">{formData.experience}</span>
                  </div>
                  <div>
                    <span className="text-foreground/60">Tillgänglighet:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.availability.map(item => (
                        <span key={item} className="px-2 py-1 bg-secondary/10 text-secondary rounded text-xs">
                          {AVAILABILITY.find(a => a.value === item)?.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-foreground/60">Kompetenser:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Redo att komma igång!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Klicka på "Skapa mitt konto" för att slutföra registreringen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="rounded-button"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Tillbaka
            </Button>
            <Button
              onClick={handleNext}
              className={currentStep === totalSteps ? 'btn-primary' : 'btn-secondary'}
            >
              {currentStep === totalSteps ? 'Skapa mitt konto' : 'Nästa'}
              {currentStep < totalSteps && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TalentOnboarding;
