import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!token || !userParam) {
          setStatus('error');
          setMessage('Invalid authentication response. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        try {
          const userData = JSON.parse(decodeURIComponent(userParam));
          login(token, userData);
          setStatus('success');
          setMessage('Login successful! Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 2000);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          setStatus('error');
          setMessage('Error processing user data. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    handleCallback();
  }, [searchParams, login, navigate, isAuthenticated]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-8 h-8 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Loader2 className="w-8 h-8 animate-spin text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className={`text-xl ${getStatusColor()}`}>
            {status === 'processing' && 'Processing Authentication'}
            {status === 'success' && 'Login Successful'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
          <CardDescription className="mt-2">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'processing' && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-sm text-gray-500">Please wait while we complete your login...</p>
            </div>
          )}
          {status === 'success' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">You will be redirected to your dashboard shortly.</p>
            </div>
          )}
          {status === 'error' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">You will be redirected to the login page shortly.</p>
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 text-sm underline"
              >
                Go to Login
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;