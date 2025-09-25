import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { soundSystem } from '@/utils/soundSystem';
import { useAdmin } from '@/contexts/AdminContext';

interface Upgrade {
  id: string;
  name: string;
  cost: number;
  multiplier: number;
  owned: number;
  description: string;
  icon: string;
}

const ChickenClicker: React.FC = () => {
  const { adminCheats } = useAdmin();
  const [eggs, setEggs] = useState(0);
  const [totalEggs, setTotalEggs] = useState(0);
  const [eggPerClick, setEggPerClick] = useState(1);
  const [eggPerSecond, setEggPerSecond] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [clickAnimation, setClickAnimation] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<Array<{id: number, value: number, x: number, y: number}>>([]);

  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 'feed',
      name: 'Корм',
      cost: 15,
      multiplier: 0.1,
      owned: 0,
      description: '+0.1 яйца/сек',
      icon: '🌾'
    },
    {
      id: 'nest',
      name: 'Гнездо',
      cost: 100,
      multiplier: 1,
      owned: 0,
      description: '+1 яйцо/сек',
      icon: '🪺'
    },
    {
      id: 'farm',
      name: 'Ферма',
      cost: 500,
      multiplier: 5,
      owned: 0,
      description: '+5 яиц/сек',
      icon: '🏚️'
    },
    {
      id: 'factory',
      name: 'Фабрика',
      cost: 2000,
      multiplier: 20,
      owned: 0,
      description: '+20 яиц/сек',
      icon: '🏭'
    }
  ]);

  // Auto egg generation
  useEffect(() => {
    if (eggPerSecond > 0) {
      const interval = setInterval(() => {
        setEggs(prev => prev + eggPerSecond / 10);
        setTotalEggs(prev => prev + eggPerSecond / 10);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [eggPerSecond]);

  // Calculate eggs per second based on upgrades
  useEffect(() => {
    const total = upgrades.reduce((sum, upgrade) => {
      return sum + (upgrade.owned * upgrade.multiplier);
    }, 0);
    setEggPerSecond(total);
  }, [upgrades]);

  const handleChickenClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Применяем различные читы
    let clickValue = eggPerClick;
    
    if (adminCheats.infiniteMoney) clickValue *= 1000;
    if (adminCheats.megaMultiplier) clickValue *= 50;
    if (adminCheats.goldenEggs && Math.random() < 0.3) clickValue *= 10; // 30% шанс золотого яйца
    
    setEggs(prev => prev + clickValue);
    setTotalEggs(prev => prev + clickValue);
    setClickAnimation(true);
    
    // Add floating text
    const newText = {
      id: Date.now(),
      value: clickValue,
      x,
      y
    };
    setFloatingTexts(prev => [...prev, newText]);
    
    // Remove floating text after animation
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(text => text.id !== newText.id));
    }, 1000);

    if (soundEnabled) {
      soundSystem.playRandomChickenSound();
    }

    setTimeout(() => setClickAnimation(false), 150);
  }, [eggPerClick, soundEnabled, adminCheats]);

  // Автоклик
  useEffect(() => {
    if (adminCheats.autoClicker) {
      const interval = setInterval(() => {
        let autoClickValue = eggPerClick * 5; // Автокликер в 5 раз слабее обычного клика
        if (adminCheats.megaMultiplier) autoClickValue *= 10;
        
        setEggs(prev => prev + autoClickValue);
        setTotalEggs(prev => prev + autoClickValue);
      }, 100); // 10 кликов в секунду
      
      return () => clearInterval(interval);
    }
  }, [adminCheats.autoClicker, eggPerClick, adminCheats.megaMultiplier]);

  const buyUpgrade = useCallback((upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || (!adminCheats.infiniteMoney && eggs < upgrade.cost)) return;

    if (!adminCheats.infiniteMoney && !adminCheats.instantUpgrades) {
      setEggs(prev => prev - upgrade.cost);
    }
    setUpgrades(prev => prev.map(u => {
      if (u.id === upgradeId) {
        return {
          ...u,
          owned: u.owned + 1,
          cost: Math.floor(u.cost * 1.15) // Price increases by 15%
        };
      }
      return u;
    }));

    if (soundEnabled) {
      soundSystem.playLevelUp();
    }
  }, [eggs, upgrades, soundEnabled]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return Math.floor(num).toString();
  };

  const getChickenSize = () => {
    if (totalEggs > 10000) return 'text-6xl';
    if (totalEggs > 1000) return 'text-5xl';
    if (totalEggs > 100) return 'text-4xl';
    return 'text-3xl';
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const resetGame = () => {
    setEggs(0);
    setTotalEggs(0);
    setEggPerClick(1);
    setUpgrades([
      {
        id: 'feed',
        name: 'Корм',
        cost: 15,
        multiplier: 0.1,
        owned: 0,
        description: '+0.1 яйца/сек',
        icon: '🌾'
      },
      {
        id: 'nest',
        name: 'Гнездо',
        cost: 100,
        multiplier: 1,
        owned: 0,
        description: '+1 яйцо/сек',
        icon: '🪺'
      },
      {
        id: 'farm',
        name: 'Ферма',
        cost: 500,
        multiplier: 5,
        owned: 0,
        description: '+5 яиц/сек',
        icon: '🏚️'
      },
      {
        id: 'factory',
        name: 'Фабрика',
        cost: 2000,
        multiplier: 20,
        owned: 0,
        description: '+20 яиц/сек',
        icon: '🏭'
      }
    ]);
    if (soundEnabled) {
      soundSystem.playGameStart();
    }
  };

  return (
    <Card className="bg-card/90 backdrop-blur border-yellow-500/30 p-6 w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-orbitron text-xl text-yellow-500 flex items-center gap-2">
            🐔 Куриная Империя
          </h3>
          <div className="flex gap-1">
            <Button
              onClick={toggleSound}
              variant="ghost"
              size="sm"
              className={`p-2 ${soundEnabled ? 'text-yellow-500' : 'text-muted-foreground'}`}
            >
              <Icon name={soundEnabled ? 'Volume2' : 'VolumeX'} size={16} />
            </Button>
            <Button
              onClick={resetGame}
              variant="ghost"
              size="sm"
              className="p-2 text-muted-foreground hover:text-red-400"
            >
              <Icon name="RotateCcw" size={16} />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="text-2xl font-bold text-yellow-400">
            🥚 {formatNumber(eggs)}
          </div>
          <div className="text-sm text-muted-foreground">
            Всего собрано: {formatNumber(totalEggs)} | {eggPerSecond.toFixed(1)} яиц/сек
          </div>
        </div>
      </div>

      {/* Chicken Clicker Area */}
      <div className="relative mb-6">
        <div 
          className={`relative mx-auto w-32 h-32 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${clickAnimation ? 'scale-110' : ''}`}
          onClick={handleChickenClick}
        >
          <div className={`${getChickenSize()} transition-all duration-300 drop-shadow-lg`}>
            🐔
          </div>
          
          {/* Floating numbers */}
          {floatingTexts.map(text => (
            <div
              key={text.id}
              className="absolute text-yellow-400 font-bold text-lg pointer-events-none animate-bounce"
              style={{
                left: `${text.x}%`,
                top: `${text.y}%`,
                transform: 'translate(-50%, -50%)',
                animation: 'float 1s ease-out forwards'
              }}
            >
              +{text.value}
            </div>
          ))}
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-2">
          Кликай по курице! (+{eggPerClick} за клик)
        </div>
      </div>

      {/* Upgrades */}
      <div className="space-y-3">
        <h4 className="font-orbitron text-lg text-yellow-500 text-center">Улучшения</h4>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {upgrades.map(upgrade => (
            <div
              key={upgrade.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                eggs >= upgrade.cost 
                  ? 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20 cursor-pointer' 
                  : 'bg-background/30 border-muted/30 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => buyUpgrade(upgrade.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{upgrade.icon}</span>
                <div>
                  <div className="font-medium text-sm">{upgrade.name}</div>
                  <div className="text-xs text-muted-foreground">{upgrade.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-yellow-400">{formatNumber(upgrade.cost)}</div>
                {upgrade.owned > 0 && (
                  <div className="text-xs text-green-400">x{upgrade.owned}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Author signature */}
      <div className="text-xs text-muted-foreground/60 text-center mt-4">
        Игра создана @war_references
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(-50%, -50%) translateY(0px);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translateY(-30px);
            opacity: 0;
          }
        }
      `}</style>
    </Card>
  );
};

export default ChickenClicker;