import { Donor, User, EmergencyRequest } from '@/types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Farhan Ahmed', email: 'farhan@campus.edu', role: 'user', createdAt: '2024-01-10' },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@campus.edu', role: 'user', createdAt: '2024-01-15' },
  { id: 'u3', name: 'Rahul Verma', email: 'rahul@campus.edu', role: 'user', createdAt: '2024-01-20' },
  { id: 'u4', name: 'Sneha Patel', email: 'sneha@campus.edu', role: 'user', createdAt: '2024-02-01' },
  { id: 'u5', name: 'Karthik Rajan', email: 'karthik@campus.edu', role: 'user', createdAt: '2024-02-10' },
  { id: 'u6', name: 'Anjali Singh', email: 'anjali@campus.edu', role: 'user', createdAt: '2024-02-15' },
  { id: 'u7', name: 'Mohammed Ali', email: 'ali@campus.edu', role: 'user', createdAt: '2024-02-20' },
  { id: 'u8', name: 'Deepika Nair', email: 'deepika@campus.edu', role: 'user', createdAt: '2024-03-01' },
  { id: 'admin1', name: 'Dr. Ramesh Kumar', email: 'admin@campus.edu', role: 'admin', createdAt: '2024-01-01' },
];

export const MOCK_DONORS: Donor[] = [
  {
    id: 'd1', userId: 'u1', name: 'Farhan Ahmed', bloodGroup: 'O+',
    department: 'Computer Science', year: '3rd Year', phone: '+91 98765 43210',
    hostel: 'Boys Hostel A', availability: true, status: 'verified', createdAt: '2024-01-12',
  },
  {
    id: 'd2', userId: 'u2', name: 'Priya Sharma', bloodGroup: 'A+',
    department: 'Information Technology', year: '2nd Year', phone: '+91 87654 32109',
    hostel: 'Girls Hostel A', availability: true, status: 'verified', createdAt: '2024-01-16',
  },
  {
    id: 'd3', userId: 'u3', name: 'Rahul Verma', bloodGroup: 'B+',
    department: 'Mechanical Engineering', year: '4th Year', phone: '+91 76543 21098',
    hostel: 'Boys Hostel B', availability: false, status: 'verified', createdAt: '2024-01-22',
  },
  {
    id: 'd4', userId: 'u4', name: 'Sneha Patel', bloodGroup: 'AB+',
    department: 'Biotechnology', year: '1st Year', phone: '+91 65432 10987',
    hostel: 'Girls Hostel B', availability: true, status: 'verified', createdAt: '2024-02-03',
  },
  {
    id: 'd5', userId: 'u5', name: 'Karthik Rajan', bloodGroup: 'O-',
    department: 'Electronics & Communication', year: '3rd Year', phone: '+91 54321 09876',
    hostel: 'Boys Hostel A', availability: true, status: 'verified', createdAt: '2024-02-12',
  },
  {
    id: 'd6', userId: 'u6', name: 'Anjali Singh', bloodGroup: 'A-',
    department: 'Civil Engineering', year: '2nd Year', phone: '+91 43210 98765',
    hostel: 'Girls Hostel A', availability: true, status: 'pending', createdAt: '2024-02-18',
  },
  {
    id: 'd7', userId: 'u7', name: 'Mohammed Ali', bloodGroup: 'B-',
    department: 'Electrical Engineering', year: '4th Year', phone: '+91 32109 87654',
    hostel: 'Boys Hostel C', availability: false, status: 'verified', createdAt: '2024-02-22',
  },
  {
    id: 'd8', userId: 'u8', name: 'Deepika Nair', bloodGroup: 'AB-',
    department: 'Management Studies', year: 'Postgraduate', phone: '+91 21098 76543',
    hostel: 'Girls Hostel B', availability: true, status: 'verified', createdAt: '2024-03-03',
  },
  {
    id: 'd9', userId: 'u9', name: 'Vikram Iyer', bloodGroup: 'O+',
    department: 'Computer Science', year: '1st Year', phone: '+91 90876 54321',
    hostel: 'Boys Hostel B', availability: true, status: 'verified', createdAt: '2024-03-08',
  },
  {
    id: 'd10', userId: 'u10', name: 'Meena Krishnan', bloodGroup: 'A+',
    department: 'Mathematics', year: '3rd Year', phone: '+91 89765 43210',
    hostel: 'Girls Hostel A', availability: false, status: 'rejected', createdAt: '2024-03-10',
  },
];

export const MOCK_EMERGENCY_REQUESTS: EmergencyRequest[] = [
  {
    id: 'er1', requesterId: 'u2', requesterName: 'Priya Sharma', bloodGroup: 'O-',
    message: 'Urgent need for O- blood for surgery at campus medical center. Please contact immediately.',
    status: 'open', createdAt: '2024-03-15',
  },
  {
    id: 'er2', requesterId: 'u5', requesterName: 'Karthik Rajan', bloodGroup: 'B+',
    message: 'Need B+ blood for a friend admitted in city hospital. Any donor please respond.',
    status: 'fulfilled', createdAt: '2024-03-10',
  },
  {
    id: 'er3', requesterId: 'u3', requesterName: 'Rahul Verma', bloodGroup: 'AB+',
    message: 'Emergency situation — AB+ required at the campus health center.',
    status: 'closed', createdAt: '2024-03-05',
  },
];
