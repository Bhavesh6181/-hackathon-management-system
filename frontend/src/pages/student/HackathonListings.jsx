import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { hackathonsAPI } from '../../lib/api';
import TeamRegistrationModal from '../../components/TeamRegistrationModal';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Trophy,
  Search,
  Filter,
  ArrowRight,
  UserPlus
} from 'lucide-react';

const HackathonListings = () => {
  const { id } = useParams();
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [registering, setRegistering] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedHackathonForTeam, setSelectedHackathonForTeam] = useState(null);

  useEffect(() => {
    fetchHackathons();
  }, []);

  useEffect(() => {
    if (id) {
      fetchHackathonDetails(id);
    }
  }, [id]);

  const fetchHackathons = async () => {
    try {
      const response = await hackathonsAPI.getAll();
      setHackathons(response.data.hackathons);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHackathonDetails = async (hackathonId) => {
    try {
      const response = await hackathonsAPI.getById(hackathonId);
      setSelectedHackathon(response.data);
    } catch (error) {
      console.error('Error fetching hackathon details:', error);
    }
  };

  const handleRegister = async (hackathonId) => {
    setRegistering(hackathonId);
    try {
      await hackathonsAPI.register(hackathonId);
      // Refresh hackathon details
      if (selectedHackathon) {
        fetchHackathonDetails(hackathonId);
      }
      fetchHackathons();
    } catch (error) {
      console.error('Error registering for hackathon:', error);
      alert(error.response?.data?.message || 'Failed to register');
    } finally {
      setRegistering(null);
    }
  };

  const handleTeamRegister = (hackathon) => {
    setSelectedHackathonForTeam(hackathon);
    setShowTeamModal(true);
  };

  const handleTeamRegistrationSuccess = () => {
    // Refresh hackathon details
    if (selectedHackathon) {
      fetchHackathonDetails(selectedHackathon._id);
    }
    fetchHackathons();
  };

  const filteredHackathons = hackathons.filter(hackathon =>
    hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hackathon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If viewing a specific hackathon
  if (selectedHackathon) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button asChild variant="outline" className="mb-6">
            <Link to="/hackathons">← Back to Listings</Link>
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{selectedHackathon.title}</CardTitle>
                  <CardDescription className="text-lg">
                    Organized by {selectedHackathon.organizer?.name}
                  </CardDescription>
                </div>
                <Badge variant="default">
                  Approved
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground text-lg">{selectedHackathon.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Event Dates</p>
                      <p className="text-muted-foreground">
                        {new Date(selectedHackathon.startDate).toLocaleDateString()} - {new Date(selectedHackathon.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Registration Deadline</p>
                      <p className="text-muted-foreground">
                        {new Date(selectedHackathon.registrationDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{selectedHackathon.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Participants</p>
                      <p className="text-muted-foreground">
                        {selectedHackathon.participants?.length || 0} / {selectedHackathon.maxParticipants}
                      </p>
                    </div>
                  </div>

                  {selectedHackathon.prizes && selectedHackathon.prizes.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <Trophy className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Prizes</p>
                        <div className="space-y-1">
                          {selectedHackathon.prizes.map((prize, index) => (
                            <p key={index} className="text-muted-foreground">
                              {prize.position}: {prize.amount} - {prize.description}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedHackathon.requirements && (
                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <p className="text-muted-foreground">{selectedHackathon.requirements}</p>
                </div>
              )}

              {selectedHackathon.tags && selectedHackathon.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedHackathon.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t">
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Team Registration Required</h4>
                    <p className="text-blue-700 text-sm mb-3">
                      This hackathon requires team participation. Form a team of {selectedHackathon.teamSize?.min || 3}-{selectedHackathon.teamSize?.max || 4} members to register.
                    </p>
                    <Button 
                      onClick={() => handleTeamRegister(selectedHackathon)}
                      disabled={new Date() > new Date(selectedHackathon.registrationDeadline)}
                      className="w-full md:w-auto"
                      size="lg"
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Register Team
                    </Button>
                  </div>
                  
                  {new Date() > new Date(selectedHackathon.registrationDeadline) && (
                    <p className="text-red-600 text-sm">Registration deadline has passed</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Hackathon listings view
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Discover Hackathons
          </h1>
          <p className="text-xl text-muted-foreground">
            Find exciting hackathons to join and showcase your skills
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search hackathons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Hackathon Grid */}
        {filteredHackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map((hackathon) => (
              <Card key={hackathon._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg line-clamp-2">{hackathon.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {hackathon.description}
                      </CardDescription>
                    </div>
                    <Badge variant="default">
                      Approved
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
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
                      {hackathon.participants?.length || 0}/{hackathon.maxParticipants} participants
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Deadline: {new Date(hackathon.registrationDeadline).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link to={`/hackathons/${hackathon._id}`}>
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button 
                      onClick={() => handleTeamRegister(hackathon)}
                      disabled={new Date() > new Date(hackathon.registrationDeadline)}
                      className="flex-1"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Hackathons Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new hackathons!'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Team Registration Modal */}
      <TeamRegistrationModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        hackathon={selectedHackathonForTeam}
        onSuccess={handleTeamRegistrationSuccess}
      />
    </div>
  );
};

export default HackathonListings;

