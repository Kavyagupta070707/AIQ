import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, QrCode, Users, Trophy } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <div className="min-h-screen h-screen w-full flex items-center justify-center bg-gradient-hero relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10 flex items-center justify-center h-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Hero Content */}
          <div className="text-center lg:text-left flex flex-col justify-center h-full">
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-soft">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">AI-Powered Quiz Generation</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Create & Share
              <span className="bg-white bg-clip-text text-transparent block">
                Interactive Quizzes
              </span>
              Instantly
            </h1>
            <p className="text-xl mb-8 leading-relaxed">
              Transform any topic into engaging quizzes with AI. Generate QR codes for instant sharing 
              and watch real-time leaderboards unfold as participants compete.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" onClick={onGetStarted}>
                Get Started Free
              </Button>
            </div>
            {/* Feature highlights */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-card rounded-lg p-4 shadow-soft mb-2">
                  <QrCode className="w-6 h-6 text-primary mx-auto" />
                </div>
                <p className="text-sm font-medium">QR Code Sharing</p>
              </div>
              <div className="text-center">
                <div className="bg-card rounded-lg p-4 shadow-soft mb-2">
                  <Users className="w-6 h-6 text-secondary mx-auto" />
                </div>
                <p className="text-sm font-medium">Real-time Participation</p>
              </div>
              <div className="text-center">
                <div className="bg-card rounded-lg p-4 shadow-soft mb-2">
                  <Trophy className="w-6 h-6 text-accent mx-auto" />
                </div>
                <p className="text-sm font-medium">Live Leaderboard</p>
              </div>
            </div>
          </div>
          {/* Hero Image */}
          <div className="relative flex items-center justify-center h-full">
            <Card className="overflow-hidden shadow-glow">
              <img 
                src={heroImage} 
                alt="AI Quiz Generator Platform" 
                className="w-full h-auto rounded-lg"
              />
            </Card>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-accent rounded-full p-3 shadow-soft animate-pulse">
              <Brain className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-secondary rounded-full p-3 shadow-soft animate-pulse delay-300">
              <QrCode className="w-6 h-6 text-secondary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;