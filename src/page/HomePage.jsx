import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, LayoutDashboard, Users, Tag, ArrowRight } from 'lucide-react';
import { AuthContext } from '../hooks/AuthContext';

export const HomePage = () => {
    const { userData, authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCtaClick = () => {
        if (userData) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    if (authLoading) return null;

    return (
        <div className="homepage">
            <nav className="homepage__nav">
                <div className="homepage__nav-logo">
                    <Ticket size={28} strokeWidth={2.5} />
                    <span>Tickora</span>
                </div>
                <div className="homepage__nav-actions">
                    <button className="btn btn--primary" onClick={handleCtaClick}>
                        {userData ? 'Dashboard' : 'Sign In'}
                    </button>
                </div>
            </nav>

            <main className="homepage__hero">
                <h1 className="homepage__hero-title">
                    Clarity in Chaos.<br />
                    <span>Precision in Process.</span>
                </h1>
                <p className="homepage__hero-subtitle">
                    A premium, minimalist ticket management system designed for teams that value focus, speed, and beautiful design.
                </p>
                <button 
                    className="btn btn--primary" 
                    style={{ fontSize: '16px', padding: '12px 32px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={handleCtaClick}
                >
                    {userData ? 'Enter Workspace' : 'Get Started'}
                    <ArrowRight size={18} />
                </button>
            </main>

            <section className="homepage__features">
                <div className="homepage__feature-card">
                    <div className="feature-icon-wrapper">
                        <LayoutDashboard size={24} />
                    </div>
                    <h3>Kanban Board</h3>
                    <p>Visualize your workflow effortlessly. Move tasks from To-Do to Done with a fluid, responsive interface.</p>
                </div>
                
                <div className="homepage__feature-card">
                    <div className="feature-icon-wrapper">
                        <Users size={24} />
                    </div>
                    <h3>Role-Based Access</h3>
                    <p>Secure and tailored access control. Assign users, manage teams, and restrict sensitive actions automatically.</p>
                </div>

                <div className="homepage__feature-card">
                    <div className="feature-icon-wrapper">
                        <Tag size={24} />
                    </div>
                    <h3>Custom Story Types</h3>
                    <p>Define your own taxonomy. Create custom tags and categories with beautiful colors to organize your tickets.</p>
                </div>
            </section>

            <footer className="homepage__footer">
                &copy; {new Date().getFullYear()} Tickora. All rights reserved.
            </footer>
        </div>
    );
};

export default HomePage;
