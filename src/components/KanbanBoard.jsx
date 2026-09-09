import React, { useContext, useEffect, useState } from 'react';
import { TicketContext } from '../hooks/TicketContext';
import { TicketCard } from './TicketCard';
import { Search, Filter } from 'lucide-react';

export const KanbanBoard = () => {
    const { ticketData, fetchTickets, loading } = useContext(TicketContext);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');

    useEffect(() => {
        fetchTickets();
    }, []);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Group tickets by status. Default to 'todo' if no status exists.
    const columns = {
        todo: { title: 'TODO', tickets: [] },
        inProgress: { title: 'In-Progress', tickets: [] },
        done: { title: 'Done', tickets: [] },
    };

    let filteredTickets = ticketData || [];

    if (debouncedSearchTerm) {
        const term = debouncedSearchTerm.toLowerCase();
        filteredTickets = filteredTickets.filter(ticket => 
            ticket.title?.toLowerCase().includes(term) || 
            ticket.description?.toLowerCase().includes(term) ||
            ticket.id?.toLowerCase().includes(term)
        );
    }

    if (priorityFilter !== 'all') {
        filteredTickets = filteredTickets.filter(ticket => 
            ticket.priority?.toLowerCase() === priorityFilter.toLowerCase()
        );
    }

    filteredTickets.forEach(ticket => {
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

    if (loading && (!ticketData || ticketData.length === 0)) {
        return <div style={{ padding: '24px', color: 'var(--text-primary)' }}>Loading tickets...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            {/* Toolbar */}
            <div style={{ 
                padding: '16px 24px', 
                borderBottom: '1px solid var(--border-subtle)', 
                display: 'flex', 
                gap: '16px',
                alignItems: 'center',
                backgroundColor: 'var(--surface-1)'
            }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                        type="text" 
                        placeholder="Search tickets by title, ID, or description..." 
                        className="input"
                        style={{ paddingLeft: '36px', width: '100%', backgroundColor: 'var(--color-3)' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={16} color="var(--text-secondary)" />
                    <select 
                        className="select" 
                        style={{ width: '140px', backgroundColor: 'var(--color-3)' }}
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="all">All Priorities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>

            <div className="kanban-board">
                <div className="kanban-column kanban-column--todo">
                    <div className="kanban-column__header">
                        {columns.todo.title}
                        <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            ({columns.todo.tickets.length})
                        </span>
                    </div>
                    <div className="kanban-column__body">
                        {columns.todo.tickets.map(ticket => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                </div>

                <div className="kanban-column kanban-column--in-progress">
                    <div className="kanban-column__header">
                        {columns.inProgress.title}
                        <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            ({columns.inProgress.tickets.length})
                        </span>
                    </div>
                    <div className="kanban-column__body">
                        {columns.inProgress.tickets.map(ticket => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                </div>

                <div className="kanban-column kanban-column--done">
                    <div className="kanban-column__header">
                        {columns.done.title}
                        <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            ({columns.done.tickets.length})
                        </span>
                    </div>
                    <div className="kanban-column__body">
                        {columns.done.tickets.map(ticket => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
