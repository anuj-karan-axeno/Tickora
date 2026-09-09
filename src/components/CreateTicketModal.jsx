import React, { useContext, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { TicketContext } from '../hooks/TicketContext'
import { AuthContext } from '../hooks/AuthContext'
import { supabase } from '../utils/supabase'
import '../styles/components/create-ticket-modal.scss'

export const CreateTicketModal = ({ onClose }) => {
    const { createTicket, loading, error } = useContext(TicketContext)
    const { userData } = useContext(AuthContext)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('medium')
    const [department, setDepartment] = useState('')
    const [assignedTo, setAssignedTo] = useState('')
    const [storyTypeId, setStoryTypeId] = useState('')
    const [agents, setAgents] = useState([])
    const [storyTypes, setStoryTypes] = useState([])
    const [validationError, setValidationError] = useState('')

    // Fetch assignable users and story types
    useEffect(() => {
        const fetchData = async () => {
            const [profilesRes, storyTypesRes] = await Promise.all([
                supabase.from('profiles').select('id, full_name'),
                supabase.from('story_types').select('id, name').order('name', { ascending: true })
            ]);

            if (profilesRes.error) console.error("Error fetching profiles:", profilesRes.error);
            if (storyTypesRes.error) console.error("Error fetching story types:", storyTypesRes.error);

            const fetchedProfiles = profilesRes.data || [];
            const filteredProfiles = userData?.id 
                ? fetchedProfiles.filter(agent => agent.id !== userData.id)
                : fetchedProfiles;

            setAgents(filteredProfiles);
            setStoryTypes(storyTypesRes.data || []);
        }

        fetchData()
    }, [userData])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setValidationError('')

        if (!title.trim()) {
            setValidationError('Title is required.')
            return
        }

        if (!description.trim()) {
            setValidationError('Description is required.')
            return
        }

        if (!priority) {
            setValidationError('Please select a priority.')
            return
        }

        if (!department.trim()) {
            setValidationError('Department is required.')
            return
        }

        if (!storyTypeId) {
            setValidationError('Please select a Story Type.')
            return
        }

        if (!assignedTo) {
            setValidationError('Please select an Assignee.')
            return
        }

        await createTicket({
            title: title.trim(),
            description: description.trim(),
            priority,
            department: department.trim(),
            assigned_to: assignedTo,
            story_type_id: storyTypeId
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
                            <label className="field__label" htmlFor="title">
                                Title <span className="field__required">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                className="input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter ticket title"
                                required
                            />
                        </div>

                        <div className="field">
                            <label className="field__label" htmlFor="description">
                                Description <span className="field__required">*</span>
                            </label>
                            <textarea
                                id="description"
                                className="textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide detailed description of the task..."
                                required
                            />
                        </div>

                        <div className="field">
                            <label className="field__label" htmlFor="priority">
                                Priority <span className="field__required">*</span>
                            </label>
                            <select
                                id="priority"
                                className="select"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                required
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        <div className="field">
                            <label className="field__label" htmlFor="department">
                                Department <span className="field__required">*</span>
                            </label>
                            <input
                                id="department"
                                type="text"
                                className="input"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                placeholder="e.g. Engineering, Sales, Support"
                                required
                            />
                        </div>

                        <div className="field">
                            <label className="field__label" htmlFor="storyType">
                                Story Type <span className="field__required">*</span>
                            </label>
                            <select
                                id="storyType"
                                className="select"
                                value={storyTypeId}
                                onChange={(e) => setStoryTypeId(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a story type...</option>
                                {storyTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label className="field__label" htmlFor="assignedTo">
                                Assign to <span className="field__required">*</span>
                            </label>
                            <select
                                id="assignedTo"
                                className="select"
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select an assignee...</option>
                                {agents.map((agent) => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {validationError && <p className="field__error">{validationError}</p>}
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