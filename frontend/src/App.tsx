import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/MyProfilePage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import './App.css';
import { AuthProvider, AuthContext } from './context/AuthProvider';
import { themeOptions } from './themes/themeOptions';
import LobbyPage from './pages/LobbyPage';

const theme = createTheme(themeOptions);

const PrivateRoute = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    return <Navigate to="/login" />;
  }
  const { user } = authContext;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

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
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/lobby" element={<LobbyPage lobbyName={'Quiz Maze Lobby'} />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
