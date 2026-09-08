import React, { useContext, useState } from 'react';
import { CircleUserRound } from 'lucide-react';
import { TicketContext } from '../hooks/TicketContext';
import { UpdateTicketModal } from './UpdateTicketModal';

const PriorityLabel = ({ priority }) => {
    const p = priority?.toLowerCase() || 'low';
    let dotColor = '#7f8c8d';
    if (p === 'critical') dotColor = '#e74c3c';
    if (p === 'high') dotColor = '#f39c12';
    if (p === 'medium') dotColor = '#3498db';

    return (
        <div className="ticket-card__priority-label">
            <span className="priority-dot" style={{ backgroundColor: dotColor }}></span>
            {p.charAt(0).toUpperCase() + p.slice(1)}
        </div>
    );
};

export const TicketCard = ({ ticket }) => {
    const { updateTicket } = useContext(TicketContext);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const assigneeName = ticket.assignee?.full_name || ticket.assigned_to?.full_name || 'Unassigned';
    const ticketIdStr = ticket.id ? ticket.id.substring(0, 5).toUpperCase() : 'NEW';

    const handleStatusChange = (e, newStatus) => {
        e.stopPropagation();
        updateTicket(ticket.id, { status: newStatus });
    };

    return (
        <>
            <div className="ticket-card" onClick={() => setIsUpdateModalOpen(true)}>
                <div className="ticket-card__header">
                    <span className="ticket-card__id">TKT-{ticketIdStr}</span>
                    <div className="ticket-card__assignee" title={`Assigned to: ${assigneeName}`}>
                        <CircleUserRound size={14} strokeWidth={2} />
                        <span>{assigneeName}</span>
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


