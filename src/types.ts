export type Category = string;
export type Status = 'Not started' | 'In progress' | 'Completed';

export interface LearningItem {
  id: string;
  title: string;
  category: Category;
  status: Status;
  progress: number;
  notes: string;
  createdAt: number;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface Activity {
  id: string;
  date: string;
  text: string;
  learningItemId?: string;
  createdAt: number;
}
