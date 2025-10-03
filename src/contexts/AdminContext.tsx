import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminCheats {
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
  doubleXP: boolean;
  tripleScore: boolean;
  unlockAll: boolean;
  infiniteHealth: boolean;
  infiniteEnergy: boolean;
  maxStats: boolean;
  instantCooldown: boolean;
  
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
  
  nitroBoost: boolean;
  perfectSteering: boolean;
  ghostCar: boolean;
  maxSpeed: boolean;
  infiniteFuel: boolean;
  autoRepair: boolean;
  
  autoSolve: boolean;
  hintMode: boolean;
  undoInfinite: boolean;
  timeBonus: boolean;
  skipLevel: boolean;
  
  maxLevel: boolean;
  infiniteMana: boolean;
  criticalHit: boolean;
  autoLoot: boolean;
  questComplete: boolean;
  merchantDiscount: boolean;
  
  infiniteLives: boolean;
  saveAnywhere: boolean;
  resourceMultiplier: boolean;
  buildSpeed: boolean;
  craftInstant: boolean;
  
  damageBoost: boolean;
  defenseBoost: boolean;
  speedHack: boolean;
  jumpHack: boolean;
  swimSpeed: boolean;
  
  espMode: boolean;
  radarHack: boolean;
  aimbot: boolean;
  recoilControl: boolean;
  penetrationShot: boolean;
  
  moonGravity: boolean;
  zeroGravity: boolean;
  superStrength: boolean;
  nightVision: boolean;
  thermalVision: boolean;
  
  unlimitedPower: boolean;
  energyShield: boolean;
  forceField: boolean;
  instantKill: boolean;
  massDestruction: boolean;
  
  weatherControl: boolean;
  dayNightCycle: boolean;
  spawnControl: boolean;
  enemyHealth: boolean;
  friendlyFire: boolean;
  
  autoAim: boolean;
  autoBlock: boolean;
  autoDodge: boolean;
  autoParry: boolean;
  autoCounter: boolean;
  
  bigHead: boolean;
  tinyMode: boolean;
  giantMode: boolean;
  rainbowMode: boolean;
  mirrorWorld: boolean;
  
  silentMovement: boolean;
  noFallDamage: boolean;
  waterBreathing: boolean;
  fireImmunity: boolean;
  poisonImmunity: boolean;
}

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  adminCheats: AdminCheats;
  setAdminCheats: React.Dispatch<React.SetStateAction<AdminCheats>>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheats, setAdminCheats] = useState<AdminCheats>({
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
    doubleXP: false,
    tripleScore: false,
    unlockAll: false,
    infiniteHealth: false,
    infiniteEnergy: false,
    maxStats: false,
    instantCooldown: false,
    
    megaMultiplier: false,
    autoClicker: false,
    instantUpgrades: false,
    goldenEggs: false,
    
    magneticField: false,
    slowMotion: false,
    shieldGenerator: false,
    scoreMultiplier: false,
    
    jumpBoost: false,
    wallHack: false,
    itemMagnet: false,
    healthRegen: false,
    
    infiniteAmmo: false,
    rapidFire: false,
    wallPenetration: false,
    enemyFreeze: false,
    
    nitroBoost: false,
    perfectSteering: false,
    ghostCar: false,
    maxSpeed: false,
    infiniteFuel: false,
    autoRepair: false,
    
    autoSolve: false,
    hintMode: false,
    undoInfinite: false,
    timeBonus: false,
    skipLevel: false,
    
    maxLevel: false,
    infiniteMana: false,
    criticalHit: false,
    autoLoot: false,
    questComplete: false,
    merchantDiscount: false,
    
    infiniteLives: false,
    saveAnywhere: false,
    resourceMultiplier: false,
    buildSpeed: false,
    craftInstant: false,
    
    damageBoost: false,
    defenseBoost: false,
    speedHack: false,
    jumpHack: false,
    swimSpeed: false,
    
    espMode: false,
    radarHack: false,
    aimbot: false,
    recoilControl: false,
    penetrationShot: false,
    
    moonGravity: false,
    zeroGravity: false,
    superStrength: false,
    nightVision: false,
    thermalVision: false,
    
    unlimitedPower: false,
    energyShield: false,
    forceField: false,
    instantKill: false,
    massDestruction: false,
    
    weatherControl: false,
    dayNightCycle: false,
    spawnControl: false,
    enemyHealth: false,
    friendlyFire: false,
    
    autoAim: false,
    autoBlock: false,
    autoDodge: false,
    autoParry: false,
    autoCounter: false,
    
    bigHead: false,
    tinyMode: false,
    giantMode: false,
    rainbowMode: false,
    mirrorWorld: false,
    
    silentMovement: false,
    noFallDamage: false,
    waterBreathing: false,
    fireImmunity: false,
    poisonImmunity: false
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