import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabase';
import { TicketContext } from '../hooks/TicketContext';

const StoryTypeModal = ({ storyType, onClose, onRefresh }) => {
    const isEdit = !!storyType;
    const [name, setName] = useState(storyType?.name || '');
    const [description, setDescription] = useState(storyType?.description || '');
    const [colorCode, setColorCode] = useState(storyType?.color_code || '#6B7280');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name,
            description,
            color_code: colorCode
        };

        let resultError = null;

        if (isEdit) {
            const { error } = await supabase
                .from('story_types')
                .update(payload)
                .eq('id', storyType.id);
            resultError = error;
        } else {
            const { error } = await supabase
                .from('story_types')
                .insert([payload]);
            resultError = error;
        }

        if (resultError) {
            console.error("Error saving story type:", resultError);
            alert("Error: " + resultError.message);
        } else {
            onRefresh();
            onClose();
        }
        setLoading(false);
    };

    return (
        <div className="ticket-modal-backdrop" onClick={onClose}>
            <div className="ticket-modal" onClick={e => e.stopPropagation()}>
                <div className="ticket-modal__header">
                    <h2 className="ticket-modal__title">{isEdit ? 'Edit Story Type' : 'Add Story Type'}</h2>
                    <span className="ticket-modal__close" onClick={onClose}>×</span>
                </div>
                
                <form onSubmit={handleSubmit} className="ticket-modal__body">
                    <div className="field">
                        <label className="field__label">Name</label>
                        <input 
                            type="text" 
                            className="input" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            placeholder="e.g. bug, feature"
                        />
                    </div>
                    
                    <div className="field">
                        <label className="field__label">Description</label>
                        <input 
                            type="text" 
                            className="input" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            placeholder="Brief description"
                        />
                    </div>



                    <div className="field">
                        <label className="field__label">Color Code</label>
                        <div className="color-picker-group">
                            <input 
                                type="color" 
                                value={colorCode} 
                                onChange={(e) => setColorCode(e.target.value)}
                                className="color-picker-group__input"
                            />
                            <input 
                                type="text" 
                                className="input color-picker-group__text" 
                                value={colorCode} 
                                onChange={(e) => setColorCode(e.target.value)} 
                                placeholder="#HexColor"
                            />
                        </div>
                    </div>

                    <div className="ticket-modal__footer ticket-modal__footer--spaced">
                        <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn--primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Story Type'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const StoryTypesManagement = () => {
    const { deleteTicketsByStoryType, fetchTickets } = useContext(TicketContext);
    const [storyTypes, setStoryTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingType, setEditingType] = useState(null);

    const fetchStoryTypes = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('story_types')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error("Error fetching story types", error);
        } else {
            setStoryTypes(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStoryTypes();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this story type? All tickets associated with this story type will also be permanently deleted.")) return;
        
        setLoading(true);
        try {
            // 1. Delete all tickets that have this story_type_id first
            if (deleteTicketsByStoryType) {
                await deleteTicketsByStoryType(id);
            } else {
                const { error: ticketError } = await supabase
                    .from('tickets')
                    .delete()
                    .eq('story_type_id', id);

                if (ticketError) throw ticketError;
            }

            // 2. Delete the story type
            const { error: storyTypeError } = await supabase
                .from('story_types')
                .delete()
                .eq('id', id);

            if (storyTypeError) {
                console.error("Error deleting story type", storyTypeError);
                alert("Error deleting story type: " + storyTypeError.message);
            } else {
                fetchStoryTypes();
                if (fetchTickets) {
                    fetchTickets();
                }
            }
        } catch (err) {
            console.error("Error deleting story type and associated tickets:", err);
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && storyTypes.length === 0) {
        return <div className="loader-screen loader-screen--inline">Loading story types...</div>;
    }

    return (
        <div className="story-types-container">
            <div className="table-header">
                <h2>Story Types</h2>
                <button 
                    className="btn btn--primary"
                    onClick={() => {
                        setEditingType(null);
                        setShowModal(true);
                    }}
                >
                    + Add New Type
                </button>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Color</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {storyTypes.map(st => (
                            <tr key={st.id}>
                                <td className="table__cell-capitalize-fw500">{st.name}</td>
                                <td className="table__cell-muted">{st.description}</td>
                                <td>
                                    <div className="color-swatch-badge">
                                        <div 
                                            className="color-swatch-badge__dot" 
                                            style={{ '--swatch-color': st.color_code }}
                                        />
                                        <span className="color-swatch-badge__hex">{st.color_code}</span>
                                    </div>
                                </td>

                                <td>
                                    <div className="data-table__actions">
                                        <button 
                                            className="btn btn--ghost"
                                            onClick={() => {
                                                setEditingType(st);
                                                setShowModal(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn btn--ghost btn--danger"
                                            onClick={() => handleDelete(st.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {storyTypes.length === 0 && (
                    <div className="table__empty-state">
                        No story types found.
                    </div>
                )}
            </div>

            {showModal && (
                <StoryTypeModal 
                    storyType={editingType}
                    onClose={() => {
                        setShowModal(false);
                        setEditingType(null);
                    }}
                    onRefresh={fetchStoryTypes}
                />
            )}
        </div>
    );
};
