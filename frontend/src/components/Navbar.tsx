import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => (
    <Menu>
        <Menu.Item name="home">
            <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item name="login">
            <Link to="/login">Login</Link>
        </Menu.Item>
        <Menu.Item name="register">
            <Link to="/register">Register</Link>
        </Menu.Item>
        <Menu.Item name="profile">
            <Link to="/profile">Profile</Link>
        </Menu.Item>
    </Menu>
);

export default Navbar;
