import React, { useContext, useState, useEffect } from 'react'
import { Plus, Sun, Moon, CircleUserRound, Menu } from 'lucide-react'
import { AuthContext } from '../hooks/AuthContext'
import { CreateTicketModal } from './CreateTicketModal'

export const Header = ({ setIsMobileMenuOpen }) => {
    const { userProfile, userData } = useContext(AuthContext)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    const displayName = userProfile?.full_name || userData?.user_metadata?.full_name || 'User';

    return (
        <>
            <header className="topbar">
                <div className="topbar__left">
                    <button 
                        className="btn btn--ghost btn--icon-only mobile-menu-btn" 
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={20} />
                    </button>
                    <button
                        className="btn btn--primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus size={16} />
                        Create Ticket
                    </button>
                </div>

                <div className="topbar__actions">
                    <button className="btn btn--ghost btn--icon-only" onClick={toggleTheme} aria-label="Toggle theme">
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <div className="user-chip">
                        <CircleUserRound size={22} color="var(--primary-color, #dcc088)" />
                        <span className="user-chip__name">
                            {displayName}
                        </span>
                    </div>
                </div>
            </header>

            {isCreateModalOpen && (
                <CreateTicketModal onClose={() => setIsCreateModalOpen(false)} />
            )}
        </>
    )
}