import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/MyProfilePage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import './App.css';
import { AuthProvider } from './context/AuthProvider';
import { themeOptions } from './themes/themeOptions';
import LobbyPage from './pages/LobbyPage';

const theme = createTheme(themeOptions);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/lobby" element={<LobbyPage lobbyId={1}/>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
