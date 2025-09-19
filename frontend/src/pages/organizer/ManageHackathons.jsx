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
  Plus, 
  Edit,
  Trash2,
  Eye,
  Settings
} from 'lucide-react';

const ManageHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchMyHackathons();
  }, []);

  const fetchMyHackathons = async () => {
    try {
      const response = await hackathonsAPI.getMyHackathons();
      setHackathons(response.data);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hackathonId) => {
    if (!confirm('Are you sure you want to delete this hackathon? This action cannot be undone.')) {
      return;
    }

    setDeleting(hackathonId);
    try {
      await hackathonsAPI.delete(hackathonId);
      fetchMyHackathons();
    } catch (error) {
      console.error('Error deleting hackathon:', error);
      alert(error.response?.data?.message || 'Failed to delete hackathon');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusColor = (hackathon) => {
    if (!hackathon.isApproved) return 'yellow';
    
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);

    if (now < startDate) return 'blue';
    if (now >= startDate && now <= endDate) return 'green';
    return 'gray';
  };

  const getStatusText = (hackathon) => {
    if (!hackathon.isApproved) return 'Pending Approval';
    
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Manage Hackathons
            </h1>
            <p className="text-xl text-muted-foreground">
              Organize and manage your hackathon events
            </p>
          </div>
          <Button asChild>
            <Link to="/create-hackathon">
              <Plus className="w-4 h-4 mr-2" />
              Create Hackathon
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hackathons</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hackathons.length}</div>
              <p className="text-xs text-muted-foreground">events created</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hackathons.filter(h => {
                  const now = new Date();
                  return new Date(h.startDate) <= now && new Date(h.endDate) >= now;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">currently running</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hackathons.reduce((total, h) => total + (h.participants?.length || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">across all events</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hackathons.filter(h => !h.isApproved).length}
              </div>
              <p className="text-xs text-muted-foreground">awaiting review</p>
            </CardContent>
          </Card>
        </div>

        {/* Hackathons List */}
        {hackathons.length > 0 ? (
          <div className="space-y-6">
            {hackathons.map((hackathon) => (
              <Card key={hackathon._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{hackathon.title}</CardTitle>
                      <CardDescription className="text-base">
                        {hackathon.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={getStatusColor(hackathon) === 'green' ? 'default' : 'secondary'}
                      className={
                        getStatusColor(hackathon) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
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
                      <Calendar className="w-4 h-4 text-primary" />
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
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline">
                      <Link to={`/participants?hackathon=${hackathon._id}`}>
                        <Users className="w-4 h-4 mr-2" />
                        View Participants
                      </Link>
                    </Button>
                    
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    
                    <Button 
                      variant="destructive"
                      onClick={() => handleDelete(hackathon._id)}
                      disabled={deleting === hackathon._id}
                    >
                      {deleting === hackathon._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </>
                      )}
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
              <h3 className="text-lg font-semibold mb-2">No Hackathons Created</h3>
              <p className="text-muted-foreground mb-6">
                Start organizing your first hackathon and build an amazing community of innovators!
              </p>
              <Button asChild>
                <Link to="/create-hackathon">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Hackathon
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ManageHackathons;

