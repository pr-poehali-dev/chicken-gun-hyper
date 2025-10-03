import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';

interface Character {
  level: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  gold: number;
  exp: number;
  expToLevel: number;
}

interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  damage: number;
  reward: { gold: number; exp: number };
  emoji: string;
}

const ENEMIES: Enemy[] = [
  { name: 'Слизень', hp: 30, maxHp: 30, damage: 5, reward: { gold: 10, exp: 15 }, emoji: '🦠' },
  { name: 'Гоблин', hp: 50, maxHp: 50, damage: 10, reward: { gold: 25, exp: 30 }, emoji: '👺' },
  { name: 'Орк', hp: 80, maxHp: 80, damage: 15, reward: { gold: 50, exp: 60 }, emoji: '👹' },
  { name: 'Дракон', hp: 150, maxHp: 150, damage: 25, reward: { gold: 150, exp: 200 }, emoji: '🐉' },
];

export default function RPGGame() {
  const { adminCheats } = useAdmin();
  
  const [character, setCharacter] = useState<Character>({
    level: adminCheats.maxLevel ? 99 : 1,
    hp: 100,
    maxHp: 100,
    mana: adminCheats.infiniteMana ? 9999 : 50,
    maxMana: 50,
    gold: adminCheats.infiniteMoney ? 99999 : 0,
    exp: 0,
    expToLevel: 100,
  });

  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [inBattle, setInBattle] = useState(false);

  useEffect(() => {
    if (adminCheats.maxLevel) {
      setCharacter(c => ({ ...c, level: 99 }));
    }
    if (adminCheats.infiniteMoney) {
      setCharacter(c => ({ ...c, gold: 99999 }));
    }
    if (adminCheats.infiniteMana) {
      setCharacter(c => ({ ...c, mana: 9999, maxMana: 9999 }));
    }
  }, [adminCheats]);

  const startBattle = () => {
    const enemyIndex = Math.min(
      Math.floor(character.level / 3),
      ENEMIES.length - 1
    );
    const enemy = { ...ENEMIES[enemyIndex] };
    setCurrentEnemy(enemy);
    setInBattle(true);
    setBattleLog([`⚔️ Встреча с ${enemy.emoji} ${enemy.name}!`]);
  };

  const attack = () => {
    if (!currentEnemy) return;

    const isCrit = adminCheats.criticalHit || Math.random() < 0.2;
    const playerDamage = isCrit ? 30 : 15;
    
    const newEnemyHp = Math.max(0, currentEnemy.hp - playerDamage);
    const updatedEnemy = { ...currentEnemy, hp: newEnemyHp };

    setBattleLog(prev => [
      ...prev,
      `⚔️ Вы нанесли ${playerDamage} урона${isCrit ? ' (КРИТ!)' : ''}!`
    ]);

    if (newEnemyHp <= 0) {
      const goldReward = adminCheats.autoLoot ? updatedEnemy.reward.gold * 2 : updatedEnemy.reward.gold;
      const expReward = adminCheats.doubleXP ? updatedEnemy.reward.exp * 2 : updatedEnemy.reward.exp;

      setBattleLog(prev => [
        ...prev,
        `🎉 Победа! Получено ${goldReward} золота и ${expReward} опыта!`
      ]);

      setCharacter(c => {
        const newExp = c.exp + expReward;
        const newGold = c.gold + goldReward;
        let newLevel = c.level;
        let expToLevel = c.expToLevel;

        if (newExp >= c.expToLevel) {
          newLevel += 1;
          expToLevel = newLevel * 100;
          setBattleLog(prev => [...prev, `⭐ Уровень повышен до ${newLevel}!`]);
        }

        return {
          ...c,
          gold: newGold,
          exp: newExp >= c.expToLevel ? newExp - c.expToLevel : newExp,
          level: newLevel,
          expToLevel,
          hp: Math.min(c.maxHp, c.hp + 20),
        };
      });

      setTimeout(() => {
        setInBattle(false);
        setCurrentEnemy(null);
      }, 2000);
    } else {
      setCurrentEnemy(updatedEnemy);

      setTimeout(() => {
        const enemyDamage = adminCheats.godMode ? 0 : updatedEnemy.damage;
        if (enemyDamage > 0) {
          setBattleLog(prev => [
            ...prev,
            `💥 ${updatedEnemy.emoji} ${updatedEnemy.name} нанес ${enemyDamage} урона!`
          ]);

          setCharacter(c => {
            const newHp = Math.max(0, c.hp - enemyDamage);
            if (newHp <= 0) {
              setBattleLog(prev => [...prev, '💀 Вы проиграли бой!']);
              setTimeout(() => {
                setInBattle(false);
                setCurrentEnemy(null);
                setCharacter(prev => ({ ...prev, hp: prev.maxHp }));
              }, 2000);
            }
            return { ...c, hp: newHp };
          });
        }
      }, 1000);
    }
  };

  const heal = () => {
    if (character.mana >= 20 || adminCheats.infiniteMana) {
      setCharacter(c => ({
        ...c,
        hp: Math.min(c.maxHp, c.hp + 40),
        mana: adminCheats.infiniteMana ? c.mana : c.mana - 20,
      }));
      setBattleLog(prev => [...prev, '💚 Вы восстановили 40 HP!']);
    }
  };

  const buyPotion = () => {
    const cost = adminCheats.merchantDiscount ? 10 : 20;
    if (character.gold >= cost) {
      setCharacter(c => ({
        ...c,
        gold: c.gold - cost,
        maxHp: c.maxHp + 10,
        hp: c.hp + 10,
      }));
      setBattleLog(prev => [...prev, `🧪 Куплено зелье! +10 к макс. HP`]);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gray-900/95 border-indigo-500/50 p-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-400 mb-3">🗡️ RPG Приключение</h2>
        
        <div className="bg-gray-800 rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-400 font-semibold">Уровень {character.level}</span>
            <span className="text-yellow-400">💰 {character.gold}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">HP:</span>
              <div className="flex-1 bg-gray-700 rounded-full h-4">
                <div
                  className="bg-red-500 h-4 rounded-full transition-all"
                  style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-red-400">{character.hp}/{character.maxHp}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">MP:</span>
              <div className="flex-1 bg-gray-700 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all"
                  style={{ width: `${(character.mana / character.maxMana) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-blue-400">
                {adminCheats.infiniteMana ? '∞' : `${character.mana}/${character.maxMana}`}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">EXP:</span>
              <div className="flex-1 bg-gray-700 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all"
                  style={{ width: `${(character.exp / character.expToLevel) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-green-400">{character.exp}/{character.expToLevel}</span>
            </div>
          </div>
        </div>

        {adminCheats.criticalHit && (
          <div className="text-red-400 text-xs mb-1">💥 100% Критический урон</div>
        )}
        {adminCheats.autoLoot && (
          <div className="text-yellow-400 text-xs mb-1">💰 Двойное золото</div>
        )}
      </div>

      {inBattle && currentEnemy ? (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-4xl mb-2">{currentEnemy.emoji}</div>
            <h3 className="text-xl font-bold text-red-400 mb-2">{currentEnemy.name}</h3>
            <div className="flex items-center gap-2 justify-center">
              <div className="flex-1 max-w-xs bg-gray-700 rounded-full h-4">
                <div
                  className="bg-red-500 h-4 rounded-full transition-all"
                  style={{ width: `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-red-400">{currentEnemy.hp}/{currentEnemy.maxHp}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={attack}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              ⚔️ Атака
            </button>
            <button
              onClick={heal}
              disabled={character.mana < 20 && !adminCheats.infiniteMana}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              💚 Лечение
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 max-h-32 overflow-y-auto">
            {battleLog.map((log, i) => (
              <div key={i} className="text-xs text-gray-300 mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={startBattle}
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            ⚔️ Начать бой
          </button>

          <button
            onClick={buyPotion}
            disabled={character.gold < (adminCheats.merchantDiscount ? 10 : 20)}
            className="w-full px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors text-sm"
          >
            🧪 Купить зелье ({adminCheats.merchantDiscount ? '10' : '20'} золота)
          </button>
        </div>
      )}

      <div className="text-xs text-gray-400 text-center mt-3">
        Сражайся с врагами и прокачивай героя!
      </div>
    </Card>
  );
}