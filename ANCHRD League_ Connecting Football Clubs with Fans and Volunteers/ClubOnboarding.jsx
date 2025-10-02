import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const DIVISIONS = [
  'Allsvenskan',
  'Superettan',
  'Division 1',
  'Division 2',
  'Division 3',
  'Division 4',
  'Division 5',
  'Division 6',
  'Division 7'
];

const ClubOnboarding = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    clubName: '',
    email: '',
    phone: '',
    city: '',
    division: 'Division 2',
    password: '',
    about: '',
    founded: '',
    members: '',
    website: '',
    contactName: '',
    contactRole: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [errors, setErrors] = useState({});

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.clubName.trim()) newErrors.clubName = 'Klubbnamn krävs';
      if (!formData.email.trim()) newErrors.email = 'Email krävs';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Ogiltig email';
      if (!formData.phone.trim()) newErrors.phone = 'Telefon krävs';
      if (!formData.city.trim()) newErrors.city = 'Stad krävs';
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = 'Lösenord måste vara minst 6 tecken';
      }
    }

    if (step === 2) {
      if (!formData.about.trim()) newErrors.about = 'Beskrivning krävs';
      if (!formData.founded) newErrors.founded = 'Grundad år krävs';
      if (!formData.members) newErrors.members = 'Antal medlemmar krävs';
    }

    if (step === 3) {
      if (!formData.contactName.trim()) newErrors.contactName = 'Kontaktperson krävs';
      if (!formData.contactRole.trim()) newErrors.contactRole = 'Roll krävs';
      if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email krävs';
      else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) newErrors.contactEmail = 'Ogiltig email';
      if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Telefon krävs';
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
            {currentStep === 1 && 'Klubbinformation'}
            {currentStep === 2 && 'Om klubben'}
            {currentStep === 3 && 'Kontaktperson'}
            {currentStep === 4 && 'Bekräfta klubbprofil'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Club Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="clubName">Klubbnamn *</Label>
                <Input
                  id="clubName"
                  value={formData.clubName}
                  onChange={(e) => handleChange('clubName', e.target.value)}
                  className={errors.clubName ? 'border-red-500' : ''}
                />
                {errors.clubName && <p className="text-sm text-red-500 mt-1">{errors.clubName}</p>}
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
                <Label htmlFor="division">Division/Liga *</Label>
                <select
                  id="division"
                  value={formData.division}
                  onChange={(e) => handleChange('division', e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {DIVISIONS.map(div => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
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

          {/* Step 2: Club Profile */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="about">Om klubben *</Label>
                <Textarea
                  id="about"
                  value={formData.about}
                  onChange={(e) => handleChange('about', e.target.value)}
                  placeholder="Berätta om er klubb, historia och värderingar..."
                  rows={5}
                  maxLength={500}
                  className={errors.about ? 'border-red-500' : ''}
                />
                <p className="text-sm text-foreground/60 mt-1">
                  {formData.about.length}/500 tecken
                </p>
                {errors.about && <p className="text-sm text-red-500 mt-1">{errors.about}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="founded">Grundad år *</Label>
                  <Input
                    id="founded"
                    type="number"
                    value={formData.founded}
                    onChange={(e) => handleChange('founded', e.target.value)}
                    placeholder="1920"
                    min="1800"
                    max={new Date().getFullYear()}
                    className={errors.founded ? 'border-red-500' : ''}
                  />
                  {errors.founded && <p className="text-sm text-red-500 mt-1">{errors.founded}</p>}
                </div>
                <div>
                  <Label htmlFor="members">Antal medlemmar *</Label>
                  <Input
                    id="members"
                    type="number"
                    value={formData.members}
                    onChange={(e) => handleChange('members', e.target.value)}
                    placeholder="500"
                    min="1"
                    className={errors.members ? 'border-red-500' : ''}
                  />
                  {errors.members && <p className="text-sm text-red-500 mt-1">{errors.members}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="website">Hemsida (valfritt)</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://www.klubben.se"
                />
              </div>
            </div>
          )}

          {/* Step 3: Contact Person */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-foreground/60">
                Ange kontaktperson för klubben som talanger kan nå vid frågor.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Namn *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleChange('contactName', e.target.value)}
                    className={errors.contactName ? 'border-red-500' : ''}
                  />
                  {errors.contactName && <p className="text-sm text-red-500 mt-1">{errors.contactName}</p>}
                </div>
                <div>
                  <Label htmlFor="contactRole">Roll/Position *</Label>
                  <Input
                    id="contactRole"
                    value={formData.contactRole}
                    onChange={(e) => handleChange('contactRole', e.target.value)}
                    placeholder="t.ex. Sportchef"
                    className={errors.contactRole ? 'border-red-500' : ''}
                  />
                  {errors.contactRole && <p className="text-sm text-red-500 mt-1">{errors.contactRole}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className={errors.contactEmail ? 'border-red-500' : ''}
                />
                {errors.contactEmail && <p className="text-sm text-red-500 mt-1">{errors.contactEmail}</p>}
              </div>

              <div>
                <Label htmlFor="contactPhone">Telefon *</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  className={errors.contactPhone ? 'border-red-500' : ''}
                />
                {errors.contactPhone && <p className="text-sm text-red-500 mt-1">{errors.contactPhone}</p>}
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Klubbprofil</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-foreground/60">Klubbnamn:</span>
                    <span className="ml-2 font-medium">{formData.clubName}</span>
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
                    <span className="text-foreground/60">Division:</span>
                    <span className="ml-2 font-medium">{formData.division}</span>
                  </div>
                  <div>
                    <span className="text-foreground/60">Grundad:</span>
                    <span className="ml-2 font-medium">{formData.founded}</span>
                  </div>
                  <div>
                    <span className="text-foreground/60">Medlemmar:</span>
                    <span className="ml-2 font-medium">{formData.members}</span>
                  </div>
                  <div>
                    <span className="text-foreground/60">Kontaktperson:</span>
                    <span className="ml-2 font-medium">{formData.contactName} ({formData.contactRole})</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Redo att komma igång!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Klicka på "Skapa klubbkonto" för att slutföra registreringen och börja publicera uppdrag.
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
              {currentStep === totalSteps ? 'Skapa klubbkonto' : 'Nästa'}
              {currentStep < totalSteps && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubOnboarding;
