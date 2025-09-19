import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Target, Heart, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            About HackHub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to democratize innovation by making hackathons accessible, 
            organized, and impactful for everyone in the tech community.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Our Mission</CardTitle>
              <CardDescription className="text-lg">
                To empower innovators worldwide by providing the best platform for organizing, 
                participating in, and managing hackathons that drive technological advancement 
                and creative problem-solving.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Community First</CardTitle>
                <CardDescription>
                  We believe in the power of community. Every feature we build is designed 
                  to bring people together, foster collaboration, and create lasting connections.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Innovation Focus</CardTitle>
                <CardDescription>
                  We're committed to pushing the boundaries of what's possible. Our platform 
                  evolves with the needs of the tech community and emerging technologies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Inclusive Environment</CardTitle>
                <CardDescription>
                  We strive to create an inclusive space where everyone feels welcome, 
                  regardless of their background, experience level, or technical expertise.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Excellence Driven</CardTitle>
                <CardDescription>
                  We're passionate about delivering exceptional experiences. Every interaction 
                  on our platform is crafted with attention to detail and user satisfaction.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center mb-6">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-6">
                HackHub was born from a simple observation: organizing and participating in hackathons 
                was unnecessarily complicated. As developers and hackathon enthusiasts ourselves, 
                we experienced firsthand the challenges of fragmented tools, poor communication, 
                and missed opportunities.
              </p>
              <p className="text-muted-foreground mb-6">
                In 2024, we decided to build the platform we wished existed. Starting with a small 
                team of passionate developers, we created HackHub to streamline the entire hackathon 
                lifecycle - from initial planning to final judging and beyond.
              </p>
              <p className="text-muted-foreground mb-6">
                Today, HackHub serves thousands of developers, organizers, and innovators worldwide. 
                We've facilitated hundreds of hackathons, helped distribute millions in prizes, 
                and most importantly, we've watched countless ideas transform into real-world solutions.
              </p>
              <p className="text-muted-foreground">
                But this is just the beginning. We're continuously evolving, adding new features, 
                and expanding our reach to make hackathons more accessible and impactful for everyone.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Whether you're a student looking to learn, an organizer planning your next event, 
            or a company seeking innovative talent, HackHub is here to support your goals.
          </p>
          <div className="bg-primary/5 rounded-lg p-8">
            <p className="text-lg font-medium text-primary">
              "Innovation happens when passionate people come together to solve real problems. 
              HackHub is where those connections are made."
            </p>
            <p className="text-muted-foreground mt-4">- The HackHub Team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

