import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  adminCheats: {
    infiniteMoney: boolean;
    godMode: boolean;
    speedBoost: boolean;
    autoWin: boolean;
  };
  setAdminCheats: React.Dispatch<React.SetStateAction<{
    infiniteMoney: boolean;
    godMode: boolean;
    speedBoost: boolean;
    autoWin: boolean;
  }>>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheats, setAdminCheats] = useState({
    infiniteMoney: false,
    godMode: false,
    speedBoost: false,
    autoWin: false
  });

  return (
    <AdminContext.Provider value={{
      isAdmin,
      setIsAdmin,
      adminCheats,
      setAdminCheats
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}