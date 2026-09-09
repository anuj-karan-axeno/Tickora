import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

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
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input 
                                type="color" 
                                value={colorCode} 
                                onChange={(e) => setColorCode(e.target.value)}
                                style={{ height: '36px', width: '48px', padding: '0', cursor: 'pointer', backgroundColor: 'transparent', border: 'none' }}
                            />
                            <input 
                                type="text" 
                                className="input" 
                                value={colorCode} 
                                onChange={(e) => setColorCode(e.target.value)} 
                                placeholder="#HexColor"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>



                    <div className="ticket-modal__footer" style={{ marginTop: '24px' }}>
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
        if (!window.confirm("Are you sure you want to delete this story type? This may affect existing tickets.")) return;
        
        const { error } = await supabase
            .from('story_types')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting story type", error);
            alert("Error deleting story type: " + error.message);
        } else {
            fetchStoryTypes();
        }
    };

    if (loading && storyTypes.length === 0) {
        return <div style={{ padding: '24px', color: 'var(--text-primary)' }}>Loading story types...</div>;
    }

    return (
        <div style={{ padding: '24px', width: '100%' }}>
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
                                <td style={{ fontWeight: 500, textTransform: 'capitalize' }}>{st.name}</td>
                                <td style={{ color: 'var(--text-secondary)' }}>{st.description}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: st.color_code }}></div>
                                        <span style={{ fontFamily: 'monospace' }}>{st.color_code}</span>
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
                                            className="btn btn--ghost"
                                            onClick={() => handleDelete(st.id)}
                                            style={{ color: '#e74c3c' }}
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
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
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
