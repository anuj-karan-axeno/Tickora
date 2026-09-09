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
                .select('*, created_by(id, full_name), assigned_to(id, full_name), story_type_id(id, name, color_code)')
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
                    story_type_id: formData.story_type_id,
                    created_by: userData?.id || null,
                })
                .select('*, created_by(id, full_name), assigned_to(id, full_name), story_type_id(id, name, color_code)')
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
                .select('*, created_by(id, full_name), assigned_to(id, full_name), story_type_id(id, name, color_code)')
                .single();

            if (error) {
                console.error("Supabase update error:", error);
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

    const deleteTicketsByStoryType = async (storyTypeId) => {
        try {
            const { error } = await supabase
                .from('tickets')
                .delete()
                .eq('story_type_id', storyTypeId);

            if (error) {
                console.error("Supabase delete tickets by story_type error:", error);
                throw error;
            }

            setTicketData((prev) =>
                prev.filter((ticket) => {
                    const id = ticket.story_type_id?.id || ticket.story_type_id;
                    return id !== storyTypeId;
                })
            );
        } catch (err) {
            console.error(err);
            setError('Something went wrong while deleting associated tickets');
            throw err;
        }
    };

    const deleteTicket = async (ticketId) => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('tickets')
                .delete()
                .eq('id', ticketId);

            if (error) {
                console.error("Supabase delete ticket error:", error);
                throw error;
            }

            setTicketData((prev) => prev.filter((ticket) => ticket.id !== ticketId));
        } catch (err) {
            console.error(err);
            setError('Something went wrong while deleting the ticket');
            throw err;
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
                deleteTicketsByStoryType,
                deleteTicket,
            }}
        >
            {children}
        </TicketContext.Provider>
    );
};