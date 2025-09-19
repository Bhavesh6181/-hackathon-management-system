import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { hackathonsAPI } from '../../lib/api';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Trophy,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const MyHackathons = () => {
  const [myHackathons, setMyHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unregistering, setUnregistering] = useState(null);

  useEffect(() => {
    fetchMyHackathons();
  }, []);

  const fetchMyHackathons = async () => {
    try {
      const response = await hackathonsAPI.getMyHackathons();
      setMyHackathons(response.data);
    } catch (error) {
      console.error('Error fetching my hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (hackathonId) => {
    if (!confirm('Are you sure you want to unregister from this hackathon?')) {
      return;
    }

    setUnregistering(hackathonId);
    try {
      await hackathonsAPI.unregister(hackathonId);
      fetchMyHackathons();
    } catch (error) {
      console.error('Error unregistering from hackathon:', error);
      alert(error.response?.data?.message || 'Failed to unregister');
    } finally {
      setUnregistering(null);
    }
  };

  const getStatusColor = (hackathon) => {
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);

    if (now < startDate) return 'blue';
    if (now >= startDate && now <= endDate) return 'green';
    return 'gray';
  };

  const getStatusText = (hackathon) => {
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);

    if (now < startDate) return 'Upcoming';
    if (now >= startDate && now <= endDate) return 'Ongoing';
    return 'Completed';
  };

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            My Hackathons
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your registered hackathons and manage your participation
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myHackathons.length}</div>
              <p className="text-xs text-muted-foreground">hackathons joined</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myHackathons.filter(h => new Date() < new Date(h.startDate)).length}
              </div>
              <p className="text-xs text-muted-foreground">events to attend</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myHackathons.filter(h => new Date() > new Date(h.endDate)).length}
              </div>
              <p className="text-xs text-muted-foreground">hackathons finished</p>
            </CardContent>
          </Card>
        </div>

        {/* Hackathons List */}
        {myHackathons.length > 0 ? (
          <div className="space-y-6">
            {myHackathons.map((hackathon) => (
              <Card key={hackathon._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{hackathon.title}</CardTitle>
                      <CardDescription className="text-base">
                        Organized by {hackathon.organizer?.name}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={getStatusColor(hackathon) === 'green' ? 'default' : 'secondary'}
                      className={
                        getStatusColor(hackathon) === 'blue' ? 'bg-blue-100 text-blue-800' :
                        getStatusColor(hackathon) === 'green' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    >
                      {getStatusText(hackathon)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {hackathon.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Start Date</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(hackathon.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">End Date</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(hackathon.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{hackathon.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Participants</p>
                        <p className="text-sm text-muted-foreground">
                          {hackathon.participants?.length || 0}/{hackathon.maxParticipants}
                        </p>
                      </div>
                    </div>
                  </div>

                  {hackathon.tags && hackathon.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {hackathon.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild variant="outline">
                      <Link to={`/hackathons/${hackathon._id}`}>
                        View Details
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    
                    {new Date() < new Date(hackathon.startDate) && (
                      <Button 
                        variant="destructive"
                        onClick={() => handleUnregister(hackathon._id)}
                        disabled={unregistering === hackathon._id}
                      >
                        {unregistering === hackathon._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Unregistering...
                          </>
                        ) : (
                          'Unregister'
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Registered Hackathons</h3>
              <p className="text-muted-foreground mb-6">
                You haven't registered for any hackathons yet. Start your journey by joining an exciting event!
              </p>
              <Button asChild>
                <Link to="/hackathons">
                  Browse Hackathons
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyHackathons;

