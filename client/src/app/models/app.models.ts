export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  department: string;
  course: string;
  registerNo: string;
  blockNo: string;
  roomNo: string;
  address: string;
  mobile: string;
  parentMobile: string;
  createdAt?: string;
}

export interface AuthResponse {
  success?: boolean;
  token: string;
  user: User;
  message: string;
}

export interface Outpass {
  _id: string;
  userId: User;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  destination: string;
  status: 'pending' | 'approved' | 'rejected';
  qrCode: string;
  createdAt: string;
}

export interface Complaint {
  _id: string;
  userId: User;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  description: string;
  priority: 'normal' | 'important';
  expiryDate: string | null;
  createdAt: string;
  createdBy?: Pick<User, '_id' | 'name' | 'email'>;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'outpass' | 'complaint' | 'announcement' | 'system';
  isRead: boolean;
  link: string;
  createdAt: string;
}

export interface DashboardResponse {
  success?: boolean;
  user: User;
  recentOutpasses: Outpass[];
  recentComplaints: Complaint[];
  outpassCounts: Array<{ _id: string; count: number }>;
  announcements: Announcement[];
}

export interface NotificationResponse {
  success?: boolean;
  notifications: NotificationItem[];
  unreadCount: number;
}

export interface AdminStats {
  success?: boolean;
  summary: {
    totalStudents: number;
    totalOutpasses: number;
    totalComplaints: number;
    activeAnnouncements: number;
  };
  outpassStatus: Array<{ _id: string; count: number }>;
  complaintStatus: Array<{ _id: string; count: number }>;
  studentsPerBlock: Array<{ _id: string; count: number }>;
  monthlyOutpassTrends: Array<{ _id: { year: number; month: number }; count: number }>;
  recentOutpasses: Outpass[];
  recentComplaints: Complaint[];
}
