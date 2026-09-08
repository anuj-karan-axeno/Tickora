import React, { useContext, useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUp, CircleUserRound } from 'lucide-react';
import { TicketContext } from '../hooks/TicketContext';
import { UpdateTicketModal } from './UpdateTicketModal';

const PriorityIcon = ({ priority }) => {
    switch (priority?.toLowerCase()) {
        case 'high':
        case 'critical':
            return <ChevronsUp color="#e74c3c" size={24} />;
        case 'medium':
            return <ChevronUp color="#f39c12" size={24} />;
        case 'low':
        default:
            return <ChevronDown color="#3498db" size={24} />;
    }
};

export const TicketCard = ({ ticket }) => {
    const { updateTicket } = useContext(TicketContext);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    // Supabase joins often return objects for foreign keys. If not, it might be a raw UUID string.
    const assignedByName = ticket.creator?.full_name || ticket.created_by?.full_name || 'System';
    const assigneeName = ticket.assignee?.full_name || ticket.assigned_to?.full_name || 'Unassigned';

    const handleStatusChange = (e, newStatus) => {
        e.stopPropagation();
        updateTicket(ticket.id, { status: newStatus });
    };

    return (
        <>
            <div className="ticket-card" onClick={() => setIsUpdateModalOpen(true)} style={{ cursor: 'pointer' }}>
                <div className="ticket-card__header">
                    <h3 className="ticket-card__title">{ticket.title}</h3>
                    <div className="ticket-card__priority">
                        <PriorityIcon priority={ticket.priority} />
                    </div>
                </div>
                
                <p className="ticket-card__desc">{ticket.description}</p>
                
                <div className="ticket-card__footer">
                    <span className="ticket-card__assigned-by">
                        Assigned By: {assignedByName}
                    </span>
                    
                    <div className="ticket-card__assignee">
                        <CircleUserRound size={18} />
                        <span>{assigneeName}</span>
                    </div>
                </div>

                <div className="ticket-card__actions" onClick={(e) => e.stopPropagation()}>
                    {ticket.status === 'open' && (
                        <button className="btn btn--primary btn--full" onClick={(e) => handleStatusChange(e, 'in-progress')}>
                            Start Progress
                        </button>
                    )}
                    {(ticket.status === 'in-progress' || ticket.status === 'escalated') && (
                        <button className="btn btn--primary btn--full" onClick={(e) => handleStatusChange(e, 'resolved')}>
                            Mark Done
                        </button>
                    )}
                    {(ticket.status === 'resolved' || ticket.status === 'closed') && (
                        <button className="btn btn--secondary btn--full" onClick={(e) => handleStatusChange(e, 'open')}>
                            Reopen
                        </button>
                    )}
                </div>
            </div>

            {isUpdateModalOpen && (
                <UpdateTicketModal ticket={ticket} onClose={() => setIsUpdateModalOpen(false)} />
            )}
        </>
    );
};
