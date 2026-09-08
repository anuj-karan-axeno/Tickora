import React, { useContext, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { TicketContext } from '../hooks/TicketContext'
import { supabase } from '../utils/supabase'
import '../styles/components/create-ticket-modal.scss'

export const CreateTicketModal = ({ onClose }) => {
    const { createTicket, loading, error } = useContext(TicketContext)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('medium')
    const [department, setDepartment] = useState('')
    const [assignedTo, setAssignedTo] = useState('')
    const [agents, setAgents] = useState([])

    // Fetch assignable users for the dropdown
    useEffect(() => {
        const fetchAgents = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name')
                // .in('role', ['agent', 'manager']) // Temporarily commented out to show all users

            if (error) {
                console.error("Error fetching profiles:", error)
            }
            setAgents(data || [])
        }

        fetchAgents()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        await createTicket({
            title,
            description,
            priority,
            department,
            assigned_to: assignedTo || null,
        })

        onClose()
    }

    return (
        <div className="ticket-modal-backdrop" onClick={onClose}>
            <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ticket-modal__header">
                    <h2 className="ticket-modal__title">Create Ticket</h2>
                    <X size={20} className="ticket-modal__close" onClick={onClose} />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="ticket-modal__body">
                        <div className="field">
                            <label className="field__label" htmlFor="title">Title</label>
                            <input
                                id="title"
                                type="text"
                                className="input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="field">
                            <label className="field__label" htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                className="textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label className="field__label" htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                className="select"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        <div className="field">
                            <label className="field__label" htmlFor="department">Department</label>
                            <input
                                id="department"
                                type="text"
                                className="input"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label className="field__label" htmlFor="assignedTo">Assign to</label>
                            <select
                                id="assignedTo"
                                className="select"
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                            >
                                <option value="">Unassigned</option>
                                {agents.map((agent) => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {error && <p className="field__error">{error}</p>}
                    </div>

                    <div className="ticket-modal__footer">
                        <button type="button" className="btn btn--secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn--primary" disabled={loading}>
                            {loading ? 'Creating…' : 'Create Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}