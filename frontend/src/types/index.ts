export interface User {
  id?: number;
  username: string;
  name?: string;
  points?: number;
}

export interface Family {
  id?: number;
  name: string;
  code: string;
  members: User[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  points: number;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED';
}

export interface Reward {
  id: number;
  name: string;
  pointsCost: number;
}

export interface GroceryItem {
  id: number;
  name: string;
  isPurchased: boolean;
}
