import React, { useContext, useState } from 'react';
import { CircleUserRound, Trash2 } from 'lucide-react';
import { TicketContext } from '../hooks/TicketContext';
import { AuthContext } from '../hooks/AuthContext';
import { UpdateTicketModal } from './UpdateTicketModal';

const PriorityLabel = ({ priority }) => {
    const p = priority?.toLowerCase() || 'low';

    return (
        <div className="ticket-card__priority-label">
            <span className={`priority-dot priority-dot--${p}`}></span>
            {p.charAt(0).toUpperCase() + p.slice(1)}
        </div>
    );
};

export const TicketCard = ({ ticket }) => {
    const { updateTicket, deleteTicket } = useContext(TicketContext);
    const { userProfile } = useContext(AuthContext);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const isAdmin = userProfile?.role === 'admin';
    const assigneeName = ticket.assignee?.full_name || ticket.assigned_to?.full_name || 'Unassigned';
    const ticketIdStr = ticket.id ? ticket.id.substring(0, 5).toUpperCase() : 'NEW';

    const handleStatusChange = (e, newStatus) => {
        e.stopPropagation();
        updateTicket(ticket.id, { status: newStatus });
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!isAdmin) return;

        const confirmDelete = window.confirm(`Are you sure you want to delete ticket "TKT-${ticketIdStr}"?`);
        if (!confirmDelete) return;

        try {
            await deleteTicket(ticket.id);
        } catch (err) {
            console.error("Error deleting ticket:", err);
            alert("Error deleting ticket: " + (err.message || err));
        }
    };

    return (
        <>
            <div className="ticket-card" onClick={() => setIsUpdateModalOpen(true)}>
                {ticket.story_type_id && (
                    <div 
                        className="ticket-card__story-banner"
                        style={{
                            '--story-color': ticket.story_type_id.color_code,
                            '--story-bg': `${ticket.story_type_id.color_code}20`,
                            '--story-border': `${ticket.story_type_id.color_code}40`
                        }}
                    >
                        {ticket.story_type_id.name}
                    </div>
                )}
                <div className="ticket-card__header">
                    <span className="ticket-card__id">TKT-{ticketIdStr}</span>
                    <div className="ticket-card__header-right">
                        <div className="ticket-card__assignee" title={`Assigned to: ${assigneeName}`}>
                            <CircleUserRound size={14} strokeWidth={2} />
                            <span>{assigneeName}</span>
                        </div>
                        {isAdmin && (
                            <button
                                className="ticket-card__delete-btn"
                                onClick={handleDelete}
                                title="Delete ticket"
                                aria-label="Delete ticket"
                            >
                                <Trash2 size={13} />
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="ticket-card__body">
                    <h3 className="ticket-card__title">{ticket.title}</h3>
                    {ticket.description && (
                        <p className="ticket-card__desc">{ticket.description}</p>
                    )}
                </div>
                
                <div className="ticket-card__footer">
                    <PriorityLabel priority={ticket.priority} />

                    <div className="ticket-card__actions" onClick={(e) => e.stopPropagation()}>
                        {ticket.status === 'open' && (
                            <button className="ticket-btn" onClick={(e) => handleStatusChange(e, 'in-progress')}>
                                Start Progress
                            </button>
                        )}
                        {ticket.status === 'in-progress' && (
                            <button className="ticket-btn ticket-btn--done" onClick={(e) => handleStatusChange(e, 'closed')}>
                                Done
                            </button>
                        )}
                        {ticket.status === 'closed' && (
                            <button className="ticket-btn" onClick={(e) => handleStatusChange(e, 'open')}>
                                Reopen
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isUpdateModalOpen && (
                <UpdateTicketModal 
                    ticket={ticket} 
                    onClose={() => setIsUpdateModalOpen(false)} 
                />
            )}
        </>
    );
};


