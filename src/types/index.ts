// Display labels used in UI
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type UserRole = 'USER' | 'ADMIN';

export type DonorStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Donor {
  id: string;
  userId: string;
  user?: User;
  bloodGroup: BloodGroup;
  bloodGroupDisplay?: string;
  department: string;
  year: string;
  phone?: string;
  hostel: string;
  availability: boolean;
  status: DonorStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface EmergencyRequest {
  id: string;
  requesterId: string;
  requester?: User;
  requesterName?: string;
  bloodGroup: BloodGroup;
  bloodGroupDisplay?: string;
  message?: string | null;
  status: 'OPEN' | 'FULFILLED' | 'CLOSED';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Management Studies',
];

export const YEARS = ['1st', '2nd', '3rd', '4th', 'Postgraduate'];

export const HOSTELS = [
  'Block A',
  'Block B',
  'Block C',
  'Block D',
  'Girls Hostel A',
  'Girls Hostel B',
  'Day Scholar',
  'Off Campus',
];
