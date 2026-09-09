import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../utils/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const authSignUpClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
    },
});

export const AddUser = ({ onUserAdded }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

        if (!password || password.length < 6) {
            setErrorMsg('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        const { data, error } = await authSignUpClient.auth.signUp({
            email: email,
            password: password,
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
        setSuccessMsg(`User "${fullName}" (${email}) was successfully created! They can now log in using this email and password.`);
        setFullName('');
        setEmail('');
        setPassword('');
        setDepartment('');
        setRole('member');

        if (onUserAdded) {
            onUserAdded();
        }
    };

    return (
        <div className="add-user-container">
            <div className="ticket-card add-user-card">
                <h2 className="add-user-card__title">Add New User</h2>
                
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="field">
                        <label className="field__label" htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            className="input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="new-user-email">Email Address</label>
                        <input
                            id="new-user-email"
                            name="new-user-email"
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="new-user-password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="new-user-password"
                                name="new-user-password"
                                type={showPassword ? "text" : "password"}
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password (min 6 characters)"
                                minLength={6}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
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
                        <p className="form-message form-message--success">
                            {successMsg}
                        </p>
                    )}

                    {errorMsg && (
                        <p className="form-message form-message--error">
                            {errorMsg}
                        </p>
                    )}

                    <div className="form-actions--end">
                        <button type="submit" className="btn btn--primary" disabled={loading}>
                            {loading ? 'Adding User...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
