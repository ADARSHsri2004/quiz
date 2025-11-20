import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { 
  HiOutlineHome, 
  HiOutlineClipboardList, 
  HiOutlineChartBar, 
  HiUserCircle,
  HiLogout
} from 'react-icons/hi';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const facultyNavItems = [
    { name: 'Dashboard', path: '/faculty', icon: <HiOutlineHome /> },
    { name: 'Create Quiz', path: '/faculty/quizzes/create', icon: <HiOutlineClipboardList /> },
    { name: 'Profile', path: '/profile', icon: <HiUserCircle /> },
  ];

  const studentNavItems = [
    { name: 'Dashboard', path: '/student', icon: <HiOutlineHome /> },
    { name: 'My Results', path: '/student/results', icon: <HiOutlineChartBar /> },
    { name: 'Profile', path: '/profile', icon: <HiUserCircle /> },
  ];

  const navItems = user?.role === 'faculty' ? facultyNavItems : studentNavItems;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={`
        bg-white border-r w-64 h-[calc(100vh-4rem)] 
        fixed md:static top-16 left-0 
        transition-transform z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      <div className="p-6 flex items-center gap-2 text-indigo-600 text-2xl font-bold tracking-wide">
        <svg width="32" height="32" className="mr-1">
          <circle cx="16" cy="16" r="16" fill="#6366f1" />
        </svg>
        QuizPro
      </div>

      <nav className="mt-6 flex flex-col gap-1">
        {navItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 py-2 px-6 rounded-l-full transition-colors
              ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 py-2 px-6 rounded-l-full transition-colors text-gray-700 hover:bg-red-50 hover:text-red-600"
        >
          <span className="text-xl"><HiLogout /></span>
          Logout
        </button>
      </nav>
    </aside>
  );
}
