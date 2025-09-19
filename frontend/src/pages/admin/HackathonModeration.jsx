import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { hackathonsAPI } from '../../lib/api';
import { 
  Calendar, 
  Search, 
  Filter,
  Eye,
  Check,
  X,
  MapPin,
  Users,
  Clock,
  Shield
} from 'lucide-react';

const HackathonModeration = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [moderating, setModerating] = useState(null);

  useEffect(() => {
    fetchAllHackathons();
  }, []);

  const fetchAllHackathons = async () => {
    try {
        // Fetch all hackathons including unapproved
        const response = await hackathonsAPI.getAll({ limit: 100, all: true });
        setHackathons(response.data.hackathons);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (hackathonId) => {
    setModerating(hackathonId);
    try {
      await hackathonsAPI.approve(hackathonId);
      fetchAllHackathons();
    } catch (error) {
      console.error('Error approving hackathon:', error);
      alert(error.response?.data?.message || 'Failed to approve hackathon');
    } finally {
      setModerating(null);
    }
  };

  const handleReject = async (hackathonId) => {
    if (!confirm('Are you sure you want to reject this hackathon?')) {
      return;
    }

    setModerating(hackathonId);
    try {
      await hackathonsAPI.delete(hackathonId);
      fetchAllHackathons();
    } catch (error) {
      console.error('Error rejecting hackathon:', error);
      alert(error.response?.data?.message || 'Failed to reject hackathon');
    } finally {
      setModerating(null);
    }
  };

  const filteredHackathons = hackathons.filter(hackathon => {
    const matchesSearch = hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hackathon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || hackathon.status === statusFilter;
    const matchesApproval = approvalFilter === 'all' || 
                           (approvalFilter === 'approved' && hackathon.isApproved) ||
                           (approvalFilter === 'pending' && !hackathon.isApproved);
    return matchesSearch && matchesStatus && matchesApproval;
  });

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
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Hackathon Moderation
          </h1>
          <p className="text-xl text-muted-foreground">
            Review and moderate hackathon submissions
          </p>
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
              <p className="text-xs text-muted-foreground">all submissions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hackathons.filter(h => !h.isApproved).length}
              </div>
              <p className="text-xs text-muted-foreground">awaiting review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hackathons.filter(h => h.isApproved).length}
              </div>
              <p className="text-xs text-muted-foreground">live events</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hackathons.filter(h => {
                  const now = new Date();
                  return h.isApproved && new Date(h.startDate) <= now && new Date(h.endDate) >= now;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">currently running</p>
            </CardContent>
          </Card>
        </div>

        {/* Hackathons Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              All Hackathons
            </CardTitle>
            <CardDescription>
              Review, approve, or reject hackathon submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search hackathons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by approval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hackathons List */}
            {filteredHackathons.length > 0 ? (
              <div className="space-y-6">
                {filteredHackathons.map((hackathon) => (
                  <Card key={hackathon._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{hackathon.title}</CardTitle>
                          <CardDescription className="text-base">
                            Organized by {hackathon.organizer?.name} ({hackathon.organizer?.email})
                          </CardDescription>
                        </div>
                        <Badge 
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
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        
                        {!hackathon.isApproved && (
                          <>
                            <Button 
                              onClick={() => handleApprove(hackathon._id)}
                              disabled={moderating === hackathon._id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {moderating === hackathon._id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Approving...
                                </>
                              ) : (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Approve
                                </>
                              )}
                            </Button>
                            
                            <Button 
                              variant="destructive"
                              onClick={() => handleReject(hackathon._id)}
                              disabled={moderating === hackathon._id}
                            >
                              {moderating === hackathon._id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Rejecting...
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4 mr-2" />
                                  Reject
                                </>
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || statusFilter !== 'all' || approvalFilter !== 'all' 
                    ? 'No Matching Hackathons' 
                    : 'No Hackathons Found'
                  }
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || approvalFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Hackathons will appear here once organizers submit them for review'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HackathonModeration;

