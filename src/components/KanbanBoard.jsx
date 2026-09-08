import React, { useContext, useEffect } from 'react';
import { TicketContext } from '../hooks/TicketContext';
import { TicketCard } from './TicketCard';

export const KanbanBoard = () => {
    const { ticketData, fetchTickets, loading } = useContext(TicketContext);

    useEffect(() => {
        fetchTickets();
    }, []);

    // Group tickets by status. Default to 'todo' if no status exists.
    const columns = {
        todo: { title: 'TODO', tickets: [] },
        inProgress: { title: 'In-Progress', tickets: [] },
        done: { title: 'Done', tickets: [] },
    };

    if (ticketData) {
        ticketData.forEach(ticket => {
            const status = ticket.status?.toLowerCase();
            if (status === 'in-progress') {
                columns.inProgress.tickets.push(ticket);
            } else if (status === 'closed') {
                columns.done.tickets.push(ticket);
            } else {
                // Default fallback ('open')
                columns.todo.tickets.push(ticket);
            }
        });
    }

    if (loading && (!ticketData || ticketData.length === 0)) {
        return <div style={{ padding: '24px', color: '#f5f1e8' }}>Loading tickets...</div>;
    }

    return (
        <div className="kanban-board">
            <div className="kanban-column kanban-column--todo">
                <div className="kanban-column__header">{columns.todo.title}</div>
                <div className="kanban-column__body">
                    {columns.todo.tickets.map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            </div>

            <div className="kanban-column kanban-column--in-progress">
                <div className="kanban-column__header">{columns.inProgress.title}</div>
                <div className="kanban-column__body">
                    {columns.inProgress.tickets.map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            </div>

            <div className="kanban-column kanban-column--done">
                <div className="kanban-column__header">{columns.done.title}</div>
                <div className="kanban-column__body">
                    {columns.done.tickets.map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            </div>
        </div>
    );
};
