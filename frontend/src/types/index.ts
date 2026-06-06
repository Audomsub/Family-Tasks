export interface User {
  id?: number;
  fullName?: string;
  username?: string;
  name?: string;
  email?: string;
  role?: 'PARENT' | 'CHILD' | 'SUPER_ADMIN';
  totalPoints?: number;
  points?: number;
  currentStreak?: number;
  level?: number;
  avatar?: string;
}

export interface FamilyMember {
  id: number;
  fullName: string;
  email: string;
  role: 'PARENT' | 'CHILD';
  totalPoints: number;
  currentStreak?: number;
  level?: number;
}

export interface Family {
  familyId?: number;
  familyName?: string;
  inviteCode?: string;
  member?: FamilyMember[];
  // legacy field aliases
  name?: string;
  code?: string;
  members?: FamilyMember[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  points: number;
  dueDate?: string;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  assigneeName?: string;
  recurrencePattern?: string;
  parentComment?: string;
}

export interface Reward {
  id: number;
  name: string;
  description?: string;
  pointsRequired?: number;
  pointsCost?: number;
}

export interface GroceryItem {
  id: number;
  name: string;
  isPurchased: boolean;
}

export interface LeaderboardEntry {
  id?: number;
  fullName?: string;
  name?: string;
  username?: string;
  totalPoints?: number;
  points?: number;
  role?: string;
}

export interface RedemptionRecord {
  rewardName: string;
  pointsSpent: number;
  redeemedAt: string;
}

export interface PayoutRecord {
  id: number;
  parent: User;
  child: User;
  pointsDeducted: number;
  moneyPaid: number;
  payoutDate: string;
}

export interface FamilyAnalytics {
  totalPointsEarned: number;
  childrenCount: number;
  tasks: {
    total: number;
    approved: number;
    pending: number;
    submitted: number;
    rejected: number;
  };
  members: {
    id: number;
    name: string;
    totalPoints: number;
    currentPoints: number;
    streak: number;
    level: number;
  }[];
}
