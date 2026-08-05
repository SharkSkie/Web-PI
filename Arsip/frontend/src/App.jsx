import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Upload from './pages/Upload';
import Assessment from './pages/Assessment';
import Result from './pages/Result';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected User Routes */}
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
            <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
