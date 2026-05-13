const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ─── Blood group mapping ─────────────────────────────────────────────────────
// Backend uses enum keys (A_POS), frontend displays labels (A+)
export const BG_TO_DISPLAY: Record<string, string> = {
  A_POS: 'A+', A_NEG: 'A-', B_POS: 'B+', B_NEG: 'B-',
  O_POS: 'O+', O_NEG: 'O-', AB_POS: 'AB+', AB_NEG: 'AB-',
};
export const DISPLAY_TO_BG: Record<string, string> = Object.fromEntries(
  Object.entries(BG_TO_DISPLAY).map(([k, v]) => [v, k])
);

// ─── Core fetch helper ────────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('blooddonor_token')
    : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message ?? `Request failed: ${res.status}`);
  }
  return json.data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}
export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    apiFetch<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  adminLogin: (email: string, password: string) =>
    apiFetch<AuthResponse>('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// ─── Donors ───────────────────────────────────────────────────────────────────
export interface ApiDonor {
  id: string;
  userId: string;
  user?: ApiUser;
  bloodGroup: string;       // enum key e.g. A_POS
  bloodGroupDisplay: string; // display label e.g. A+
  department: string;
  year: string;
  phone?: string;
  hostel: string;
  availability: boolean;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface DonorFilters {
  bloodGroup?: string;  // enum key
  department?: string;
  hostel?: string;
  year?: string;
  availability?: boolean;
}

export const donorApi = {
  getAll: (filters: DonorFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.bloodGroup) params.set('bloodGroup', filters.bloodGroup);
    if (filters.department) params.set('department', filters.department);
    if (filters.hostel) params.set('hostel', filters.hostel);
    if (filters.year) params.set('year', filters.year);
    if (filters.availability !== undefined)
      params.set('availability', String(filters.availability));
    const qs = params.toString();
    return apiFetch<ApiDonor[]>(`/api/donors${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) =>
    apiFetch<ApiDonor>(`/api/donors/${id}`),

  create: (data: {
    bloodGroup: string;
    department: string;
    year: string;
    phone: string;
    hostel: string;
    availability: boolean;
  }) =>
    apiFetch<ApiDonor>('/api/donors', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<{ availability: boolean; phone: string; hostel: string; bloodGroup: string; department: string; year: string }>) =>
    apiFetch<ApiDonor>(`/api/donors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    apiFetch<void>(`/api/donors/${id}`, { method: 'DELETE' }),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export interface AdminStats {
  totalDonors: number;
  verifiedDonors: number;
  pendingDonors: number;
  availableDonors: number;
  openEmergencies: number;
  donorsByBloodGroup: Record<string, number>;
}

export const adminApi = {
  getDonors: (status?: string) => {
    const qs = status ? `?status=${status}` : '';
    return apiFetch<ApiDonor[]>(`/api/admin/donors${qs}`);
  },

  updateDonorStatus: (donorId: string, status: 'VERIFIED' | 'REJECTED') =>
    apiFetch<ApiDonor>(`/api/admin/donors/${donorId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  deleteDonor: (donorId: string) =>
    apiFetch<void>(`/api/admin/donors/${donorId}`, { method: 'DELETE' }),

  getStats: () =>
    apiFetch<AdminStats>('/api/admin/stats'),

  getUsers: () =>
    apiFetch<ApiUser[]>('/api/admin/users'),
};

// ─── Emergency ────────────────────────────────────────────────────────────────
export interface ApiEmergency {
  id: string;
  requesterId: string;
  requester?: ApiUser;
  bloodGroup: string;
  bloodGroupDisplay: string;
  message?: string | null;
  status: 'OPEN' | 'FULFILLED' | 'CLOSED';
  createdAt: string;
}

export const emergencyApi = {
  getAll: () =>
    apiFetch<ApiEmergency[]>('/api/emergency'),

  create: (bloodGroup: string, message?: string) =>
    apiFetch<ApiEmergency>('/api/emergency', {
      method: 'POST',
      body: JSON.stringify({ bloodGroup, message }),
    }),

  updateStatus: (id: string, status: 'FULFILLED' | 'CLOSED') =>
    apiFetch<ApiEmergency>(`/api/emergency/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};
