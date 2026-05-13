'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Donor, EmergencyRequest } from '@/types';
import { donorApi, adminApi, emergencyApi, ApiDonor, ApiEmergency, BG_TO_DISPLAY, DISPLAY_TO_BG } from '@/utils/api';
import { useAuth } from './AuthContext';

// ─── Mapping helpers ──────────────────────────────────────────────────────────
function mapDonor(d: ApiDonor): Donor {
  return {
    id: d.id,
    userId: d.userId,
    user: d.user,
    bloodGroup: (d.bloodGroupDisplay ?? BG_TO_DISPLAY[d.bloodGroup] ?? d.bloodGroup) as Donor['bloodGroup'],
    bloodGroupDisplay: d.bloodGroupDisplay,
    department: d.department,
    year: d.year,
    phone: d.phone,
    hostel: d.hostel,
    availability: d.availability,
    status: d.status as Donor['status'],
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

function mapEmergency(r: ApiEmergency): EmergencyRequest {
  return {
    id: r.id,
    requesterId: r.requesterId,
    requester: r.requester,
    requesterName: r.requester?.name ?? '',
    bloodGroup: (r.bloodGroupDisplay ?? BG_TO_DISPLAY[r.bloodGroup] ?? r.bloodGroup) as EmergencyRequest['bloodGroup'],
    bloodGroupDisplay: r.bloodGroupDisplay,
    message: r.message,
    status: r.status,
    createdAt: r.createdAt,
  };
}

// ─── Context interface ────────────────────────────────────────────────────────
interface DonorContextType {
  // public data
  donors: Donor[];
  emergencyRequests: EmergencyRequest[];
  donorsLoading: boolean;
  emergencyLoading: boolean;

  // public actions
  fetchDonors: (filters?: Parameters<typeof donorApi.getAll>[0]) => Promise<void>;
  fetchEmergencies: () => Promise<void>;
  getDonorByUserId: (userId: string) => Donor | undefined;

  // user donor profile
  myDonorProfile: Donor | null;
  fetchMyProfile: () => Promise<void>;
  registerDonor: (data: {
    bloodGroup: string;   // display label e.g. "A+"
    department: string;
    year: string;
    phone: string;
    hostel: string;
    availability: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
  updateMyProfile: (donorId: string, data: Partial<{
    availability: boolean; phone: string; hostel: string;
  }>) => Promise<{ success: boolean; error?: string }>;
  deleteMyProfile: (donorId: string) => Promise<{ success: boolean; error?: string }>;

  // admin actions
  adminDonors: Donor[];
  adminStats: { totalDonors: number; verifiedDonors: number; pendingDonors: number; availableDonors: number; openEmergencies: number; donorsByBloodGroup: Record<string, number> } | null;
  fetchAdminDonors: (status?: string) => Promise<void>;
  fetchAdminStats: () => Promise<void>;
  updateDonorStatus: (donorId: string, status: 'VERIFIED' | 'REJECTED') => Promise<void>;
  removeDonor: (donorId: string) => Promise<void>;
  updateRequestStatus: (reqId: string, status: 'FULFILLED' | 'CLOSED') => Promise<void>;
  addEmergencyRequest: (bloodGroupDisplay: string, message?: string) => Promise<{ success: boolean; error?: string }>;
}

const DonorContext = createContext<DonorContextType | null>(null);

export function DonorProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [donors, setDonors] = useState<Donor[]>([]);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [adminDonors, setAdminDonors] = useState<Donor[]>([]);
  const [adminStats, setAdminStats] = useState<DonorContextType['adminStats']>(null);
  const [myDonorProfile, setMyDonorProfile] = useState<Donor | null>(null);
  const [donorsLoading, setDonorsLoading] = useState(false);
  const [emergencyLoading, setEmergencyLoading] = useState(false);

  // ── Public: fetch verified donors ──
  const fetchDonors = useCallback(async (filters: Parameters<typeof donorApi.getAll>[0] = {}) => {
    setDonorsLoading(true);
    try {
      const data = await donorApi.getAll(filters);
      setDonors(data.map(mapDonor));
    } catch { /* silent */ }
    finally { setDonorsLoading(false); }
  }, []);

  // ── Public: fetch emergency requests ──
  const fetchEmergencies = useCallback(async () => {
    setEmergencyLoading(true);
    try {
      const data = await emergencyApi.getAll();
      setEmergencyRequests(data.map(mapEmergency));
    } catch { /* silent */ }
    finally { setEmergencyLoading(false); }
  }, []);

  // ── User: fetch own donor profile ──
  const fetchMyProfile = useCallback(async () => {
    if (!user) return;
    try {
      // Get all admin donors to find this user's profile
      const all = await donorApi.getAll({});
      // The user's own profile might be pending; fetch from admin if admin, else check public list
      // We'll use a trick: try getAll and find by userId
      // (backend returns userId in the donor object)
      const found = all.find(d => d.userId === user.id);
      setMyDonorProfile(found ? mapDonor(found) : null);
    } catch {
      setMyDonorProfile(null);
    }
  }, [user]);

  // ── User: register as donor ──
  const registerDonor = async (data: {
    bloodGroup: string; department: string; year: string;
    phone: string; hostel: string; availability: boolean;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const apiBloodGroup = DISPLAY_TO_BG[data.bloodGroup] ?? data.bloodGroup;
      const created = await donorApi.create({ ...data, bloodGroup: apiBloodGroup });
      setMyDonorProfile(mapDonor(created));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message ?? 'Registration failed.' };
    }
  };

  // ── User: update own donor profile ──
  const updateMyProfile = async (
    donorId: string,
    data: Partial<{ availability: boolean; phone: string; hostel: string }>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const updated = await donorApi.update(donorId, data);
      setMyDonorProfile(mapDonor(updated));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message ?? 'Update failed.' };
    }
  };

  // ── User: delete own donor profile ──
  const deleteMyProfile = async (donorId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await donorApi.delete(donorId);
      setMyDonorProfile(null);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message ?? 'Delete failed.' };
    }
  };

  // ── Admin: fetch all donors ──
  const fetchAdminDonors = useCallback(async (status?: string) => {
    try {
      const data = await adminApi.getDonors(status);
      setAdminDonors(data.map(mapDonor));
    } catch { /* silent */ }
  }, []);

  // ── Admin: fetch stats ──
  const fetchAdminStats = useCallback(async () => {
    try {
      const data = await adminApi.getStats();
      setAdminStats(data);
    } catch { /* silent */ }
  }, []);

  // ── Admin: update donor status ──
  const updateDonorStatus = async (donorId: string, status: 'VERIFIED' | 'REJECTED') => {
    await adminApi.updateDonorStatus(donorId, status);
    setAdminDonors(prev =>
      prev.map(d => d.id === donorId ? { ...d, status } : d)
    );
    if (adminStats) {
      await fetchAdminStats();
    }
  };

  // ── Admin: remove donor ──
  const removeDonor = async (donorId: string) => {
    await adminApi.deleteDonor(donorId);
    setAdminDonors(prev => prev.filter(d => d.id !== donorId));
    if (adminStats) await fetchAdminStats();
  };

  // ── Admin/User: update emergency status ──
  const updateRequestStatus = async (reqId: string, status: 'FULFILLED' | 'CLOSED') => {
    await emergencyApi.updateStatus(reqId, status);
    setEmergencyRequests(prev =>
      prev.map(r => r.id === reqId ? { ...r, status } : r)
    );
  };

  // ── User: post emergency request ──
  const addEmergencyRequest = async (
    bloodGroupDisplay: string,
    message?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const apiBloodGroup = DISPLAY_TO_BG[bloodGroupDisplay] ?? bloodGroupDisplay;
      const created = await emergencyApi.create(apiBloodGroup, message);
      setEmergencyRequests(prev => [mapEmergency(created), ...prev]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message ?? 'Failed to post emergency.' };
    }
  };

  const getDonorByUserId = (userId: string) =>
    donors.find(d => d.userId === userId) ?? adminDonors.find(d => d.userId === userId);

  // Load public data on mount
  useEffect(() => {
    fetchDonors();
    fetchEmergencies();
  }, [fetchDonors, fetchEmergencies]);

  // Load user's own profile when user logs in
  useEffect(() => {
    if (user) fetchMyProfile();
    else setMyDonorProfile(null);
  }, [user, fetchMyProfile]);

  return (
    <DonorContext.Provider value={{
      donors, emergencyRequests, donorsLoading, emergencyLoading,
      fetchDonors, fetchEmergencies, getDonorByUserId,
      myDonorProfile, fetchMyProfile, registerDonor, updateMyProfile, deleteMyProfile,
      adminDonors, adminStats,
      fetchAdminDonors, fetchAdminStats,
      updateDonorStatus, removeDonor, updateRequestStatus, addEmergencyRequest,
    }}>
      {children}
    </DonorContext.Provider>
  );
}

export function useDonors() {
  const ctx = useContext(DonorContext);
  if (!ctx) throw new Error('useDonors must be used within DonorProvider');
  return ctx;
}
