import React, { useState, useContext } from 'react';
import { LayoutDashboard, Users, ChevronLeft, ChevronRight, LogOut, Ticket, X, Tag } from 'lucide-react';
import { AuthContext } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { handleLogout, userProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = async () => {
        if (handleLogout) {
            await handleLogout();
            navigate('/login');
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            {/* Mobile overlay backdrop */}
            {isMobileMenuOpen && (
                <div 
                    className="sidebar-overlay" 
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : 'sidebar--expanded'} ${isMobileMenuOpen ? 'sidebar--mobile-open' : ''}`}>
                <div className="sidebar__logo">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="icon"><Ticket size={28} strokeWidth={2.5} /></span>
                        <span className="label">Tickora</span>
                    </div>
                    <button 
                        className="sidebar__close-mobile" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        title="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Desktop Toggle */}
                <button 
                    className="sidebar__toggle sidebar__toggle--desktop" 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
                </button>



                <nav className="sidebar__nav">
                    <button 
                        className={`sidebar__link ${activeTab === 'tickets' ? 'sidebar__link--active' : ''}`}
                        onClick={() => handleTabClick('tickets')}
                        title="Kanban Board"
                    >
                        <span className="icon"><LayoutDashboard size={20} /></span>
                        <span className="label">Tickets</span>
                    </button>
                    
                    {userProfile?.role === 'admin' && (
                        <>
                            <button 
                                className={`sidebar__link ${activeTab === 'users' ? 'sidebar__link--active' : ''}`}
                                onClick={() => handleTabClick('users')}
                                title="User Management"
                            >
                                <span className="icon"><Users size={20} /></span>
                                <span className="label">Users</span>
                            </button>

                            <button 
                                className={`sidebar__link ${activeTab === 'stories' ? 'sidebar__link--active' : ''}`}
                                onClick={() => handleTabClick('stories')}
                                title="Story Types"
                            >
                                <span className="icon"><Tag size={20} /></span>
                                <span className="label">Story Types</span>
                            </button>
                        </>
                    )}
                </nav>

                <div className="sidebar__logout">
                    <button className="sidebar__link" onClick={onLogout}>
                        <span className="icon"><LogOut size={20} /></span>
                        <span className="label">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
