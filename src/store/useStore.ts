import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LearningItem, Activity } from '../types';

interface LearningState {
  items: LearningItem[];
  activities: Activity[];
  
  // Items
  addItem: (item: Omit<LearningItem, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, updates: Partial<LearningItem>) => void;
  deleteItem: (id: string) => void;
  
  // Activities
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  deleteActivity: (id: string) => void;
  
  // UI State
  isAddModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  
  // Helper
  getStreak: () => number;
}

export const useStore = create<LearningState>()(
  persist(
    (set, get) => ({
      items: [],
      activities: [],
      isAddModalOpen: false,
      
      setAddModalOpen: (open) => set({ isAddModalOpen: open }),
      
      addItem: (item) => set((state) => ({
        items: [
          ...state.items,
          {
            ...item,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
          },
        ],
      })),
      
      updateItem: (id, updates) => set((state) => ({
        items: state.items.map((item) => 
          item.id === id ? { ...item, ...updates } : item
        ),
      })),
      
      deleteItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        activities: state.activities.filter((a) => a.learningItemId !== id),
      })),
      
      addActivity: (activity) => set((state) => ({
        activities: [
          ...state.activities,
          {
            ...activity,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
          },
        ],
      })),
      
      deleteActivity: (id) => set((state) => ({
        activities: state.activities.filter((a) => a.id !== id),
      })),
      
      getStreak: () => {
        const activities = get().activities;
        if (activities.length === 0) return 0;
        
        const dates = [...new Set(activities.map(a => a.date))].sort().reverse();
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        if (dates[0] !== today && dates[0] !== yesterday) return 0;
        
        let streak = 0;
        let currentDate = new Date(dates[0]);
        
        for (let i = 0; i < dates.length; i++) {
          const d = new Date(dates[i]);
          const diff = (currentDate.getTime() - d.getTime()) / (1000 * 3600 * 24);
          
          if (diff <= 1) {
            streak++;
            currentDate = d;
          } else {
            break;
          }
        }
        
        return streak;
      },
    }),
    {
      name: 'learning-tracker-storage',
    }
  )
);
