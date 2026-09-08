import { createContext, useContext, useState } from 'react';
import { supabase } from '../utils/supabase'
import { AuthContext } from './AuthContext'

export const TicketContext = createContext();

export const TicketContextProvider = ({ children }) => {
    const { userData } = useContext(AuthContext)
    const [ticketData, setTicketData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError('');

            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                setError(error.message);
                return;
            }

            setTicketData(data);
        } catch (err) {
            console.log(err);
            setError('Something went wrong while fetching tickets');
        } finally {
            setLoading(false);
        }
    };

    const createTicket = async (formData) => {
        try {
            setLoading(true);
            setError('');

            const { data, error } = await supabase
                .from('tickets')
                .insert({
                    title: formData.title,
                    description: formData.description,
                    priority: formData.priority,
                    department: formData.department,
                    assigned_to: formData.assigned_to,
                    created_by: userData?.id || null,
                })
                .select()
                .single();

            if (error) {
                setError(error.message);
                return;
            }

            setTicketData((prev) => [data, ...prev]);
        } catch (err) {
            console.log(err);
            setError('Something went wrong while creating the ticket');
        } finally {
            setLoading(false);
        }
    };

    const updateTicket = async (ticketId, updates) => {
        try {
            setLoading(true);
            setError('');

            const { data, error } = await supabase
                .from('tickets')
                .update(updates)
                .eq('id', ticketId)
                .select()
                .single();

            if (error) {
                setError(error.message);
                return;
            }

            setTicketData((prev) =>
                prev.map((ticket) => (ticket.id === ticketId ? data : ticket))
            );
        } catch (err) {
            console.log(err);
            setError('Something went wrong while updating the ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TicketContext.Provider
            value={{
                ticketData,
                loading,
                error,
                fetchTickets,
                createTicket,
                updateTicket,
            }}
        >
            {children}
        </TicketContext.Provider>
    );
};