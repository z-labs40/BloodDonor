export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type UserRole = 'user' | 'admin';

export type DonorStatus = 'pending' | 'verified' | 'rejected';

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
  name: string;
  bloodGroup: BloodGroup;
  department: string;
  year: string;
  phone: string;
  hostel: string;
  availability: boolean;
  status: DonorStatus;
  createdAt: string;
}

export interface EmergencyRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  bloodGroup: BloodGroup;
  message: string;
  status: 'open' | 'fulfilled' | 'closed';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
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

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];

export const HOSTELS = [
  'Boys Hostel A',
  'Boys Hostel B',
  'Boys Hostel C',
  'Girls Hostel A',
  'Girls Hostel B',
  'Day Scholar',
  'Off Campus',
];
