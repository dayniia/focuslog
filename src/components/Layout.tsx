import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, History, Plus, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../store/useStore';
import { SkillModal } from '../features/learning-list/SkillModal';
import './Layout.css';

export const Layout: React.FC = () => {
    const { setAddModalOpen } = useStore();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const location = useLocation();

    // Close menu when route changes
    React.useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);
    return (
        <div className={`app-layout ${isMenuOpen ? 'menu-open' : ''}`}>
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>
            <nav className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-wrapper">
                        <Logo size={36} />
                        <div className="logo-text">
                            <span className="logo-title">FocusLog</span>
                            <span className="logo-subtitle">Mastery starts here</span>
                        </div>
                    </div>
                </div>

                <div className="nav-links">
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/items" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <BookOpen size={20} />
                        <span>Library</span>
                    </NavLink>
                    <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <History size={20} />
                        <span>History</span>
                    </NavLink>
                </div>

                <div className="sidebar-footer">
                    <button className="add-quick-btn" onClick={() => setAddModalOpen(true)}>
                        <Plus size={20} strokeWidth={3} />
                        <span>Add Item</span>
                    </button>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>
            <SkillModal />
        </div>
    );
};
