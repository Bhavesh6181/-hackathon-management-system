import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { hackathonsAPI } from '../../lib/api';
import { Plus, Calendar, MapPin, Users, Trophy } from 'lucide-react';

const CreateHackathon = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    location: '',
    maxParticipants: 100,
    teamSize: { min: 3, max: 4 },
    contactEmail: '',
    website: '',
    requirements: '',
    tags: '',
    prizes: [{ position: '1st Place', amount: '', description: '' }]
  });

  const indianCities = [
    'Mumbai, Maharashtra',
    'Delhi, Delhi',
    'Bangalore, Karnataka',
    'Hyderabad, Telangana',
    'Chennai, Tamil Nadu',
    'Kolkata, West Bengal',
    'Pune, Maharashtra',
    'Ahmedabad, Gujarat',
    'Jaipur, Rajasthan',
    'Lucknow, Uttar Pradesh',
    'Kanpur, Uttar Pradesh',
    'Nagpur, Maharashtra',
    'Indore, Madhya Pradesh',
    'Thane, Maharashtra',
    'Bhopal, Madhya Pradesh',
    'Visakhapatnam, Andhra Pradesh',
    'Pimpri-Chinchwad, Maharashtra',
    'Patna, Bihar',
    'Vadodara, Gujarat',
    'Ghaziabad, Uttar Pradesh',
    'Ludhiana, Punjab',
    'Agra, Uttar Pradesh',
    'Nashik, Maharashtra',
    'Faridabad, Haryana',
    'Meerut, Uttar Pradesh',
    'Rajkot, Gujarat',
    'Kalyan-Dombivali, Maharashtra',
    'Vasai-Virar, Maharashtra',
    'Varanasi, Uttar Pradesh',
    'Srinagar, Jammu and Kashmir',
    'Aurangabad, Maharashtra',
    'Navi Mumbai, Maharashtra',
    'Solapur, Maharashtra',
    'Vijayawada, Andhra Pradesh',
    'Kolhapur, Maharashtra',
    'Amritsar, Punjab',
    'Noida, Uttar Pradesh',
    'Ranchi, Jharkhand',
    'Howrah, West Bengal',
    'Coimbatore, Tamil Nadu',
    'Raipur, Chhattisgarh',
    'Kota, Rajasthan',
    'Jabalpur, Madhya Pradesh',
    'Gwalior, Madhya Pradesh',
    'Chandigarh, Chandigarh',
    'Tiruchirappalli, Tamil Nadu',
    'Mysore, Karnataka',
    'Bhubaneswar, Odisha',
    'Kochi, Kerala',
    'Bhavnagar, Gujarat',
    'Salem, Tamil Nadu',
    'Warangal, Telangana',
    'Guntur, Andhra Pradesh',
    'Bhiwandi, Maharashtra',
    'Amravati, Maharashtra',
    'Nanded, Maharashtra',
    'Kolhapur, Maharashtra',
    'Sangli, Maharashtra',
    'Malegaon, Maharashtra',
    'Ulhasnagar, Maharashtra',
    'Jalgaon, Maharashtra',
    'Latur, Maharashtra',
    'Ahmadnagar, Maharashtra',
    'Dhule, Maharashtra',
    'Ichalkaranji, Maharashtra',
    'Parbhani, Maharashtra',
    'Jalna, Maharashtra',
    'Bhusawal, Maharashtra',
    'Panvel, Maharashtra',
    'Satara, Maharashtra',
    'Beed, Maharashtra',
    'Yavatmal, Maharashtra',
    'Kamptee, Maharashtra',
    'Gondia, Maharashtra',
    'Barshi, Maharashtra',
    'Achalpur, Maharashtra',
    'Osmanabad, Maharashtra',
    'Nandurbar, Maharashtra',
    'Wardha, Maharashtra',
    'Udgir, Maharashtra',
    'Aurangabad, Maharashtra',
    'Amalner, Maharashtra',
    'Akot, Maharashtra',
    'Pandharpur, Maharashtra',
    'Shirpur, Maharashtra',
    'Paratwada, Maharashtra',
    'Virtual/Online'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamSizeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      teamSize: {
        ...prev.teamSize,
        [field]: parseInt(value)
      }
    }));
  };

  const handlePrizeChange = (index, field, value) => {
    const newPrizes = [...formData.prizes];
    newPrizes[index][field] = value;
    setFormData(prev => ({
      ...prev,
      prizes: newPrizes
    }));
  };

  const addPrize = () => {
    setFormData(prev => ({
      ...prev,
      prizes: [...prev.prizes, { position: '', amount: '', description: '' }]
    }));
  };

  const removePrize = (index) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        prizes: formData.prizes.filter(prize => prize.position && prize.amount)
      };

      const response = await hackathonsAPI.create(submitData);
      navigate('/manage-hackathons');
    } catch (error) {
      console.error('Error creating hackathon:', error);
      alert(error.response?.data?.message || 'Failed to create hackathon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Create New Hackathon
          </h1>
          <p className="text-xl text-muted-foreground">
            Organize an amazing hackathon and bring innovators together
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Provide the essential details about your hackathon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Hackathon Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter an exciting title for your hackathon"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your hackathon, its goals, and what participants can expect..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants *</Label>
                    <Input
                      id="maxParticipants"
                      name="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Team Size Configuration */}
                <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Team Configuration</h4>
                  <p className="text-sm text-blue-700">
                    Configure the team size requirements for this hackathon. Teams must have between the minimum and maximum number of members.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="teamSizeMin">Minimum Team Size *</Label>
                      <Select
                        value={formData.teamSize.min.toString()}
                        onValueChange={(value) => handleTeamSizeChange('min', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 members</SelectItem>
                          <SelectItem value="3">3 members</SelectItem>
                          <SelectItem value="4">4 members</SelectItem>
                          <SelectItem value="5">5 members</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teamSizeMax">Maximum Team Size *</Label>
                      <Select
                        value={formData.teamSize.max.toString()}
                        onValueChange={(value) => handleTeamSizeChange('max', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 members</SelectItem>
                          <SelectItem value="4">4 members</SelectItem>
                          <SelectItem value="5">5 members</SelectItem>
                          <SelectItem value="6">6 members</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {formData.teamSize.min > formData.teamSize.max && (
                    <p className="text-sm text-red-600">
                      Maximum team size must be greater than or equal to minimum team size.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="contact@yourhackathon.in"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      For participant inquiries
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourhackathon.in"
                    />
                    <p className="text-sm text-muted-foreground">
                      Official hackathon website
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dates and Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Dates and Timeline
                </CardTitle>
                <CardDescription>
                  Set the important dates for your hackathon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
                    <Input
                      id="registrationDeadline"
                      name="registrationDeadline"
                      type="datetime-local"
                      value={formData.registrationDeadline}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prizes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Prizes
                </CardTitle>
                <CardDescription>
                  Add prizes to motivate participants (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.prizes.map((prize, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input
                        value={prize.position}
                        onChange={(e) => handlePrizeChange(index, 'position', e.target.value)}
                        placeholder="e.g., 1st Place"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        value={prize.amount}
                        onChange={(e) => handlePrizeChange(index, 'amount', e.target.value)}
                        placeholder="e.g., ₹50,000 or Laptop"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={prize.description}
                        onChange={(e) => handlePrizeChange(index, 'description', e.target.value)}
                        placeholder="e.g., Cash prize"
                      />
                    </div>
                    <div className="flex items-end">
                      {formData.prizes.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removePrize(index)}
                          className="w-full"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addPrize}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Prize
                </Button>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
                <CardDescription>
                  Provide more information about your hackathon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="Any specific requirements, skills, or prerequisites for participants..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., AI, Web Development, Mobile, Blockchain (comma-separated)"
                  />
                  <p className="text-sm text-muted-foreground">
                    Separate tags with commas to help participants find your hackathon
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/manage-hackathons')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Hackathon'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHackathon;

