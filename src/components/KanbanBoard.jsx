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

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const columns = {
        todo: { title: 'TODO', tickets: [] },
        inProgress: { title: 'In-Progress', tickets: [] },
        done: { title: 'Done', tickets: [] },
    };

    let filteredTickets = ticketData || [];

    if (debouncedSearchTerm.trim()) {
        const term = debouncedSearchTerm.trim().toLowerCase();
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
            columns.todo.tickets.push(ticket);
        }
    });

    if (loading && (!ticketData || ticketData.length === 0)) {
        return <div className="loader-screen loader-screen--inline">Loading tickets...</div>;
    }

    return (
        <div className="kanban-layout">
           
            <div className="kanban-toolbar">
                <div className="search-wrapper">
                    <Search size={16} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search tickets by title, ID, or description..." 
                        className="input search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-wrapper">
                    <select 
                        className="select priority-select" 
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
                        <span className="kanban-column__count">
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
                        <span className="kanban-column__count">
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
                        <span className="kanban-column__count">
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
