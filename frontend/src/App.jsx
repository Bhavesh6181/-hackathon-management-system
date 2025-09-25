import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';

// Protected Pages
import Dashboard from './pages/Dashboard';

// Student Pages (will be created)
import HackathonListings from './pages/student/HackathonListings';
import MyHackathons from './pages/student/MyHackathons';

// Organizer Pages (will be created)
import CreateHackathon from './pages/organizer/CreateHackathon';
import ManageHackathons from './pages/organizer/ManageHackathons';
import Participants from './pages/organizer/Participants';

// Admin Pages (will be created)
import UserManagement from './pages/admin/UserManagement';
import HackathonModeration from './pages/admin/HackathonModeration';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/feedback" element={<Feedback />} />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Student Routes */}
              <Route 
                path="/hackathons" 
                element={
                  <ProtectedRoute>
                    <HackathonListings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/hackathons/:id" 
                element={
                  <ProtectedRoute>
                    <HackathonListings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-hackathons" 
                element={
                  <ProtectedRoute>
                    <MyHackathons />
                  </ProtectedRoute>
                } 
              />

              {/* Organizer Routes */}
              <Route 
                path="/create-hackathon" 
                element={
                  <ProtectedRoute requiredRole="organizer">
                    <CreateHackathon />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manage-hackathons" 
                element={
                  <ProtectedRoute requiredRole="organizer">
                    <ManageHackathons />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/participants" 
                element={
                  <ProtectedRoute requiredRole="organizer">
                    <Participants />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/hackathons" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <HackathonModeration />
                  </ProtectedRoute>
                } 
              />

              {/* Catch all route */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

