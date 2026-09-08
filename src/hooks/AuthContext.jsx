import { createContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase'
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [authLoading, setAuthLoading] = useState(false);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.log(error);
                setError(error)
            }

            setUserData(data.session?.user ?? null);
            setAuthLoading(false);
        };

        getSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setUserData(session?.user ?? null);
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