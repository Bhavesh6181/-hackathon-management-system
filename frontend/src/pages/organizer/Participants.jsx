import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { hackathonsAPI } from '../../lib/api';
import { 
  Users, 
  Search, 
  Download, 
  Mail,
  Calendar,
  Filter
} from 'lucide-react';

const Participants = () => {
  const [searchParams] = useSearchParams();
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState('');
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMyHackathons();
  }, []);

  useEffect(() => {
    const hackathonId = searchParams.get('hackathon');
    if (hackathonId) {
      setSelectedHackathon(hackathonId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedHackathon) {
      fetchParticipants();
    }
  }, [selectedHackathon]);

  const fetchMyHackathons = async () => {
    try {
      const response = await hackathonsAPI.getMyHackathons();
      setHackathons(response.data);
      
      // If no hackathon is pre-selected and we have hackathons, select the first one
      if (!searchParams.get('hackathon') && response.data.length > 0) {
        setSelectedHackathon(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    if (!selectedHackathon) return;
    
    try {
      const response = await hackathonsAPI.getById(selectedHackathon);
      setParticipants(response.data.participants || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const exportParticipants = () => {
    const selectedHackathonData = hackathons.find(h => h._id === selectedHackathon);
    if (!selectedHackathonData || !participants.length) return;

    const csvContent = [
      ['Name', 'Email', 'Registration Date'],
      ...participants.map(participant => [
        participant.name,
        participant.email,
        new Date(participant.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedHackathonData.title}_participants.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedHackathonData = hackathons.find(h => h._id === selectedHackathon);

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
            Participants Management
          </h1>
          <p className="text-xl text-muted-foreground">
            View and manage participants for your hackathons
          </p>
        </div>

        {hackathons.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Hackathons Found</h3>
              <p className="text-muted-foreground">
                Create a hackathon first to manage participants.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Hackathon Selection */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Select Hackathon</CardTitle>
                <CardDescription>
                  Choose a hackathon to view its participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedHackathon} onValueChange={setSelectedHackathon}>
                  <SelectTrigger className="w-full md:w-96">
                    <SelectValue placeholder="Select a hackathon" />
                  </SelectTrigger>
                  <SelectContent>
                    {hackathons.map((hackathon) => (
                      <SelectItem key={hackathon._id} value={hackathon._id}>
                        {hackathon.title} ({hackathon.participants?.length || 0} participants)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedHackathonData && (
              <>
                {/* Hackathon Info */}
                <Card className="mb-8">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{selectedHackathonData.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {selectedHackathonData.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {participants.length}/{selectedHackathonData.maxParticipants} registered
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Start Date</p>
                        <p className="text-muted-foreground">
                          {new Date(selectedHackathonData.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">{selectedHackathonData.location}</p>
                      </div>
                      <div>
                        <p className="font-medium">Registration Deadline</p>
                        <p className="text-muted-foreground">
                          {new Date(selectedHackathonData.registrationDeadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Participants Section */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Users className="w-5 h-5 mr-2" />
                          Participants ({participants.length})
                        </CardTitle>
                        <CardDescription>
                          Manage registered participants for this hackathon
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={exportParticipants}
                          disabled={participants.length === 0}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export CSV
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Search */}
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search participants..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Participants List */}
                    {filteredParticipants.length > 0 ? (
                      <div className="space-y-4">
                        {filteredParticipants.map((participant) => (
                          <div 
                            key={participant._id} 
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-medium">
                                  {participant.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{participant.name}</p>
                                <p className="text-sm text-muted-foreground">{participant.email}</p>
                                <p className="text-xs text-muted-foreground">
                                  Registered: {new Date(participant.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="capitalize">
                                {participant.role}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Mail className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          {searchTerm ? 'No Matching Participants' : 'No Participants Yet'}
                        </h3>
                        <p className="text-muted-foreground">
                          {searchTerm 
                            ? 'Try adjusting your search terms'
                            : 'Participants will appear here once they register for your hackathon'
                          }
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Participants;

