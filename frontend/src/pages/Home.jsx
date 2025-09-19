import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Calendar, 
  Users, 
  Trophy, 
  Zap, 
  ArrowRight,
  Code,
  Lightbulb,
  Target
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Welcome to{' '}
              <span className="text-primary">HackHub</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The ultimate platform for managing hackathons, connecting innovators, and fostering creativity. 
              Join thousands of developers, designers, and entrepreneurs in building the future.
            </p>
            
            {/* Scrolling Marquee */}
            <div className="mb-8 overflow-hidden bg-primary/5 py-3 rounded-lg">
              <div className="animate-marquee whitespace-nowrap">
                <span className="text-primary font-medium mx-8">🚀 Join 10,000+ developers</span>
                <span className="text-primary font-medium mx-8">💡 500+ hackathons hosted</span>
                <span className="text-primary font-medium mx-8">🏆 $2M+ in prizes awarded</span>
                <span className="text-primary font-medium mx-8">🌟 Build the next big thing</span>
                <span className="text-primary font-medium mx-8">🚀 Join 10,000+ developers</span>
                <span className="text-primary font-medium mx-8">💡 500+ hackathons hosted</span>
                <span className="text-primary font-medium mx-8">🏆 $2M+ in prizes awarded</span>
                <span className="text-primary font-medium mx-8">🌟 Build the next big thing</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button asChild size="lg" className="text-lg px-8 py-3">
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="text-lg px-8 py-3">
                    <Link to="/login">
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                    <Link to="/about">Learn More</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose HackHub?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to organize, participate in, and manage hackathons in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Easy Event Management</CardTitle>
                <CardDescription>
                  Create and manage hackathons with our intuitive interface. Set dates, manage registrations, and track participants effortlessly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Community Driven</CardTitle>
                <CardDescription>
                  Connect with like-minded developers, designers, and entrepreneurs. Build teams and collaborate on innovative projects.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Competitive Environment</CardTitle>
                <CardDescription>
                  Participate in exciting competitions with amazing prizes. Showcase your skills and win recognition in the community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Developer Friendly</CardTitle>
                <CardDescription>
                  Built by developers, for developers. Our platform understands your needs and provides the tools you love.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Innovation Hub</CardTitle>
                <CardDescription>
                  Turn your ideas into reality. Get feedback, find mentors, and access resources to bring your projects to life.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Goal Oriented</CardTitle>
                <CardDescription>
                  Set clear objectives and track progress. Our platform helps you stay focused and achieve your hackathon goals.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Developers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Hackathons Hosted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">₹15Cr+</div>
              <div className="text-muted-foreground">Prizes Awarded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of innovators and start building amazing projects today.
          </p>
          {!isAuthenticated && (
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Link to="/login">
                <Zap className="mr-2 w-5 h-5" />
                Join HackHub Now
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

