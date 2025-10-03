import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SpaceCollector from '@/components/SpaceCollector';
import ChickenClicker from '@/components/ChickenClicker';
import WalkingGame from '@/components/WalkingGame';
import DefenseGame from '@/components/DefenseGame';
import RacingGame from '@/components/RacingGame';
import PuzzleGame from '@/components/PuzzleGame';
import RPGGame from '@/components/RPGGame';
import LiveChat from '@/components/LiveChat';
import SnakeGame from '@/components/SnakeGame';
import TetrisGame from '@/components/TetrisGame';
import FlappyBirdGame from '@/components/FlappyBirdGame';
import Game2048 from '@/components/Game2048';
import MemoryGame from '@/components/MemoryGame';
import AdminPanel from '@/components/AdminPanel';
import { AdminProvider } from '@/contexts/AdminContext';
import Icon from '@/components/ui/icon';

type GameType = string;

interface GameInfo {
  id: GameType;
  title: string;
  description: string;
  emoji: string;
  component?: React.ComponentType;
  category: string;
  color?: string;
  gameType?: 'clicker' | 'dodge' | 'collect' | 'memory' | 'reaction' | 'platformer';
  featured?: boolean;
}

const games: GameInfo[] = [
  { id: 'space', title: 'Космический Сбор', description: 'Собирай монеты в космосе!', emoji: '🚀', component: SpaceCollector, category: 'arcade', featured: true },
  { id: 'chicken', title: 'Куриная Империя', description: 'Строй куриную империю!', emoji: '🐔', component: ChickenClicker, category: 'clicker', featured: true },
  { id: 'walking', title: 'Исследователь', description: 'Исследуй 2D мир!', emoji: '🌍', component: WalkingGame, category: 'adventure', featured: true },
  { id: 'defense', title: 'Защитник', description: 'Защищай крепость!', emoji: '⚔️', component: DefenseGame, category: 'strategy', featured: true },
  { id: 'racing', title: 'Супер Гонки', description: 'Гоночные приключения!', emoji: '🏎️', component: RacingGame, category: 'racing', featured: true },
  { id: 'puzzle', title: 'Пятнашки', description: 'Классическая головоломка!', emoji: '🧩', component: PuzzleGame, category: 'puzzle', featured: true },
  { id: 'rpg', title: 'RPG Приключение', description: 'Сражайся с врагами!', emoji: '🗡️', component: RPGGame, category: 'rpg', featured: true },
  { id: 'chat', title: 'Живой Чат', description: 'Общайся онлайн!', emoji: '💬', component: LiveChat, category: 'social', featured: true },
  
  { id: 'snake', title: 'Змейка', description: 'Классическая змейка!', emoji: '🐍', component: SnakeGame, category: 'arcade', featured: true },
  { id: 'tetris', title: 'Тетрис', description: 'Собирай линии!', emoji: '🧱', component: TetrisGame, category: 'puzzle', featured: true },
  { id: 'flappy', title: 'Flappy Bird', description: 'Летай между труб!', emoji: '🐦', component: FlappyBirdGame, category: 'arcade', featured: true },
  { id: '2048', title: '2048', description: 'Собери плитку 2048!', emoji: '🎯', component: Game2048, category: 'puzzle', featured: true },
  { id: 'memory', title: 'Память', description: 'Найди пары карт!', emoji: '🎴', component: MemoryGame, category: 'memory', featured: true },
  

  
  { id: 'tower', title: 'Защита башни', description: 'Останови врагов!', emoji: '🏰', category: 'strategy', color: 'stone', gameType: 'clicker' },
  { id: 'cards', title: 'Пасьянс', description: 'Раскладывай карты!', emoji: '🃏', category: 'puzzle', color: 'red', gameType: 'memory' },
  { id: 'minesweeper', title: 'Сапер', description: 'Найди все мины!', emoji: '💣', category: 'puzzle', color: 'orange', gameType: 'memory' },
  { id: 'simon', title: 'Саймон', description: 'Повторяй цвета!', emoji: '🎨', category: 'memory', color: 'rainbow', gameType: 'memory' },
  { id: 'whack', title: 'Кротобой', description: 'Бей по кротам!', emoji: '🔨', category: 'arcade', color: 'brown', gameType: 'reaction' },
  
  { id: 'bubble', title: 'Пузыри', description: 'Лопай пузыри!', emoji: '🫧', category: 'arcade', color: 'cyan', gameType: 'clicker' },
  { id: 'fruit', title: 'Фруктовый ниндзя', description: 'Режь фрукты!', emoji: '🍉', category: 'arcade', color: 'red', gameType: 'reaction' },
  { id: 'jump', title: 'Прыгун', description: 'Прыгай выше!', emoji: '🦘', category: 'arcade', color: 'green', gameType: 'platformer' },
  { id: 'run', title: 'Бесконечный бег', description: 'Беги без остановки!', emoji: '🏃', category: 'arcade', color: 'blue', gameType: 'dodge' },
  { id: 'fly', title: 'Вертолет', description: 'Пролети через туннель!', emoji: '🚁', category: 'arcade', color: 'sky', gameType: 'dodge' },
  

  { id: 'word', title: 'Словарь', description: 'Собирай слова!', emoji: '📝', category: 'puzzle', color: 'blue', gameType: 'memory' },
  { id: 'math', title: 'Математика', description: 'Реши примеры!', emoji: '🔢', category: 'educational', color: 'green', gameType: 'memory' },
  { id: 'typing', title: 'Печатание', description: 'Научись печатать!', emoji: '⌨️', category: 'educational', color: 'gray', gameType: 'reaction' },
  { id: 'quiz', title: 'Викторина', description: 'Ответь на вопросы!', emoji: '❓', category: 'educational', color: 'yellow', gameType: 'memory' },
  
  { id: 'platformer', title: 'Платформер', description: 'Прыгай по платформам!', emoji: '🎮', category: 'platformer', color: 'orange', gameType: 'platformer' },
  { id: 'shooter', title: 'Шутер', description: 'Стреляй по врагам!', emoji: '🔫', category: 'action', color: 'red', gameType: 'reaction' },
  { id: 'fishing', title: 'Рыбалка', description: 'Лови рыбу!', emoji: '🎣', category: 'simulation', color: 'blue', gameType: 'clicker' },
  { id: 'farm', title: 'Ферма', description: 'Выращивай урожай!', emoji: '🌾', category: 'simulation', color: 'green', gameType: 'clicker' },
  { id: 'restaurant', title: 'Ресторан', description: 'Обслуживай клиентов!', emoji: '🍔', category: 'simulation', color: 'yellow', gameType: 'clicker' },
  
  { id: 'zoo', title: 'Зоопарк', description: 'Заботься о животных!', emoji: '🦁', category: 'simulation', color: 'orange', gameType: 'clicker' },
  { id: 'hotel', title: 'Отель', description: 'Управляй отелем!', emoji: '🏨', category: 'simulation', color: 'blue', gameType: 'clicker' },
  { id: 'hospital', title: 'Больница', description: 'Лечи пациентов!', emoji: '🏥', category: 'simulation', color: 'red', gameType: 'clicker' },
  { id: 'school', title: 'Школа', description: 'Управляй школой!', emoji: '🏫', category: 'simulation', color: 'purple', gameType: 'clicker' },
  { id: 'shop', title: 'Магазин', description: 'Продавай товары!', emoji: '🏪', category: 'simulation', color: 'green', gameType: 'clicker' },
  
  { id: 'ninja', title: 'Ниндзя', description: 'Стань ниндзя!', emoji: '🥷', category: 'action', color: 'black', gameType: 'platformer' },
  { id: 'pirate', title: 'Пират', description: 'Найди сокровища!', emoji: '🏴‍☠️', category: 'adventure', color: 'brown', gameType: 'collect' },
  { id: 'knight', title: 'Рыцарь', description: 'Спаси принцессу!', emoji: '🛡️', category: 'adventure', color: 'silver', gameType: 'platformer' },
  { id: 'wizard', title: 'Волшебник', description: 'Используй магию!', emoji: '🧙', category: 'rpg', color: 'purple', gameType: 'collect' },
  { id: 'robot', title: 'Робот', description: 'Спаси мир!', emoji: '🤖', category: 'action', color: 'gray', gameType: 'shooter' },
  
  { id: 'alien', title: 'Инопланетяне', description: 'Защити Землю!', emoji: '👽', category: 'action', color: 'green', gameType: 'shooter' },
  { id: 'zombie', title: 'Зомби', description: 'Выживай!', emoji: '🧟', category: 'action', color: 'red', gameType: 'shooter' },
  { id: 'dino', title: 'Динозавр', description: 'Беги и прыгай!', emoji: '🦕', category: 'arcade', color: 'green', gameType: 'dodge' },
  { id: 'penguin', title: 'Пингвин', description: 'Скользи по льду!', emoji: '🐧', category: 'arcade', color: 'cyan', gameType: 'dodge' },
  { id: 'cat', title: 'Кошка', description: 'Лови мышей!', emoji: '🐱', category: 'arcade', color: 'orange', gameType: 'reaction' },
  
  { id: 'dog', title: 'Собака', description: 'Лови фрисби!', emoji: '🐕', category: 'arcade', color: 'brown', gameType: 'reaction' },
  { id: 'bird', title: 'Птица', description: 'Летай свободно!', emoji: '🦅', category: 'arcade', color: 'blue', gameType: 'dodge' },
  { id: 'fish', title: 'Рыбка', description: 'Плыви в океане!', emoji: '🐠', category: 'arcade', color: 'cyan', gameType: 'dodge' },
  { id: 'bee', title: 'Пчела', description: 'Собирай нектар!', emoji: '🐝', category: 'arcade', color: 'yellow', gameType: 'collect' },
  { id: 'butterfly', title: 'Бабочка', description: 'Летай в саду!', emoji: '🦋', category: 'arcade', color: 'purple', gameType: 'collect' },
];

export default function Games() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', ...Array.from(new Set(games.map(g => g.category)))];

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedGameData = selectedGame ? games.find(g => g.id === selectedGame) : null;

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      all: '🎯 Все',
      arcade: '🎮 Аркады',
      strategy: '🧠 Стратегии',
      racing: '🏎️ Гонки',
      puzzle: '🧩 Головоломки',
      rpg: '🗡️ RPG',
      social: '👥 Социальные',
      clicker: '👆 Кликеры',
      adventure: '🗺️ Приключения',
      action: '⚔️ Экшен',
      simulation: '🏗️ Симуляторы',
      platformer: '🎯 Платформеры',
      memory: '🧠 Память',
      educational: '📚 Обучающие',
    };
    return labels[category] || category;
  };

  return (
    <AdminProvider>
      <div className="min-h-screen bg-gradient-to-br from-pixel-dark via-gray-900 to-pixel-dark">
        <div className="container mx-auto px-4 py-8">
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
              🎮 Игровая Аркада
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Коллекция классических и современных игр! 🚀
            </p>
            <p className="text-sm text-retro-orange/70 mt-2">
              13 полноценных игр + 46 мини-игр созданы @war_references с любовью! ❤️
            </p>
          </div>

          {selectedGame && selectedGameData ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  ← Назад к играм
                </button>
              </div>
              
              <div className="flex justify-center">
                {selectedGameData.component ? (
                  <selectedGameData.component />
                ) : (
                  <MiniGame 
                    id={selectedGameData.id}
                    title={selectedGameData.title}
                    emoji={selectedGameData.emoji}
                    color={selectedGameData.color || 'blue'}
                    gameType={selectedGameData.gameType || 'clicker'}
                  />
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Поиск игры..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-retro-orange/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-retro-orange"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all duration-300 text-xs ${
                      selectedCategory === category
                        ? 'bg-retro-orange text-white shadow-lg scale-105'
                        : 'bg-pixel-dark/50 text-retro-orange hover:bg-retro-orange/20 border border-retro-orange/30'
                    }`}
                  >
                    {getCategoryLabel(category)}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
                {filteredGames.map(game => (
                  <div
                    key={game.id}
                    onClick={() => setSelectedGame(game.id)}
                    className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                      game.featured ? 'ring-2 ring-retro-orange/50' : ''
                    }`}
                  >
                    <div className="bg-gradient-to-br from-pixel-dark/80 to-gray-900/80 border border-retro-orange/30 rounded-xl p-4 h-full hover:border-retro-orange/60 hover:shadow-xl hover:shadow-retro-orange/20">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-3xl">{game.emoji}</div>
                        {game.featured && (
                          <div className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">
                            ⭐
                          </div>
                        )}
                      </div>

                      <h3 className="font-orbitron text-sm text-retro-orange mb-1 group-hover:text-white transition-colors line-clamp-1">
                        {game.title}
                      </h3>

                      <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                        {game.description}
                      </p>

                      <div className="flex justify-center">
                        <div className="px-3 py-1 bg-retro-orange/20 group-hover:bg-retro-orange group-hover:text-white text-retro-orange rounded-lg font-semibold transition-all duration-300 text-xs">
                          🎮 Играть
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-xl text-gray-400">Игры не найдены</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-4 px-6 py-2 bg-retro-orange hover:bg-retro-orange/80 text-white rounded-lg font-semibold transition-colors"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}

              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-8 px-8 py-4 bg-pixel-dark/50 rounded-xl border border-retro-orange/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-retro-orange">{games.length}</div>
                    <div className="text-sm text-muted-foreground">Игр</div>
                  </div>
                  <div className="w-px h-12 bg-retro-orange/30"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-retro-orange">{categories.length - 1}</div>
                    <div className="text-sm text-muted-foreground">Категорий</div>
                  </div>
                  <div className="w-px h-12 bg-retro-orange/30"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-retro-orange">100%</div>
                    <div className="text-sm text-muted-foreground">Бесплатно</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <AdminPanel />
      </div>
    </AdminProvider>
  );
}