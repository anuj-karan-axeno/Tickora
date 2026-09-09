import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { AddUser } from './AddUser';

const EditUserModal = ({ user, onClose, onRefresh }) => {
    const [fullName, setFullName] = useState(user.full_name || '');
    const [department, setDepartment] = useState(user.department || '');
    const [role, setRole] = useState(user.role || 'member');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('profiles')
            .update({ 
                full_name: fullName, 
                department: department, 
                role: role 
            })
            .eq('id', user.id);

        if (error) {
            console.error("Error updating user:", error);
            alert("Error updating user: " + error.message);
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
                    <h2 className="ticket-modal__title">Edit User</h2>
                    <span className="ticket-modal__close" onClick={onClose}>×</span>
                </div>
                
                <form onSubmit={handleUpdate} className="ticket-modal__body">
                    <div className="field">
                        <label className="field__label">Full Name</label>
                        <input 
                            type="text" 
                            className="input" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="field">
                        <label className="field__label">Department</label>
                        <input 
                            type="text" 
                            className="input" 
                            value={department} 
                            onChange={(e) => setDepartment(e.target.value)} 
                        />
                    </div>

                    <div className="field">
                        <label className="field__label">Role</label>
                        <select 
                            className="select" 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="member">Member</option>
                        </select>
                    </div>

                    <div className="ticket-modal__footer">
                        <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn--primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddUser, setShowAddUser] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error("Error fetching profiles:", error);
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (showAddUser) {
        return (
            <div className="user-management">
                <button 
                    className="btn btn--secondary user-management__back-btn" 
                    onClick={() => { setShowAddUser(false); fetchUsers(); }}
                >
                    ← Back to Users
                </button>
                <AddUser />
            </div>
        );
    }

    return (
        <div className="user-management">
            <div className="user-management__add-user-wrapper">
                <button className="btn btn--primary" onClick={() => setShowAddUser(true)}>
                    + Add New User
                </button>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loader-screen loader-screen--inline">Loading users...</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="table__cell-fw-500">{user.full_name || 'N/A'}</td>
                                    <td className="table__cell-muted">{user.email}</td>
                                    <td>{user.department || '-'}</td>
                                    <td>
                                        <select
                                            className="select"
                                            value={user.role}
                                            onChange={(e) => updateRole(user.id, e.target.value)}
                                            disabled={updateLoading === user.id}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="manager">Manager</option>
                                            <option value="agent">Agent</option>
                                            <option value="member">Member</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn--ghost"
                                            onClick={() => handleDeleteUser(user.id)}
                                            disabled={deleteLoading === user.id}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="table__empty-state">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            {editingUser && (
                <EditUserModal 
                    user={editingUser} 
                    onClose={() => setEditingUser(null)} 
                    onRefresh={fetchUsers} 
                />
            )}
        </div>
    );
};
