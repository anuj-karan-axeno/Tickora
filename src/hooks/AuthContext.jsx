import { createContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase'


export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

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
                email: loginFormData.email,
                password: loginFormData.password,
            });

            if (error) {
                setError(error.message)
                alert(error.message);
                return;
            }

            if (data.user) {
                setUserData(data.user);

                alert("Login successfully");
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
                loading,
                error,

            }}
        >
            {children}
        </AuthContext.Provider>
    );
};