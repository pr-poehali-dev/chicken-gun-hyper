import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useAdmin } from '@/contexts/AdminContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPanel: React.FC = () => {
  const { isAdmin, setIsAdmin, adminCheats, setAdminCheats } = useAdmin();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const correctPassword = 'живой пингвин';

  const handleLogin = () => {
    if (password.trim().toLowerCase() === correctPassword) {
      setIsAdmin(true);
      setPassword('');
      setLoginError('');
    } else {
      setLoginError('Неверный пароль! Попробуйте еще раз.');
      setTimeout(() => setLoginError(''), 2000);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setPassword('');
  };

  const toggleCheat = (cheatName: keyof typeof adminCheats) => {
    setAdminCheats(prev => ({
      ...prev,
      [cheatName]: !prev[cheatName]
    }));
  };

  const enableAllCheats = () => {
    const allCheats = Object.keys(adminCheats).reduce((acc, key) => {
      acc[key as keyof typeof adminCheats] = true;
      return acc;
    }, {} as typeof adminCheats);
    setAdminCheats(allCheats);
  };

  const disableAllCheats = () => {
    const allCheats = Object.keys(adminCheats).reduce((acc, key) => {
      acc[key as keyof typeof adminCheats] = false;
      return acc;
    }, {} as typeof adminCheats);
    setAdminCheats(allCheats);
  };

  const activeCheatsCount = Object.values(adminCheats).filter(Boolean).length;
  const totalCheatsCount = Object.keys(adminCheats).length;

  const CheatButton = ({ name, label, emoji, color = 'gray' }: { name: keyof typeof adminCheats; label: string; emoji: string; color?: string }) => (
    <button
      onClick={() => toggleCheat(name)}
      className={`p-1.5 rounded text-xs font-semibold transition-all ${
        adminCheats[name]
          ? `bg-${color}-600 text-white`
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {emoji} {label}
    </button>
  );

  if (!isAdmin) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-gray-800 hover:bg-gray-700 border border-orange-500 rounded-full flex items-center justify-center text-orange-400 hover:text-orange-300 transition-all shadow-lg">
            🔧
          </button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-center text-orange-400">🐧 Админ-панель</DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              Введите пароль для доступа к {totalCheatsCount} читам
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Введите пароль..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
            />
            
            {loginError && (
              <div className="text-red-400 text-sm text-center">
                {loginError}
              </div>
            )}
            
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
            >
              🔓 Войти
            </button>
            
            <div className="text-xs text-gray-500 text-center">
              Подсказка: это морское животное... 🐧
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-[450px] bg-gray-900/95 border-orange-500/50 backdrop-blur-sm max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-orange-400 flex items-center gap-2">
              🐧 Админ-панель
            </h3>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition-colors"
              title="Выйти"
            >
              <Icon name="LogOut" size={18} />
            </button>
          </div>
          
          <div className="flex gap-2 mt-2">
            <button
              onClick={enableAllCheats}
              className="flex-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition-colors"
            >
              ✅ Все {totalCheatsCount}
            </button>
            
            <button
              onClick={disableAllCheats}
              className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-colors"
            >
              ❌ Сбросить
            </button>
          </div>
          
          <div className="text-xs text-gray-400 text-center bg-gray-800 rounded p-1.5 mt-2">
            Активно: <span className="text-orange-400 font-semibold">{activeCheatsCount}</span> / {totalCheatsCount}
          </div>
        </div>

        <Tabs defaultValue="universal" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full grid grid-cols-5 bg-gray-800 p-1">
            <TabsTrigger value="universal" className="text-xs">🌟 Общие</TabsTrigger>
            <TabsTrigger value="games" className="text-xs">🎮 Игры</TabsTrigger>
            <TabsTrigger value="combat" className="text-xs">⚔️ Бой</TabsTrigger>
            <TabsTrigger value="physics" className="text-xs">🌀 Физика</TabsTrigger>
            <TabsTrigger value="fun" className="text-xs">🎪 Веселье</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-3">
            <TabsContent value="universal" className="space-y-3 mt-0">
              <div className="grid grid-cols-3 gap-1">
                <CheatButton name="infiniteMoney" label="Деньги" emoji="💰" color="green" />
                <CheatButton name="godMode" label="Бог" emoji="🛡️" color="yellow" />
                <CheatButton name="speedBoost" label="Скорость" emoji="⚡" color="blue" />
                <CheatButton name="autoWin" label="Победа" emoji="🏆" color="purple" />
                <CheatButton name="teleport" label="Телепорт" emoji="🌀" color="purple" />
                <CheatButton name="timeFreeze" label="Стоп" emoji="⏸️" color="cyan" />
                <CheatButton name="xrayVision" label="Рентген" emoji="👁️" color="pink" />
                <CheatButton name="invisibility" label="Невид" emoji="👤" color="indigo" />
                <CheatButton name="infiniteTime" label="∞ Время" emoji="⏰" color="amber" />
                <CheatButton name="noClip" label="NoClip" emoji="🌫️" color="violet" />
                <CheatButton name="superJump" label="Прыжок" emoji="🦘" color="lime" />
                <CheatButton name="flyMode" label="Полет" emoji="🕊️" color="sky" />
                <CheatButton name="oneHitKill" label="1 удар" emoji="💀" color="rose" />
                <CheatButton name="doubleXP" label="x2 XP" emoji="⭐" color="yellow" />
                <CheatButton name="tripleScore" label="x3 Очки" emoji="📊" color="green" />
                <CheatButton name="unlockAll" label="Открыть" emoji="🔓" color="orange" />
                <CheatButton name="infiniteHealth" label="∞ HP" emoji="❤️" color="red" />
                <CheatButton name="infiniteEnergy" label="∞ Энергия" emoji="⚡" color="yellow" />
                <CheatButton name="maxStats" label="Макс стат" emoji="📈" color="green" />
                <CheatButton name="instantCooldown" label="Без КД" emoji="🔄" color="blue" />
              </div>
            </TabsContent>

            <TabsContent value="games" className="space-y-3 mt-0">
              <div>
                <h4 className="text-xs font-semibold text-yellow-300 mb-1">🐔 ChickenClicker</h4>
                <div className="grid grid-cols-3 gap-1">
                  <CheatButton name="megaMultiplier" label="x50" emoji="🚀" color="yellow" />
                  <CheatButton name="autoClicker" label="Авто" emoji="🤖" color="orange" />
                  <CheatButton name="instantUpgrades" label="Прокачка" emoji="⚡" color="green" />
                  <CheatButton name="goldenEggs" label="Золото" emoji="🥚" color="yellow" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-blue-300 mb-1">🚀 SpaceCollector</h4>
                <div className="grid grid-cols-3 gap-1">
                  <CheatButton name="magneticField" label="Магнит" emoji="🧲" color="blue" />
                  <CheatButton name="slowMotion" label="Слоумо" emoji="🐌" color="purple" />
                  <CheatButton name="shieldGenerator" label="Щит" emoji="🛡️" color="cyan" />
                  <CheatButton name="scoreMultiplier" label="x5" emoji="📈" color="green" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-green-300 mb-1">🚶 WalkingGame</h4>
                <div className="grid grid-cols-3 gap-1">
                  <CheatButton name="jumpBoost" label="Прыжки" emoji="🦘" color="green" />
                  <CheatButton name="wallHack" label="Стены" emoji="👻" color="red" />
                  <CheatButton name="itemMagnet" label="Предметы" emoji="🧲" color="blue" />
                  <CheatButton name="healthRegen" label="Реген" emoji="💚" color="pink" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-red-300 mb-1">⚔️ DefenseGame</h4>
                <div className="grid grid-cols-3 gap-1">
                  <CheatButton name="infiniteAmmo" label="Патроны" emoji="∞" color="orange" />
                  <CheatButton name="rapidFire" label="x3 Урон" emoji="🔥" color="red" />
                  <CheatButton name="wallPenetration" label="Пробой" emoji="🎯" color="purple" />
                  <CheatButton name="enemyFreeze" label="Заморозка" emoji="🧊" color="cyan" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-purple-300 mb-1">🏎️ RacingGame</h4>
                <div className="grid grid-cols-3 gap-1">
                  <CheatButton name="nitroBoost" label="Нитро" emoji="💨" color="orange" />
                  <CheatButton name="perfectSteering" label="Руль" emoji="🎯" color="blue" />
                  <CheatButton name="ghostCar" label="Призрак" emoji="👻" color="purple" />
                  <CheatButton name="maxSpeed" label="Скорость" emoji="🚀" color="red" />
                  <CheatButton name="infiniteFuel" label="Топливо" emoji="⛽" color="green" />
                  <CheatButton name="autoRepair" label="Ремонт" emoji="🔧" color="yellow" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-pink-300 mb-1">🧩 PuzzleGame</h4>
                <div className="grid grid-cols-3 gap-1">
                  <CheatButton name="autoSolve" label="Решение" emoji="🧠" color="pink" />
                  <CheatButton name="hintMode" label="Подсказки" emoji="💡" color="yellow" />
                  <CheatButton name="undoInfinite" label="∞ Отмен" emoji="↩️" color="blue" />
                  <CheatButton name="timeBonus" label="Время" emoji="⏱️" color="green" />
                  <CheatButton name="skipLevel" label="Пропуск" emoji="⏭️" color="purple" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-indigo-300 mb-1">🗡️ RPGGame</h4>
                <div className="grid grid-cols-3 gap-1">
                  <CheatButton name="maxLevel" label="99 LVL" emoji="⬆️" color="purple" />
                  <CheatButton name="infiniteMana" label="∞ Мана" emoji="💙" color="blue" />
                  <CheatButton name="criticalHit" label="100% Крит" emoji="💥" color="red" />
                  <CheatButton name="autoLoot" label="Авто-лут" emoji="💰" color="yellow" />
                  <CheatButton name="questComplete" label="Квесты" emoji="✅" color="green" />
                  <CheatButton name="merchantDiscount" label="Скидка" emoji="🏪" color="orange" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-amber-300 mb-1">🏗️ BuilderGame</h4>
                <div className="grid grid-cols-3 gap-1">
                  <CheatButton name="infiniteLives" label="Жизни" emoji="💚" color="green" />
                  <CheatButton name="saveAnywhere" label="Сохранение" emoji="💾" color="blue" />
                  <CheatButton name="resourceMultiplier" label="x5 Ресурсы" emoji="📦" color="orange" />
                  <CheatButton name="buildSpeed" label="Стройка" emoji="⚡" color="yellow" />
                  <CheatButton name="craftInstant" label="Крафт" emoji="🔨" color="purple" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="combat" className="space-y-2 mt-0">
              <div className="grid grid-cols-3 gap-1">
                <CheatButton name="damageBoost" label="+500% Урон" emoji="⚔️" color="red" />
                <CheatButton name="defenseBoost" label="+500% Защита" emoji="🛡️" color="blue" />
                <CheatButton name="speedHack" label="Скорость x5" emoji="💨" color="cyan" />
                <CheatButton name="jumpHack" label="Прыжок x10" emoji="🦘" color="lime" />
                <CheatButton name="swimSpeed" label="Плавание" emoji="🏊" color="blue" />
                <CheatButton name="espMode" label="ESP" emoji="📡" color="purple" />
                <CheatButton name="radarHack" label="Радар" emoji="🎯" color="green" />
                <CheatButton name="aimbot" label="Аимбот" emoji="🎯" color="red" />
                <CheatButton name="recoilControl" label="Без отдачи" emoji="🔫" color="orange" />
                <CheatButton name="penetrationShot" label="Сквозной" emoji="💥" color="yellow" />
                <CheatButton name="autoAim" label="Авто-цель" emoji="🎯" color="red" />
                <CheatButton name="autoBlock" label="Авто-блок" emoji="🛡️" color="blue" />
                <CheatButton name="autoDodge" label="Увороты" emoji="🌀" color="cyan" />
                <CheatButton name="autoParry" label="Парирование" emoji="⚔️" color="purple" />
                <CheatButton name="autoCounter" label="Контратака" emoji="💥" color="red" />
              </div>
            </TabsContent>

            <TabsContent value="physics" className="space-y-2 mt-0">
              <div className="grid grid-cols-3 gap-1">
                <CheatButton name="moonGravity" label="Луна" emoji="🌙" color="gray" />
                <CheatButton name="zeroGravity" label="0G" emoji="🛸" color="purple" />
                <CheatButton name="superStrength" label="Сила" emoji="💪" color="red" />
                <CheatButton name="nightVision" label="Ночь" emoji="🌙" color="green" />
                <CheatButton name="thermalVision" label="Термо" emoji="🔥" color="orange" />
                <CheatButton name="unlimitedPower" label="∞ Мощь" emoji="⚡" color="yellow" />
                <CheatButton name="energyShield" label="Энерго-щит" emoji="🛡️" color="blue" />
                <CheatButton name="forceField" label="Силовое поле" emoji="🔵" color="cyan" />
                <CheatButton name="instantKill" label="Мгновенная смерть" emoji="💀" color="red" />
                <CheatButton name="massDestruction" label="Разрушение" emoji="💣" color="red" />
                <CheatButton name="weatherControl" label="Погода" emoji="⛈️" color="blue" />
                <CheatButton name="dayNightCycle" label="День/Ночь" emoji="🌓" color="purple" />
                <CheatButton name="spawnControl" label="Спавн" emoji="👾" color="green" />
                <CheatButton name="enemyHealth" label="HP врагов" emoji="❤️" color="red" />
                <CheatButton name="friendlyFire" label="Союзники" emoji="🤝" color="yellow" />
              </div>
            </TabsContent>

            <TabsContent value="fun" className="space-y-2 mt-0">
              <div className="grid grid-cols-3 gap-1">
                <CheatButton name="bigHead" label="Большая голова" emoji="🤯" color="orange" />
                <CheatButton name="tinyMode" label="Карликовый" emoji="🐜" color="green" />
                <CheatButton name="giantMode" label="Гигантский" emoji="🦖" color="purple" />
                <CheatButton name="rainbowMode" label="Радужный" emoji="🌈" color="pink" />
                <CheatButton name="mirrorWorld" label="Зеркальный мир" emoji="🪞" color="blue" />
                <CheatButton name="silentMovement" label="Тихий" emoji="🤫" color="gray" />
                <CheatButton name="noFallDamage" label="Без урона от падения" emoji="🪂" color="cyan" />
                <CheatButton name="waterBreathing" label="Дыхание под водой" emoji="🌊" color="blue" />
                <CheatButton name="fireImmunity" label="Огонь не страшен" emoji="🔥" color="red" />
                <CheatButton name="poisonImmunity" label="Яд не действует" emoji="☢️" color="green" />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminPanel;