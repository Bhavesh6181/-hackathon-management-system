import { useState } from 'react';
import { X, Plus, User, Code } from 'lucide-react';
import { hackathonsAPI } from '../lib/api';

// Simple Modal Components
const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const DialogHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left mb-4 ${className}`}>
    {children}
  </div>
);

const DialogTitle = ({ children, className = "" }) => (
  <h2 className={`text-2xl font-bold ${className}`}>
    {children}
  </h2>
);

const DialogDescription = ({ children, className = "" }) => (
  <p className={`text-gray-600 text-sm ${className}`}>
    {children}
  </p>
);

// Simple UI Components
const Button = ({ children, onClick, disabled = false, className = "", type = "button", ...props }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label = ({ children, className = "", ...props }) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  >
    {children}
  </label>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-200 text-gray-800"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const TeamRegistrationModal = ({ 
  isOpen, 
  onClose, 
  hackathon, 
  onSuccess 
}) => {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([
    {
      name: '',
      email: '',
      phone: '',
      college: '',
      year: '',
      skills: []
    }
  ]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const indianColleges = [
    'Indian Institute of Technology (IIT)',
    'National Institute of Technology (NIT)',
    'Indian Institute of Science (IISc)',
    'Delhi Technological University (DTU)',
    'Netaji Subhas University of Technology (NSUT)',
    'Jamia Millia Islamia',
    'University of Delhi',
    'University of Mumbai',
    'Anna University',
    'VIT University',
    'SRM University',
    'Amity University',
    'Manipal Institute of Technology',
    'BITS Pilani',
    'IIIT Hyderabad',
    'IIIT Bangalore',
    'IIIT Delhi',
    'Other'
  ];

  const skillOptions = [
    'React', 'Node.js', 'Python', 'JavaScript', 'Java', 'C++', 'C#', 'Go',
    'Machine Learning', 'AI', 'Data Science', 'Web Development', 'Mobile Development',
    'UI/UX Design', 'DevOps', 'Cloud Computing', 'Blockchain', 'Cybersecurity',
    'Game Development', 'AR/VR', 'IoT', 'Full Stack', 'Frontend', 'Backend'
  ];

  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate', 'Post Graduate'];

  const validateForm = () => {
    const newErrors = {};

    if (!teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    }

    if (members.length < hackathon.teamSize.min || members.length > hackathon.teamSize.max) {
      newErrors.teamSize = `Team must have between ${hackathon.teamSize.min} and ${hackathon.teamSize.max} members`;
    }

    members.forEach((member, index) => {
      if (!member.name.trim()) {
        newErrors[`member_${index}_name`] = 'Name is required';
      }
      if (!member.email.trim()) {
        newErrors[`member_${index}_email`] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
        newErrors[`member_${index}_email`] = 'Invalid email format';
      }
      if (!member.phone.trim()) {
        newErrors[`member_${index}_phone`] = 'Phone number is required';
      } else if (!/^[6-9]\d{9}$/.test(member.phone)) {
        newErrors[`member_${index}_phone`] = 'Invalid Indian phone number';
      }
      if (!member.college.trim()) {
        newErrors[`member_${index}_college`] = 'College is required';
      }
      if (!member.year) {
        newErrors[`member_${index}_year`] = 'Year is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addMember = () => {
    if (members.length < hackathon.teamSize.max) {
      setMembers([...members, {
        name: '',
        email: '',
        phone: '',
        college: '',
        year: '',
        skills: []
      }]);
    }
  };

  const removeMember = (index) => {
    if (members.length > hackathon.teamSize.min) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const addSkill = (memberIndex) => {
    if (currentSkill.trim() && !members[memberIndex].skills.includes(currentSkill.trim())) {
      updateMember(memberIndex, 'skills', [...members[memberIndex].skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (memberIndex, skillIndex) => {
    const updatedSkills = members[memberIndex].skills.filter((_, i) => i !== skillIndex);
    updateMember(memberIndex, 'skills', updatedSkills);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const teamData = {
        teamName: teamName.trim(),
        members: members.map(member => ({
          user: member.user || null,
          name: member.name.trim(),
          email: member.email.trim(),
          phone: member.phone.trim(),
          college: member.college.trim(),
          year: member.year,
          skills: member.skills
        }))
      };

      await hackathonsAPI.registerTeam(hackathon._id, teamData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error registering team:', error);
      alert(error.response?.data?.message || 'Failed to register team');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTeamName('');
    setMembers([{
      name: '',
      email: '',
      phone: '',
      college: '',
      year: '',
      skills: []
    }]);
    setCurrentSkill('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Register Team for {hackathon?.title}</DialogTitle>
          <DialogDescription>
            Create a team of {hackathon?.teamSize.min}-{hackathon?.teamSize.max} members to participate in this hackathon.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name *</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
              className={errors.teamName ? 'border-red-500' : ''}
            />
            {errors.teamName && (
              <p className="text-sm text-red-500">{errors.teamName}</p>
            )}
          </div>

          {/* Team Size Error */}
          {errors.teamSize && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.teamSize}</p>
            </div>
          )}

          {/* Team Members */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {members.length} / {hackathon?.teamSize.max} members
                </Badge>
                {members.length < hackathon?.teamSize.max && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addMember}
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Member
                  </Button>
                )}
              </div>
            </div>

            {members.map((member, index) => (
              <Card key={index} className="p-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Member {index + 1} {index === 0 && <Badge variant="secondary">Team Leader</Badge>}
                    </CardTitle>
                    {members.length > hackathon?.teamSize.min && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeMember(index)}
                        className="text-red-500 hover:text-red-700 bg-white border-red-300 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`member_${index}_name`}>Full Name *</Label>
                      <Input
                        id={`member_${index}_name`}
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                        placeholder="Enter full name"
                        className={errors[`member_${index}_name`] ? 'border-red-500' : ''}
                      />
                      {errors[`member_${index}_name`] && (
                        <p className="text-sm text-red-500">{errors[`member_${index}_name`]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`member_${index}_email`}>Email *</Label>
                      <Input
                        id={`member_${index}_email`}
                        type="email"
                        value={member.email}
                        onChange={(e) => updateMember(index, 'email', e.target.value)}
                        placeholder="Enter email address"
                        className={errors[`member_${index}_email`] ? 'border-red-500' : ''}
                      />
                      {errors[`member_${index}_email`] && (
                        <p className="text-sm text-red-500">{errors[`member_${index}_email`]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`member_${index}_phone`}>Phone Number *</Label>
                      <Input
                        id={`member_${index}_phone`}
                        value={member.phone}
                        onChange={(e) => updateMember(index, 'phone', e.target.value)}
                        placeholder="Enter 10-digit phone number"
                        className={errors[`member_${index}_phone`] ? 'border-red-500' : ''}
                      />
                      {errors[`member_${index}_phone`] && (
                        <p className="text-sm text-red-500">{errors[`member_${index}_phone`]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`member_${index}_college`}>College/University *</Label>
                      <select
                        value={member.college}
                        onChange={(e) => updateMember(index, 'college', e.target.value)}
                        className={`flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 ${errors[`member_${index}_college`] ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select college</option>
                        {indianColleges.map((college) => (
                          <option key={college} value={college}>
                            {college}
                          </option>
                        ))}
                      </select>
                      {errors[`member_${index}_college`] && (
                        <p className="text-sm text-red-500">{errors[`member_${index}_college`]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`member_${index}_year`}>Academic Year *</Label>
                      <select
                        value={member.year}
                        onChange={(e) => updateMember(index, 'year', e.target.value)}
                        className={`flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 ${errors[`member_${index}_year`] ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select year</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      {errors[`member_${index}_year`] && (
                        <p className="text-sm text-red-500">{errors[`member_${index}_year`]}</p>
                      )}
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-2">
                    <Label>Skills & Technologies</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        placeholder="Add a skill"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill(index);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => addSkill(index)}
                        disabled={!currentSkill.trim()}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {member.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {member.skills.map((skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Code className="w-3 h-3" />
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(index, skillIndex)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px] bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registering...
                </>
              ) : (
                'Register Team'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamRegistrationModal;