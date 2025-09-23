import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SpaceCollector from '@/components/SpaceCollector';
import ChickenClicker from '@/components/ChickenClicker';
import WalkingGame from '@/components/WalkingGame';
import DefenseGame from '@/components/DefenseGame';
import LiveChat from '@/components/LiveChat';

type GameType = 'space' | 'chicken' | 'walking' | 'defense' | 'chat';

interface GameInfo {
  id: GameType;
  title: string;
  description: string;
  emoji: string;
  component: React.ComponentType;
  category: 'arcade' | 'strategy' | 'social';
}

const games: GameInfo[] = [
  {
    id: 'space',
    title: 'Космический Сбор',
    description: 'Собирай монеты, избегай бомб и устанавливай рекорды в космосе!',
    emoji: '🚀',
    component: SpaceCollector,
    category: 'arcade'
  },
  {
    id: 'chicken',
    title: 'Куриная Империя',
    description: 'Кликай по курице, покупай улучшения и строй куриную империю!',
    emoji: '🐔',
    component: ChickenClicker,
    category: 'strategy'
  },
  {
    id: 'walking',
    title: 'Исследователь Мира',
    description: 'Исследуй 2D мир, собирай предметы и следи за здоровьем!',
    emoji: '🌍',
    component: WalkingGame,
    category: 'arcade'
  },
  {
    id: 'defense',
    title: 'Защитник Крепости',
    description: 'Защищай крепость от волн врагов, прокачивай защиту!',
    emoji: '⚔️',
    component: DefenseGame,
    category: 'strategy'
  },
  {
    id: 'chat',
    title: 'Живой Чат',
    description: 'Общайся с другими игроками в реальном времени!',
    emoji: '💬',
    component: LiveChat,
    category: 'social'
  }
];

export default function Games() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'arcade' | 'strategy' | 'social'>('all');

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  const SelectedGameComponent = selectedGame ? games.find(g => g.id === selectedGame)?.component : null;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'arcade': return '🎮 Аркады';
      case 'strategy': return '🧠 Стратегии';
      case 'social': return '👥 Социальные';
      default: return '🎯 Все игры';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pixel-dark via-gray-900 to-pixel-dark">
      {/* Заголовок */}
      <div className="container mx-auto px-4 py-8">
        {/* Навигация */}
        <div className="flex justify-center mb-6">
          <Link 
            to="/"
            className="px-6 py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 border border-gray-600/50"
          >
            ← На главную
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-orbitron text-4xl md:text-5xl text-retro-orange mb-4">
            🎮 Игровая Вселенная
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Коллекция увлекательных игр созданных специально для тебя! 
            Выбери категорию и погрузись в мир развлечений! 🚀
          </p>
          <p className="text-sm text-retro-orange/70 mt-2">
            Все игры созданы @war_references с любовью! ❤️
          </p>
        </div>

        {/* Фильтры категорий */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {(['all', 'arcade', 'strategy', 'social'] as const).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-retro-orange text-white shadow-lg scale-105'
                  : 'bg-pixel-dark/50 text-retro-orange hover:bg-retro-orange/20 border border-retro-orange/30'
              }`}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>

        {/* Игра или сетка игр */}
        {selectedGame && SelectedGameComponent ? (
          <div className="space-y-6">
            {/* Кнопка назад */}
            <div className="flex justify-center">
              <button
                onClick={() => setSelectedGame(null)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                ← Назад к играм
              </button>
            </div>
            
            {/* Выбранная игра */}
            <div className="flex justify-center">
              <SelectedGameComponent />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredGames.map(game => (
              <div
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="bg-gradient-to-br from-pixel-dark/80 to-gray-900/80 border border-retro-orange/30 rounded-xl p-6 h-full hover:border-retro-orange/60 hover:shadow-xl hover:shadow-retro-orange/20">
                  {/* Иконка категории */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl mb-2">{game.emoji}</div>
                    <div className="text-xs px-2 py-1 bg-retro-orange/20 text-retro-orange rounded-full">
                      {getCategoryLabel(game.category).replace(/🎮|🧠|👥|🎯/, '').trim()}
                    </div>
                  </div>

                  {/* Название */}
                  <h3 className="font-orbitron text-xl text-retro-orange mb-2 group-hover:text-white transition-colors">
                    {game.title}
                  </h3>

                  {/* Описание */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {game.description}
                  </p>

                  {/* Кнопка играть */}
                  <div className="flex justify-center">
                    <div className="px-4 py-2 bg-retro-orange/20 group-hover:bg-retro-orange group-hover:text-white text-retro-orange rounded-lg font-semibold transition-all duration-300 text-sm">
                      🎮 Играть
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Статистика */}
        {!selectedGame && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-8 px-8 py-4 bg-pixel-dark/50 rounded-xl border border-retro-orange/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-orange">{games.length}</div>
                <div className="text-sm text-muted-foreground">Игр доступно</div>
              </div>
              <div className="w-px h-12 bg-retro-orange/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-orange">∞</div>
                <div className="text-sm text-muted-foreground">Часов веселья</div>
              </div>
              <div className="w-px h-12 bg-retro-orange/30"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-orange">100%</div>
                <div className="text-sm text-muted-foreground">Бесплатно</div>
              </div>
            </div>
          </div>
        )}

        {/* Призыв к действию */}
        {!selectedGame && (
          <div className="mt-12 text-center space-y-4">
            <h2 className="font-orbitron text-2xl text-retro-orange">
              🌟 Готов к приключениям?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Выбери игру и окунись в увлекательный мир развлечений! 
              Каждая игра уникальна и создана с особой любовью к деталям.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm">
                ✅ Без регистрации
              </div>
              <div className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm">
                🎮 Мгновенный запуск
              </div>
              <div className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg text-sm">
                🚀 Новые игры регулярно
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}