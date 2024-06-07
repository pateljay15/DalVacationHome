import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function NavBar() {
    const auth = localStorage.getItem('authToken'); // Example of fetching an auth token
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Example of removing an auth token
        navigate('/signup');
    };

    return (
        <nav className="bg-gray-800 flex justify-between items-center p-5">
            <div className="navbar-brand">
                <a href="/" className="text-white text-2xl font-bold no-underline">bookRoom!</a>
            </div>
            <div className="navbar-links flex justify-center flex-grow">
                {auth == null ? (
                    <>
                        <NavLink className={({ isActive }) => isActive ? "text-white text-lg font-bold no-underline mx-3 border-b-2 border-yellow-400" : "text-white text-lg font-bold no-underline mx-3"} to="/signup">
                            Signup
                        </NavLink>
                        <NavLink className={({ isActive }) => isActive ? "text-white text-lg font-bold no-underline mx-3 border-b-2 border-yellow-400" : "text-white text-lg font-bold no-underline mx-3"} to="/user/login">
                            Login
                        </NavLink>
                    </>
                ) : (
                    <span className="text-white text-lg font-bold no-underline mx-3 hover:text-yellow-400 cursor-pointer" onClick={handleLogout}>
                        Logout
                    </span>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
