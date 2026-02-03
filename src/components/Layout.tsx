import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, History, PlusCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { LearningItemModal } from '../features/learning-list/LearningItemModal';
import './Layout.css';

export const Layout: React.FC = () => {
    const { isAddModalOpen, setAddModalOpen } = useStore();

    return (
        <div className="app-layout">
            <nav className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">F</div>
                        <span>FocusLog</span>
                    </div>
                </div>

                <div className="nav-links">
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/items" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <BookOpen size={20} />
                        <span>Learning List</span>
                    </NavLink>
                    <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <History size={20} />
                        <span>Activity Log</span>
                    </NavLink>
                </div>

                <div className="sidebar-footer">
                    <button className="add-quick-btn" onClick={() => setAddModalOpen(true)}>
                        <PlusCircle size={20} />
                        <span>New Skill</span>
                    </button>
                </div>
            </nav>

            <main className="main-content">
                <div className="container">
                    <Outlet />
                </div>
            </main>

            <LearningItemModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
            />
        </div>
    );
};

