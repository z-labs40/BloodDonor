'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Donor, EmergencyRequest } from '@/types';
import { MOCK_DONORS, MOCK_EMERGENCY_REQUESTS } from '@/data/mockData';

interface DonorContextType {
  donors: Donor[];
  emergencyRequests: EmergencyRequest[];
  addDonor: (donor: Omit<Donor, 'id' | 'status' | 'createdAt'>) => void;
  updateDonorStatus: (donorId: string, status: Donor['status']) => void;
  removeDonor: (donorId: string) => void;
  addEmergencyRequest: (req: Omit<EmergencyRequest, 'id' | 'status' | 'createdAt'>) => void;
  updateRequestStatus: (reqId: string, status: EmergencyRequest['status']) => void;
  getDonorByUserId: (userId: string) => Donor | undefined;
}

const DonorContext = createContext<DonorContextType | null>(null);

export function DonorProvider({ children }: { children: ReactNode }) {
  const [donors, setDonors] = useState<Donor[]>(MOCK_DONORS);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>(MOCK_EMERGENCY_REQUESTS);

  const addDonor = (donorData: Omit<Donor, 'id' | 'status' | 'createdAt'>) => {
    const newDonor: Donor = {
      ...donorData,
      id: `d${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDonors(prev => [newDonor, ...prev]);
  };

  const updateDonorStatus = (donorId: string, status: Donor['status']) => {
    setDonors(prev => prev.map(d => d.id === donorId ? { ...d, status } : d));
  };

  const removeDonor = (donorId: string) => {
    setDonors(prev => prev.filter(d => d.id !== donorId));
  };

  const addEmergencyRequest = (reqData: Omit<EmergencyRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: EmergencyRequest = {
      ...reqData,
      id: `er${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEmergencyRequests(prev => [newReq, ...prev]);
  };

  const updateRequestStatus = (reqId: string, status: EmergencyRequest['status']) => {
    setEmergencyRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r));
  };

  const getDonorByUserId = (userId: string) => donors.find(d => d.userId === userId);

  return (
    <DonorContext.Provider value={{
      donors, emergencyRequests,
      addDonor, updateDonorStatus, removeDonor,
      addEmergencyRequest, updateRequestStatus, getDonorByUserId,
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
