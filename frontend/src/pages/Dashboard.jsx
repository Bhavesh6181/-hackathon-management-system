import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { hackathonsAPI } from '../lib/api';
import { 
  Calendar, 
  Users, 
  Trophy, 
  Plus, 
  ArrowRight,
  Clock,
  MapPin,
  Star
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [myHackathons, setMyHackathons] = useState([]);
  const [upcomingHackathons, setUpcomingHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [myHackathonsRes, upcomingRes] = await Promise.all([
        hackathonsAPI.getMyHackathons(),
        hackathonsAPI.getAll({ limit: 3 })
      ]);
      
      setMyHackathons(myHackathonsRes.data);
      setUpcomingHackathons(upcomingRes.data.hackathons);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getQuickActions = () => {
    if (user?.role === 'student') {
      return [
        { title: 'Browse Hackathons', href: '/hackathons', icon: Calendar, description: 'Find exciting hackathons to join' },
        { title: 'My Registrations', href: '/my-hackathons', icon: Users, description: 'View your registered hackathons' },
      ];
    }
    
    if (user?.role === 'organizer') {
      return [
        { title: 'Create Hackathon', href: '/create-hackathon', icon: Plus, description: 'Organize a new hackathon' },
        { title: 'Manage Events', href: '/manage-hackathons', icon: Calendar, description: 'Manage your hackathons' },
        { title: 'View Participants', href: '/participants', icon: Users, description: 'See registered participants' },
      ];
    }
    
    if (user?.role === 'admin') {
      return [
        { title: 'User Management', href: '/admin/users', icon: Users, description: 'Manage platform users' },
        { title: 'Moderate Hackathons', href: '/admin/hackathons', icon: Calendar, description: 'Review and approve events' },
      ];
    }
    
    return [];
  };

  const quickActions = getQuickActions();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            {getGreeting()}, {user?.name}! 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            Welcome to your {user?.role} dashboard. Here's what's happening in your hackathon world.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card key={action.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link to={action.href}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{action.title}</CardTitle>
                          <CardDescription>{action.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        {/* My Hackathons Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {user?.role === 'student' ? 'My Registered Hackathons' : 'My Hackathons'}
            </h2>
            <Button asChild variant="outline">
              <Link to={user?.role === 'student' ? '/my-hackathons' : '/manage-hackathons'}>
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
          
          {myHackathons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myHackathons.slice(0, 3).map((hackathon) => (
                <Card key={hackathon._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{hackathon.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {hackathon.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(hackathon.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {hackathon.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {hackathon.participants?.length || 0} participants
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4" variant="outline">
                      <Link to={`/hackathons/${hackathon._id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {user?.role === 'student' ? 'No Registered Hackathons' : 'No Hackathons Created'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {user?.role === 'student' 
                    ? 'Start your journey by registering for an exciting hackathon!'
                    : 'Create your first hackathon and start building your community!'
                  }
                </p>
                <Button asChild>
                  <Link to={user?.role === 'student' ? '/hackathons' : '/create-hackathon'}>
                    {user?.role === 'student' ? 'Browse Hackathons' : 'Create Hackathon'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Upcoming Hackathons */}
        {user?.role === 'student' && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Trending Hackathons</h2>
              <Button asChild variant="outline">
                <Link to="/hackathons">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingHackathons.map((hackathon) => (
                <Card key={hackathon._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{hackathon.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {hackathon.description}
                        </CardDescription>
                      </div>
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(hackathon.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Registration ends: {new Date(hackathon.registrationDeadline).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {hackathon.participants?.length || 0}/{hackathon.maxParticipants} participants
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4">
                      <Link to={`/hackathons/${hackathon._id}`}>Register Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === 'student' ? 'Registered Events' : 'Created Events'}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myHackathons.length}</div>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'student' ? 'hackathons joined' : 'hackathons organized'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myHackathons.reduce((total, h) => total + (h.participants?.length || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                across all events
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">
                completion rate
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

