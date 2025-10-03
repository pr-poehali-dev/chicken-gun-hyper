import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  adminCheats: {
    // Универсальные читы
    infiniteMoney: boolean;
    godMode: boolean;
    speedBoost: boolean;
    autoWin: boolean;
    teleport: boolean;
    timeFreeze: boolean;
    xrayVision: boolean;
    invisibility: boolean;
    infiniteTime: boolean;
    noClip: boolean;
    superJump: boolean;
    flyMode: boolean;
    oneHitKill: boolean;
    
    // ChickenClicker читы
    megaMultiplier: boolean;
    autoClicker: boolean;
    instantUpgrades: boolean;
    goldenEggs: boolean;
    
    // SpaceCollector читы
    magneticField: boolean;
    slowMotion: boolean;
    shieldGenerator: boolean;
    scoreMultiplier: boolean;
    
    // WalkingGame читы
    jumpBoost: boolean;
    wallHack: boolean;
    itemMagnet: boolean;
    healthRegen: boolean;
    
    // DefenseGame читы
    infiniteAmmo: boolean;
    rapidFire: boolean;
    wallPenetration: boolean;
    enemyFreeze: boolean;
  };
  setAdminCheats: React.Dispatch<React.SetStateAction<{
    infiniteMoney: boolean;
    godMode: boolean;
    speedBoost: boolean;
    autoWin: boolean;
    teleport: boolean;
    timeFreeze: boolean;
    xrayVision: boolean;
    invisibility: boolean;
    infiniteTime: boolean;
    noClip: boolean;
    superJump: boolean;
    flyMode: boolean;
    oneHitKill: boolean;
    megaMultiplier: boolean;
    autoClicker: boolean;
    instantUpgrades: boolean;
    goldenEggs: boolean;
    magneticField: boolean;
    slowMotion: boolean;
    shieldGenerator: boolean;
    scoreMultiplier: boolean;
    jumpBoost: boolean;
    wallHack: boolean;
    itemMagnet: boolean;
    healthRegen: boolean;
    infiniteAmmo: boolean;
    rapidFire: boolean;
    wallPenetration: boolean;
    enemyFreeze: boolean;
  }>>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheats, setAdminCheats] = useState({
    // Универсальные читы
    infiniteMoney: false,
    godMode: false,
    speedBoost: false,
    autoWin: false,
    teleport: false,
    timeFreeze: false,
    xrayVision: false,
    invisibility: false,
    infiniteTime: false,
    noClip: false,
    superJump: false,
    flyMode: false,
    oneHitKill: false,
    
    // ChickenClicker читы
    megaMultiplier: false,
    autoClicker: false,
    instantUpgrades: false,
    goldenEggs: false,
    
    // SpaceCollector читы
    magneticField: false,
    slowMotion: false,
    shieldGenerator: false,
    scoreMultiplier: false,
    
    // WalkingGame читы
    jumpBoost: false,
    wallHack: false,
    itemMagnet: false,
    healthRegen: false,
    
    // DefenseGame читы
    infiniteAmmo: false,
    rapidFire: false,
    wallPenetration: false,
    enemyFreeze: false
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