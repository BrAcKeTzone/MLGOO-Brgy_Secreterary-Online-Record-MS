import { create } from 'zustand';
import axios from 'axios';

const useEventStore = create((set) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('/api/events');
      set({ events: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addEvent: async (event) => {
    try {
      const res = await axios.post('/api/events', event);
      set((state) => ({ events: [...state.events, res.data] }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  deleteEvent: async (id) => {
    try {
      await axios.delete(`/api/events/${id}`);
      set((state) => ({ events: state.events.filter((e) => e.id !== id) }));
    } catch (err) {
      set({ error: err.message });
    }
  },
}));

export default useEventStore;
