import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface UserState {
  user: {
    email: string;
    name: string;
    credits: number;
    status: string;
    plan: string;
    role: 'STANDARD' | 'VIP' | 'SUPER_USER';
    custom_credit_limit?: number;
  } | null;
  isLoading: boolean;
  isSuperUser: () => boolean;
  isVip: () => boolean;
  
  setUser: (user: any) => void;
  updateCredits: (amount: number, action: 'add' | 'deduct') => Promise<void>;
  fetchUserCredits: (email: string) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      
      isSuperUser: () => {
        const user = get().user;
        return user?.role === 'SUPER_USER';
      },

      isVip: () => {
        const user = get().user;
        return user?.role === 'VIP';
      },

      updateCredits: async (amount, action) => {
        const currentUser = get().user;
        if (!currentUser) return;

        // Optimistic Update
        const previousCredits = currentUser.credits;
        const optimisticCredits = action === 'add' ? previousCredits + amount : previousCredits - amount;
        
        set({ user: { ...currentUser, credits: optimisticCredits } });

        try {
          const response: any = await api.post('/user/credits/deduct', {
            email: currentUser.email,
            amount: action === 'deduct' ? amount : -amount
          });
          
          if (response.status === 'success') {
            set({ user: { ...currentUser, credits: response.new_balance } });
          }
        } catch (error) {
          // Rollback on failure
          set({ user: { ...currentUser, credits: previousCredits } });
          toast.error("Neural Balance Sync Interrupted.");
        }
      },

      fetchUserCredits: async (email) => {
        set({ isLoading: true });
        try {
          const response: any = await api.get(`/user/credits?email=${email}`);
          const currentUser = get().user;
          if (currentUser) {
            set({ user: { ...currentUser, credits: response.credits } });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => set({ user: null }),
    }),
    {
      name: 'vxf-user-storage',
    }
  )
);
