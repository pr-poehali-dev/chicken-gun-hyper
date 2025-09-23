import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useAdmin } from '@/contexts/AdminContext';

const ADMIN_PASSWORD = "живой пингвин";

export default function AdminPanel() {
  const { isAdmin, setIsAdmin, adminCheats, setAdminCheats } = useAdmin();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogin = () => {
    if (password.toLowerCase() === ADMIN_PASSWORD.toLowerCase()) {
      setIsAdmin(true);
      setIsLoginOpen(false);
      setPassword('');
      setLoginError('');
    } else {
      setLoginError('Неверный пароль! 🐧');
      setTimeout(() => setLoginError(''), 3000);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminCheats({
      infiniteMoney: false,
      godMode: false,
      speedBoost: false,
      autoWin: false
    });
  };

  const toggleCheat = (cheat: keyof typeof adminCheats) => {
    setAdminCheats(prev => ({
      ...prev,
      [cheat]: !prev[cheat]
    }));
  };

  if (!isAdmin) {
    return (
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-4 right-4 w-12 h-12 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors z-50 border border-gray-600">
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
      <Card className="w-80 bg-gray-900/95 border-orange-500/50 backdrop-blur-sm">
        <div className="p-4 space-y-4">
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

          {/* Читы */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-orange-300">🎮 Игровые читы:</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => toggleCheat('infiniteMoney')}
                className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                  adminCheats.infiniteMoney
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                💰 Деньги
              </button>
              
              <button
                onClick={() => toggleCheat('godMode')}
                className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                  adminCheats.godMode
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🛡️ Бессмертие
              </button>
              
              <button
                onClick={() => toggleCheat('speedBoost')}
                className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                  adminCheats.speedBoost
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ⚡ Скорость
              </button>
              
              <button
                onClick={() => toggleCheat('autoWin')}
                className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                  adminCheats.autoWin
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🏆 Авто-победа
              </button>
            </div>
          </div>

          {/* Активные читы */}
          {Object.values(adminCheats).some(Boolean) && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-green-400">✅ Активные читы:</h4>
              <div className="text-xs space-y-1">
                {adminCheats.infiniteMoney && <div className="text-green-300">💰 Бесконечные деньги</div>}
                {adminCheats.godMode && <div className="text-yellow-300">🛡️ Режим бога</div>}
                {adminCheats.speedBoost && <div className="text-blue-300">⚡ Ускорение</div>}
                {adminCheats.autoWin && <div className="text-purple-300">🏆 Автопобеда</div>}
              </div>
            </div>
          )}

          {/* Дополнительные функции */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-orange-300">🔧 Функции:</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setAdminCheats({
                    infiniteMoney: true,
                    godMode: true,
                    speedBoost: true,
                    autoWin: true
                  });
                }}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                🔥 Все читы
              </button>
              
              <button
                onClick={() => {
                  setAdminCheats({
                    infiniteMoney: false,
                    godMode: false,
                    speedBoost: false,
                    autoWin: false
                  });
                }}
                className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                🚫 Сбросить
              </button>
            </div>
          </div>

          <div className="text-xs text-orange-400/60 text-center border-t border-gray-700 pt-2">
            Статус: Администратор 🐧
          </div>
        </div>
      </Card>
    </div>
  );
}