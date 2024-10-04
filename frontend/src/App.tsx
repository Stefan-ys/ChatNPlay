import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import UsersPage from './pages/Users';
import ProfilePage from './pages/MyProfile';
import Home from './pages/Home';
import Navbar from './components/Navbar';


import './App.css';
import { AuthProvider } from './context/AuthProvider';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
      <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
