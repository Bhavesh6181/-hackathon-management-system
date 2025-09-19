import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../lib/api';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff,
  Loader2,
  Chrome,
  TestTube,
  Phone
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  
  // State for different login methods
  const [activeTab, setActiveTab] = useState('google');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    mobile: '',
    confirmPassword: '',
    role: 'student'
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    // Handle OAuth callback
    const token = searchParams.get('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        login(token, payload);
        navigate('/dashboard');
      } catch (error) {
        console.error('Token parsing error:', error);
      }
    }

    // Handle OAuth errors
    const error = searchParams.get('error');
    if (error === 'google_oauth_not_configured') {
      setErrors({
        general: 'Google OAuth is not configured. Please use email login or demo login instead.'
      });
    } else if (error === 'oauth_failed') {
      setErrors({
        general: 'Google authentication failed. Please try again or use email login.'
      });
    }
  }, [searchParams, login, navigate, isAuthenticated]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate Indian mobile number format
  const validateMobile = (mobile) => {
    const mobileRegex = /^(\+91|91)?[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    if (isRegistering) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.mobile) {
        newErrors.mobile = 'Mobile number is required';
      } else if (!validateMobile(formData.mobile)) {
        newErrors.mobile = 'Please enter a valid Indian mobile number';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Google OAuth login
  const handleGoogleLogin = () => {
    setLoading(true);
    // Clear any existing errors
    setErrors({});
    authAPI.googleLogin();
  };

  // Handle manual login/register
  const handleManualAuth = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      let response;
      
      if (isRegistering) {
        response = await authAPI.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
          role: formData.role
        });
      } else {
        response = await authAPI.login({
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
      }
      
      if (response.data.token) {
        login(response.data.token, response.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({
        general: error.response?.data?.message || 'Authentication failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle demo login
  const handleDemoLogin = async (selectedRole = 'student') => {
    setLoading(true);
    try {
      const response = await authAPI.dummyLogin({
        email: `demo-${selectedRole}@hackhub.com`,
        name: `Demo ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`,
        role: selectedRole
      });
      if (response.data.token) {
        login(response.data.token, response.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      setErrors({
        general: error.response?.data?.message || 'Demo login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-pink-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card with Glassmorphism */}
      <Card className="w-full max-w-md relative backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/20 shadow-2xl shadow-black/10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">H</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to HackHub
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
              Sign in to access your hackathon dashboard and start building amazing projects.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <TabsTrigger value="google" className="text-xs">Google</TabsTrigger>
              <TabsTrigger value="manual" className="text-xs">Email</TabsTrigger>
              <TabsTrigger value="demo" className="text-xs">Demo</TabsTrigger>
            </TabsList>

            {/* Google OAuth Tab */}
            <TabsContent value="google" className="space-y-4">
              <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Chrome className="w-5 h-5 mr-2 text-blue-500 group-hover:scale-110 transition-transform" />
                )}
                Continue with Google
              </Button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Secure authentication with your Google account
              </p>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> Google OAuth requires proper configuration. If it doesn't work, use the Email or Demo login options below.
                </p>
              </div>
            </TabsContent>

            {/* Manual Login/Register Tab */}
            <TabsContent value="manual" className="space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Button
                  variant={!isRegistering ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsRegistering(false)}
                  className="transition-all duration-200"
                >
                  Sign In
                </Button>
                <Button
                  variant={isRegistering ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsRegistering(true)}
                  className="transition-all duration-200"
                >
                  Sign Up
                </Button>
              </div>

              <form onSubmit={handleManualAuth} className="space-y-4">
                {isRegistering && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10 h-11 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-sm font-medium">Mobile Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className="pl-10 h-11 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}
                    </div>
                  </>
                )}

                {/* Role Selection - Show for both login and registration */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">I am a</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'student', label: 'Student', icon: '🎓' },
                      { value: 'organizer', label: 'Organizer', icon: '🏗️' },
                      { value: 'admin', label: 'Admin', icon: '⚙️' }
                    ].map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                          formData.role === role.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="text-lg mb-1">{role.icon}</div>
                        <div className="text-xs font-medium">{role.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-11 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 h-11 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </div>

                {isRegistering && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 h-11 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                  </div>
                )}

                {errors.general && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : null}
                  {isRegistering ? 'Create Account' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            {/* Demo Login Tab */}
            <TabsContent value="demo" className="space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TestTube className="w-5 h-5 text-amber-600" />
                  <h3 className="font-medium text-amber-800 dark:text-amber-200">Demo Access</h3>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Experience the platform with pre-configured demo credentials. Choose your role to test different user experiences.
                </p>
              </div>

              {/* Role Selection for Demo */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Choose Demo Role</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'student', label: 'Student', icon: '🎓', desc: 'Browse hackathons' },
                    { value: 'organizer', label: 'Organizer', icon: '🏗️', desc: 'Create events' },
                    { value: 'admin', label: 'Admin', icon: '⚙️', desc: 'Manage system' }
                  ].map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                        formData.role === role.value
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                          : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-1">{role.icon}</div>
                      <div className="text-xs font-medium">{role.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{role.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => handleDemoLogin(formData.role)}
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <TestTube className="w-5 h-5 mr-2" />
                )}
                Login as Demo {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
              </Button>

              {errors.general && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By signing in, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;

