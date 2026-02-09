import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, History, Plus } from 'lucide-react';
import { Logo } from './Logo';
import './Layout.css';

export const Layout: React.FC = () => {
    return (
        <div className="app-layout">
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
                    <button className="add-quick-btn" onClick={() => window.dispatchEvent(new CustomEvent('open-add-modal'))}>
                        <Plus size={20} strokeWidth={3} />
                        <span>Add Item</span>
                    </button>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};
