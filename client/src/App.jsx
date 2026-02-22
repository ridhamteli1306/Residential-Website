import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import CommunityCenter from './pages/services/CommunityCenter'
import ResortPool from './pages/services/ResortPool'
import Landscaping from './pages/services/Landscaping'
import Security from './pages/services/Security'
import SportsFacilities from './pages/services/SportsFacilities'
import NatureTrails from './pages/services/NatureTrails'
import Booking from './pages/Booking';

import Layout from './components/Layout';

import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="services" element={<Services />} />
                        <Route path="services/community-center" element={<CommunityCenter />} />
                        <Route path="services/resort-pool" element={<ResortPool />} />
                        <Route path="services/landscaping" element={<Landscaping />} />
                        <Route path="services/security" element={<Security />} />
                        <Route path="services/sports-facilities" element={<SportsFacilities />} />
                        <Route path="services/nature-trails" element={<NatureTrails />} />
                        <Route path="blog" element={<Blog />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="booking" element={<Booking />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                        <Route path="dashboard" element={<Dashboard />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
