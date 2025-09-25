import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useAdmin } from '@/contexts/AdminContext';

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
    setAdminCheats({
      infiniteMoney: true,
      godMode: true,
      speedBoost: true,
      autoWin: true,
      teleport: true,
      timeFreeze: true,
      xrayVision: true,
      megaMultiplier: true,
      autoClicker: true,
      instantUpgrades: true,
      goldenEggs: true,
      magneticField: true,
      slowMotion: true,
      shieldGenerator: true,
      scoreMultiplier: true,
      jumpBoost: true,
      wallHack: true,
      itemMagnet: true,
      healthRegen: true,
      infiniteAmmo: true,
      rapidFire: true,
      wallPenetration: true,
      enemyFreeze: true
    });
  };

  const disableAllCheats = () => {
    setAdminCheats({
      infiniteMoney: false,
      godMode: false,
      speedBoost: false,
      autoWin: false,
      teleport: false,
      timeFreeze: false,
      xrayVision: false,
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
      enemyFreeze: false
    });
  };

  const activeCheatsCount = Object.values(adminCheats).filter(Boolean).length;

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
              Введите пароль для доступа к административным функциям
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
      <Card className="w-96 bg-gray-900/95 border-orange-500/50 backdrop-blur-sm max-h-[80vh] overflow-y-auto">
        <div className="p-4 space-y-3">
          {/* Заголовок */}
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

          {/* Универсальные читы */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-orange-300">🎮 Универсальные читы:</h4>
            
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => toggleCheat('infiniteMoney')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.infiniteMoney
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                💰 Деньги
              </button>
              
              <button
                onClick={() => toggleCheat('godMode')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.godMode
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🛡️ Бессмертие
              </button>
              
              <button
                onClick={() => toggleCheat('speedBoost')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.speedBoost
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ⚡ Скорость
              </button>
              
              <button
                onClick={() => toggleCheat('autoWin')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.autoWin
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🏆 Победа
              </button>
              
              <button
                onClick={() => toggleCheat('teleport')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.teleport
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🌀 Телепорт
              </button>
              
              <button
                onClick={() => toggleCheat('timeFreeze')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.timeFreeze
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ⏸️ Пауза
              </button>
              
              <button
                onClick={() => toggleCheat('xrayVision')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.xrayVision
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                👁️ Рентген
              </button>
            </div>
          </div>

          {/* ChickenClicker читы */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-yellow-300">🐔 ChickenClicker:</h4>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => toggleCheat('megaMultiplier')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.megaMultiplier
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🚀 x50
              </button>
              
              <button
                onClick={() => toggleCheat('autoClicker')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.autoClicker
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🤖 Автоклик
              </button>
              
              <button
                onClick={() => toggleCheat('instantUpgrades')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.instantUpgrades
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ⚡ Улучшения
              </button>
              
              <button
                onClick={() => toggleCheat('goldenEggs')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.goldenEggs
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🥚 Золото
              </button>
            </div>
          </div>

          {/* SpaceCollector читы */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-blue-300">🚀 SpaceCollector:</h4>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => toggleCheat('magneticField')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.magneticField
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🧲 Магнит
              </button>
              
              <button
                onClick={() => toggleCheat('slowMotion')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.slowMotion
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🐌 Замедление
              </button>
              
              <button
                onClick={() => toggleCheat('shieldGenerator')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.shieldGenerator
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🛡️ Щит
              </button>
              
              <button
                onClick={() => toggleCheat('scoreMultiplier')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.scoreMultiplier
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📈 x5 Очки
              </button>
            </div>
          </div>

          {/* WalkingGame читы */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-green-300">🚶 WalkingGame:</h4>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => toggleCheat('jumpBoost')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.jumpBoost
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🦘 Прыжки
              </button>
              
              <button
                onClick={() => toggleCheat('wallHack')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.wallHack
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                👻 Нет стен
              </button>
              
              <button
                onClick={() => toggleCheat('itemMagnet')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.itemMagnet
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🧲 Предметы
              </button>
              
              <button
                onClick={() => toggleCheat('healthRegen')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.healthRegen
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                💚 Регенерация
              </button>
            </div>
          </div>

          {/* DefenseGame читы */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-red-300">⚔️ DefenseGame:</h4>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => toggleCheat('infiniteAmmo')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.infiniteAmmo
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ∞ Патроны
              </button>
              
              <button
                onClick={() => toggleCheat('rapidFire')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.rapidFire
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🔥 x3 Урон
              </button>
              
              <button
                onClick={() => toggleCheat('wallPenetration')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.wallPenetration
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🎯 Пробивание
              </button>
              
              <button
                onClick={() => toggleCheat('enemyFreeze')}
                className={`p-1.5 rounded text-xs font-semibold transition-all ${
                  adminCheats.enemyFreeze
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🧊 Заморозка
              </button>
            </div>
          </div>

          {/* Быстрые действия */}
          <div className="space-y-2">
            <div className="flex gap-1">
              <button
                onClick={enableAllCheats}
                className="flex-1 px-2 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition-colors"
              >
                ✅ Все
              </button>
              
              <button
                onClick={disableAllCheats}
                className="flex-1 px-2 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-colors"
              >
                ❌ Сбросить
              </button>
            </div>
            
            {/* Индикатор активных читов */}
            <div className="text-xs text-gray-400 text-center bg-gray-800 rounded p-2">
              Активно читов: <span className="text-orange-400 font-semibold">{activeCheatsCount}</span> из 23
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminPanel;