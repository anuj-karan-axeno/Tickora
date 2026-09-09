import { createContext, useEffect, useState } from 'react';

import { supabase } from '../utils/supabase'
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async (userId) => {
            if (!userId) {
                setUserProfile(null);
                return;
            }
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (!error && data) {
                setUserProfile(data);
            }
        };

        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.log(error);
                setError(error);
            }

            const user = data.session?.user ?? null;
            setUserData(user);
            await fetchProfile(user?.id);
            setAuthLoading(false);
        };

        getSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            const user = session?.user ?? null;
            setUserData(user);
            await fetchProfile(user?.id);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
    }

    const loginUser = async (formData) => {
        try {
            setLoading(true);

            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                setError(error.message)
                alert(error.message);
                return;
            }

            if (data.user) {
                setUserData(data.user);
                navigate('/dashboard')
            }

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                userData,
                setUserData,
                userProfile,
                authLoading,
                handleLogout,
                loginUser,
                loading,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};