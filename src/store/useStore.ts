import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LearningItem, Activity, Todo } from '../types';

interface LearningState {
  items: LearningItem[];
  activities: Activity[];
  todos: Todo[];
  isDemoData: boolean;
  
  // Items
  addItem: (item: Omit<LearningItem, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, updates: Partial<LearningItem>) => void;
  deleteItem: (id: string) => void;
  
  // Activities
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  deleteActivity: (id: string) => void;

  // Todos
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompletedTodos: () => void;
  
  // UI State
  isAddModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  
  // Helper
  getStreak: () => number;
  initializeDemoData: () => void;
}

const DEMO_ITEMS: LearningItem[] = [
  { id: '1', title: 'Modern UI Design', category: 'Design', status: 'In progress', progress: 65, notes: 'Focusing on Sage Green palettes.', createdAt: Date.now() - 86400000 * 5 },
  { id: '2', title: 'React Performance', category: 'Development', status: 'In progress', progress: 40, notes: 'Optimizing Re-renders.', createdAt: Date.now() - 86400000 * 10 },
  { id: '3', title: 'Machine Learning Basics', category: 'Data Science', status: 'In progress', progress: 15, notes: 'Starting with Linear Regression.', createdAt: Date.now() - 86400000 * 2 },
];

const DEMO_TODOS: Todo[] = [
  { id: 't1', text: 'Read 20 pages: Thinking, Fast and Slow', completed: true, createdAt: Date.now() },
  { id: 't2', text: 'Practice Python: Loops', completed: false, createdAt: Date.now() },
  { id: 't3', text: 'Watch Design Lecture', completed: false, createdAt: Date.now() },
];

const generateDemoActivities = (): Activity[] => {
  const activities: Activity[] = [];
  for (let i = 0; i < 30; i++) {
    if (Math.random() > 0.3) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        activities.push({
            id: `a${i}`,
            learningItemId: '1',
            text: 'Focused study session',
            date: date.toISOString().split('T')[0],
            createdAt: date.getTime()
        });
    }
  }
  return activities;
};

export const useStore = create<LearningState>()(
  persist(
    (set, get) => ({
      items: [],
      activities: [],
      todos: [],
      isDemoData: false,
      isAddModalOpen: false,
      
      setAddModalOpen: (open) => set({ isAddModalOpen: open }),

      addTodo: (text) => set((state) => {
        const base = state.isDemoData ? { items: [], activities: [], todos: [], isDemoData: false } : state;
        return {
          ...base,
          todos: [
            ...base.todos,
            { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() }
          ]
        };
      }),

      toggleTodo: (id) => set((state) => {
        if (state.isDemoData) return { items: [], activities: [], todos: [], isDemoData: false };
        return {
          todos: state.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        };
      }),

      deleteTodo: (id) => set((state) => {
        if (state.isDemoData) return { items: [], activities: [], todos: [], isDemoData: false };
        return {
          todos: state.todos.filter(t => t.id !== id)
        };
      }),

      clearCompletedTodos: () => set((state) => {
        if (state.isDemoData) return { items: [], activities: [], todos: [], isDemoData: false };
        return {
          todos: state.todos.filter(t => !t.completed)
        };
      }),
      
      addItem: (item) => set((state) => {
        const base = state.isDemoData ? { items: [], activities: [], todos: [], isDemoData: false } : state;
        return {
          ...base,
          items: [
            ...base.items,
            {
              ...item,
              id: crypto.randomUUID(),
              createdAt: Date.now(),
            },
          ],
        };
      }),
      
      updateItem: (id, updates) => set((state) => {
        if (state.isDemoData) return { items: [], activities: [], todos: [], isDemoData: false };
        return {
          items: state.items.map((item) => 
            item.id === id ? { ...item, ...updates } : item
          ),
        };
      }),
      
      deleteItem: (id) => set((state) => {
        if (state.isDemoData) return { items: [], activities: [], todos: [], isDemoData: false };
        return {
          items: state.items.filter((item) => item.id !== id),
          activities: state.activities.filter((a) => a.learningItemId !== id),
        };
      }),
      
      addActivity: (activity) => set((state) => {
        const base = state.isDemoData ? { items: [], activities: [], todos: [], isDemoData: false } : state;
        return {
          ...base,
          activities: [
            ...base.activities,
            {
              ...activity,
              id: crypto.randomUUID(),
              createdAt: Date.now(),
            },
          ],
        };
      }),
      
      deleteActivity: (id) => set((state) => {
        if (state.isDemoData) return { items: [], activities: [], todos: [], isDemoData: false };
        return {
          activities: state.activities.filter((a) => a.id !== id),
        };
      }),
      
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

      initializeDemoData: () => {
        const { items, activities, todos } = get();
        // Only load if the store is literally empty (never used)
        if (items.length === 0 && activities.length === 0 && todos.length === 0) {
          set({ 
            items: DEMO_ITEMS, 
            todos: DEMO_TODOS, 
            activities: generateDemoActivities(),
            isDemoData: true 
          });
        }
      }
    }),
    {
      name: 'learning-tracker-storage',
      onRehydrateStorage: () => (state) => {
        if (state) state.initializeDemoData();
      }
    }
  )
);
