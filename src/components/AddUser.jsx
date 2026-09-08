import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

export const AddUser = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [role, setRole] = useState('member');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg('');
        setErrorMsg('');

        // Create user in Supabase Auth
        // A generic password is used since the admin is creating the account
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: 'Password123!', 
            options: {
                data: {
                    full_name: fullName,
                    department: department,
                }
            }
        });

        if (error) {
            console.error("Error creating user:", error);
            setErrorMsg(error.message);
            setLoading(false);
            return;
        }

        // Note: The profiles row is automatically created by your database trigger!
        // We just need to manually update their role if it's not 'member' (since the trigger doesn't set role)
        if (data?.user && role !== 'member') {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ role: role })
                .eq('id', data.user.id);
            
            if (profileError) {
                console.error("Error setting role:", profileError);
            }
        }

        setLoading(false);
        setSuccessMsg(`User ${fullName} (${email}) has been successfully added to Supabase.`);
        setFullName('');
        setEmail('');
        setDepartment('');
        setRole('member');
    };

    return (
        <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
            <div className="ticket-card" style={{ padding: '32px' }}>
                <h2 style={{ color: '#dcc088', marginBottom: '24px' }}>Add New User</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="field__label" htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            className="input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="department">Department</label>
                        <input
                            id="department"
                            type="text"
                            className="input"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="e.g. Engineering, Sales"
                        />
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="role">Role</label>
                        <select
                            id="role"
                            className="select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="member">Member</option>
                        </select>
                    </div>

                    {successMsg && (
                        <p style={{ color: '#7ed321', fontSize: '0.875rem', marginBottom: '16px' }}>
                            {successMsg}
                        </p>
                    )}

                    {errorMsg && (
                        <p style={{ color: '#e74c3c', fontSize: '0.875rem', marginBottom: '16px' }}>
                            {errorMsg}
                        </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                        <button type="submit" className="btn btn--primary" disabled={loading}>
                            {loading ? 'Adding User...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
