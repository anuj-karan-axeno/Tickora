import React, { useContext, useState } from 'react'
import { Plus, Sun, CircleUserRound } from 'lucide-react'
import { AuthContext } from '../hooks/AuthContext'
import { CreateTicketModal } from './CreateTicketModal'

export const Header = () => {
    const { userData } = useContext(AuthContext)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    return (
        <>
            <header className="topbar">
                <button
                    className="btn btn--primary"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus size={16} />
                    Create Ticket
                </button>

                <div className="topbar__actions">
                    <button className="btn btn--ghost btn--icon-only" aria-label="Toggle theme">
                        <Sun size={18} />
                    </button>

                    <div className="user-chip">
                        <CircleUserRound size={22} color="#dcc088" />
                        <span className="user-chip__name">
                            Hi, {userData?.user_metadata?.full_name?.split(' ')[0] || 'there'}
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