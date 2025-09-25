import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  effect: number;
  emoji: string;
}

interface Enemy {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  damage: number;
  emoji: string;
}

export default function DefenseGame() {
  const { adminCheats } = useAdmin();
  const [coins, setCoins] = useState(100);
  const [defense, setDefense] = useState(10);
  const [health, setHealth] = useState(100);
  const [maxHealth, setMaxHealth] = useState(100);
  const [wave, setWave] = useState(1);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'battle' | 'upgrade' | 'gameover'>('menu');
  const [battleLog, setBattleLog] = useState<string[]>([]);

  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 'armor',
      name: 'Броня',
      description: 'Увеличивает защиту',
      cost: 50,
      level: 0,
      maxLevel: 10,
      effect: 5,
      emoji: '🛡️'
    },
    {
      id: 'health',
      name: 'Здоровье',
      description: 'Увеличивает максимальное здоровье',
      cost: 30,
      level: 0,
      maxLevel: 15,
      effect: 20,
      emoji: '❤️'
    },
    {
      id: 'regen',
      name: 'Регенерация',
      description: 'Восстанавливает здоровье после боя',
      cost: 80,
      level: 0,
      maxLevel: 5,
      effect: 15,
      emoji: '💚'
    },
    {
      id: 'luck',
      name: 'Удача',
      description: 'Увеличивает количество монет',
      cost: 100,
      level: 0,
      maxLevel: 8,
      effect: 1.2,
      emoji: '🍀'
    }
  ]);

  // Генерация врага для текущей волны
  const generateEnemy = useCallback((waveNum: number): Enemy => {
    const enemyTypes = [
      { name: 'Гоблин', emoji: '👹', healthMod: 1, damageMod: 1 },
      { name: 'Орк', emoji: '👺', healthMod: 1.5, damageMod: 1.2 },
      { name: 'Тролль', emoji: '🧌', healthMod: 2, damageMod: 1.5 },
      { name: 'Дракон', emoji: '🐉', healthMod: 3, damageMod: 2 }
    ];

    const typeIndex = Math.min(Math.floor(waveNum / 3), enemyTypes.length - 1);
    const enemyType = enemyTypes[typeIndex];
    
    const baseHealth = 30 + (waveNum * 10);
    const baseDamage = 8 + (waveNum * 3);
    
    const health = Math.floor(baseHealth * enemyType.healthMod);
    const damage = Math.floor(baseDamage * enemyType.damageMod);

    return {
      id: `enemy-${waveNum}`,
      name: `${enemyType.name} ${waveNum} уровня`,
      health,
      maxHealth: health,
      damage,
      emoji: enemyType.emoji
    };
  }, []);

  // Покупка улучшения
  const buyUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.level >= upgrade.maxLevel || (!adminCheats.infiniteMoney && !adminCheats.infiniteAmmo && coins < upgrade.cost)) return;

    if (!adminCheats.infiniteMoney && !adminCheats.infiniteAmmo) {
      setCoins(prev => prev - upgrade.cost);
    }
    
    setUpgrades(prev => prev.map(u => {
      if (u.id === upgradeId) {
        const newLevel = u.level + 1;
        const newCost = Math.floor(u.cost * 1.5);
        
        // Применяем эффект улучшения
        if (upgradeId === 'armor') {
          setDefense(prevDef => prevDef + u.effect);
        } else if (upgradeId === 'health') {
          setMaxHealth(prevMax => {
            const newMax = prevMax + u.effect;
            setHealth(prevHealth => Math.min(prevHealth + u.effect, newMax));
            return newMax;
          });
        }
        
        return { ...u, level: newLevel, cost: newCost };
      }
      return u;
    }));
  };

  // Бой
  const battle = useCallback(() => {
    if (!currentEnemy) return;

    // Урон по врагу с читами
    let playerDamage = 15 + Math.floor(wave / 2);
    if (adminCheats.rapidFire) playerDamage *= 3; // Тройной урон
    if (adminCheats.wallPenetration) playerDamage *= 2; // Двойной урон за пробивание брони
    
    const newEnemyHealth = currentEnemy.health - playerDamage;
    
    setBattleLog(prev => [...prev, `🗡️ Ты наносишь ${playerDamage} урона!`].slice(-4));

    if (newEnemyHealth <= 0) {
      // Враг побежден
      const regenUpgrade = upgrades.find(u => u.id === 'regen');
      const luckUpgrade = upgrades.find(u => u.id === 'luck');
      
      const regenAmount = regenUpgrade ? regenUpgrade.level * regenUpgrade.effect : 0;
      const luckMultiplier = luckUpgrade ? Math.pow(luckUpgrade.effect, luckUpgrade.level) : 1;
      
      const baseReward = 20 + (wave * 5);
      const finalReward = Math.floor(baseReward * luckMultiplier);
      
      setCoins(prev => prev + finalReward);
      setHealth(prev => Math.min(maxHealth, prev + regenAmount));
      
      setBattleLog(prev => [...prev, 
        `🎉 Враг побежден! +${finalReward} монет`,
        regenAmount > 0 ? `💚 Восстановлено ${regenAmount} здоровья` : ''
      ].filter(Boolean).slice(-4));
      
      setTimeout(() => {
        setWave(prev => prev + 1);
        setGameState('upgrade');
        setBattleLog([]);
      }, 2000);
      return;
    }

    // Враг атакует
    setCurrentEnemy(prev => prev ? { ...prev, health: newEnemyHealth } : null);
    
    setTimeout(() => {
      if (!adminCheats.godMode && !adminCheats.enemyFreeze) {
        let actualDamage = Math.max(1, currentEnemy.damage - defense);
        
        // Читы влияющие на урон по игроку
        if (adminCheats.wallPenetration) actualDamage = Math.floor(actualDamage / 2); // Половина урона
        
        setHealth(prev => {
          const newHealth = prev - actualDamage;
          setBattleLog(prevLog => [...prevLog, `💥 ${currentEnemy.name} наносит ${actualDamage} урона!`].slice(-4));
          
          if (newHealth <= 0) {
            setTimeout(() => setGameState('gameover'), 1000);
          }
          
          return Math.max(0, newHealth);
        });
      } else if (adminCheats.enemyFreeze) {
        setBattleLog(prevLog => [...prevLog, `🧊 Враг заморожен!`].slice(-4));
      } else {
        setBattleLog(prevLog => [...prevLog, `🛡️ Урон заблокирован админом!`].slice(-4));
      }
    }, adminCheats.rapidFire ? 200 : 1000); // Быстрые атаки
  }, [currentEnemy, defense, wave, maxHealth, upgrades]);

  // Начать новую волну
  const startWave = () => {
    const enemy = generateEnemy(wave);
    setCurrentEnemy(enemy);
    setGameState('battle');
    setBattleLog([`⚔️ Волна ${wave}: ${enemy.name} появился!`]);
  };

  // Сброс игры
  const resetGame = () => {
    setCoins(100);
    setDefense(10);
    setHealth(100);
    setMaxHealth(100);
    setWave(1);
    setCurrentEnemy(null);
    setGameState('menu');
    setBattleLog([]);
    setUpgrades([
      { id: 'armor', name: 'Броня', description: 'Увеличивает защиту', cost: 50, level: 0, maxLevel: 10, effect: 5, emoji: '🛡️' },
      { id: 'health', name: 'Здоровье', description: 'Увеличивает максимальное здоровье', cost: 30, level: 0, maxLevel: 15, effect: 20, emoji: '❤️' },
      { id: 'regen', name: 'Регенерация', description: 'Восстанавливает здоровье после боя', cost: 80, level: 0, maxLevel: 5, effect: 15, emoji: '💚' },
      { id: 'luck', name: 'Удача', description: 'Увеличивает количество монет', cost: 100, level: 0, maxLevel: 8, effect: 1.2, emoji: '🍀' }
    ]);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-red-900/20 to-purple-900/20 border-red-500/30">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-red-400">⚔️ Защитник Крепости</h3>
        
        {/* Статистика игрока */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-yellow-400">💰 Монеты: {coins}</div>
          <div className="text-red-400">❤️ Здоровье: {health}/{maxHealth}</div>
          <div className="text-blue-400">🛡️ Защита: {defense}</div>
          <div className="text-purple-400">🌊 Волна: {wave}</div>
        </div>

        {/* Игровые экраны */}
        {gameState === 'menu' && (
          <div className="space-y-4">
            <p className="text-red-300">
              Защищай свою крепость от волн врагов! Прокачивай защиту и выживай как можно дольше.
            </p>
            <button
              onClick={() => setGameState('upgrade')}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              🎮 Начать защиту
            </button>
          </div>
        )}

        {gameState === 'upgrade' && (
          <div className="space-y-4">
            <h4 className="text-xl text-red-300">🏪 Магазин улучшений</h4>
            
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {upgrades.map(upgrade => (
                <div key={upgrade.id} className="p-4 bg-red-950/30 rounded-lg border border-red-500/30">
                  <div className="text-lg mb-2">
                    {upgrade.emoji} {upgrade.name} Ур.{upgrade.level}
                  </div>
                  <div className="text-sm text-red-300 mb-2">
                    {upgrade.description}
                  </div>
                  <div className="text-sm text-yellow-400 mb-3">
                    Стоимость: {upgrade.cost} монет
                  </div>
                  <button
                    onClick={() => buyUpgrade(upgrade.id)}
                    disabled={upgrade.level >= upgrade.maxLevel || coins < upgrade.cost}
                    className="w-full px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm"
                  >
                    {upgrade.level >= upgrade.maxLevel ? 'МАКС' : 'Купить'}
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={startWave}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              ⚔️ Начать волну {wave}
            </button>
          </div>
        )}

        {gameState === 'battle' && currentEnemy && (
          <div className="space-y-4">
            <h4 className="text-xl text-red-300">⚔️ Бой!</h4>
            
            {/* Враг */}
            <div className="p-4 bg-red-950/30 rounded-lg border border-red-500/30 max-w-md mx-auto">
              <div className="text-2xl mb-2">{currentEnemy.emoji}</div>
              <div className="text-lg text-red-300 mb-2">{currentEnemy.name}</div>
              <div className="w-full bg-red-900 rounded-full h-3 mb-2">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(currentEnemy.health / currentEnemy.maxHealth) * 100}%` }}
                />
              </div>
              <div className="text-sm text-red-400">
                ❤️ {currentEnemy.health}/{currentEnemy.maxHealth} | ⚔️ Урон: {currentEnemy.damage}
              </div>
            </div>

            {/* Лог боя */}
            <div className="bg-gray-900/50 rounded-lg p-3 max-w-md mx-auto">
              {battleLog.map((log, index) => (
                <div key={index} className="text-sm text-gray-300 mb-1">
                  {log}
                </div>
              ))}
            </div>
            
            {health > 0 && (
              <button
                onClick={battle}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                ⚔️ Атаковать!
              </button>
            )}
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="space-y-4">
            <h4 className="text-2xl text-red-400">💀 Крепость пала!</h4>
            <p className="text-red-300">Ты продержался {wave - 1} волн</p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              🔄 Защищать снова
            </button>
          </div>
        )}

        <div className="text-xs text-red-400/60 mt-4">
          Создано @war_references специально для тебя! 🚀
        </div>
      </div>
    </Card>
  );
}