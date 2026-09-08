import React, { useState, useContext } from 'react';
import { LayoutDashboard, Users, ChevronLeft, ChevronRight, LogOut, Ticket } from 'lucide-react';
import { AuthContext } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ activeTab, setActiveTab }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { handleLogout, userProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = async () => {
        if (handleLogout) {
            await handleLogout();
            navigate('/login');
        }
    };

    return (
        <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : 'sidebar--expanded'}`}>
            <div className="sidebar__logo">
                <span className="icon"><Ticket size={28} strokeWidth={2.5} /></span>
                <span className="label">Tickora</span>
            </div>

            <button 
                className="sidebar__toggle" 
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
            </button>

            <nav className="sidebar__nav">
                <button 
                    className={`sidebar__link ${activeTab === 'tickets' ? 'sidebar__link--active' : ''}`}
                    onClick={() => setActiveTab('tickets')}
                >
                    <span className="icon"><LayoutDashboard size={20} /></span>
                    <span className="label">Tickets</span>
                </button>

                {userProfile?.role === 'admin' && (
                    <button 
                        className={`sidebar__link ${activeTab === 'users' ? 'sidebar__link--active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <span className="icon"><Users size={20} /></span>
                        <span className="label">Users</span>
                    </button>
                )}
            </nav>

            <div className="sidebar__logout">
                <button className="sidebar__link" onClick={onLogout}>
                    <span className="icon"><LogOut size={20} /></span>
                    <span className="label">Logout</span>
                </button>
            </div>
        </aside>
    );
};
