import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
  color: string;
}

interface User {
  username: string;
  color: string;
  isOnline: boolean;
  lastSeen?: Date;
}

const RANDOM_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
  '#DDA0DD', '#FF7F50', '#87CEEB', '#98FB98', '#F0E68C'
];

const BOT_RESPONSES = [
  "Интересно! 🤔",
  "Согласен! 👍",
  "А что думаете об этом? 🤨",
  "Отличная мысль! ✨",
  "Расскажите подробнее 😊",
  "Круто! 🔥",
  "Понятно! 💡",
  "Хм, интересно... 🧐",
  "Полностью поддерживаю! 🙌",
  "Спасибо за информацию! 😇"
];

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userColor, setUserColor] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Симуляция онлайн пользователей
  useEffect(() => {
    if (!isLoggedIn) return;

    const botUsers = [
      'АстроБот', 'КосмоДруг', 'СтарГеймер', 'НебоХод', 
      'РакетаПро', 'ГалактикаМен', 'ОрбитаФан'
    ];

    const generateOnlineUsers = () => {
      const activeUsers = botUsers
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 4) + 2)
        .map(name => ({
          username: name,
          color: RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)],
          isOnline: true
        }));

      // Добавляем текущего пользователя
      activeUsers.push({
        username,
        color: userColor,
        isOnline: true
      });

      setOnlineUsers(activeUsers);
    };

    generateOnlineUsers();
    const interval = setInterval(generateOnlineUsers, 30000); // Обновляем каждые 30 секунд

    return () => clearInterval(interval);
  }, [isLoggedIn, username, userColor]);

  // Симуляция случайных сообщений от ботов
  useEffect(() => {
    if (!isLoggedIn) return;

    const botMessages = [
      "Привет всем! 👋",
      "Кто играл в новые игры? 🎮",
      "Отличный сайт получился! 🚀",
      "Какая ваша любимая игра здесь? 🤔",
      "Кто-нибудь прошел все уровни? 💪",
      "Круто что есть чат! 😊",
      "Астронавт Юра лучший! 🚀",
      "Играем вместе? 🎯"
    ];

    const sendRandomBotMessage = () => {
      const activeBots = onlineUsers.filter(u => u.username !== username && u.isOnline);
      if (activeBots.length === 0) return;

      const randomBot = activeBots[Math.floor(Math.random() * activeBots.length)];
      const randomMessage = botMessages[Math.floor(Math.random() * botMessages.length)];

      const newMessage: Message = {
        id: Date.now().toString(),
        username: randomBot.username,
        text: randomMessage,
        timestamp: new Date(),
        color: randomBot.color
      };

      setMessages(prev => [...prev, newMessage]);
    };

    // Первое сообщение через 3-8 секунд после входа
    const firstTimeout = setTimeout(sendRandomBotMessage, Math.random() * 5000 + 3000);
    
    // Затем каждые 10-30 секунд
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% шанс
        sendRandomBotMessage();
      }
    }, Math.random() * 20000 + 10000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, [isLoggedIn, onlineUsers, username]);

  // Симуляция печатания
  const simulateTyping = (username: string) => {
    setIsTyping(prev => [...prev, username]);
    setTimeout(() => {
      setIsTyping(prev => prev.filter(u => u !== username));
    }, 2000);
  };

  // Вход в чат
  const login = () => {
    if (!username.trim()) return;
    
    const color = RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
    setUserColor(color);
    setIsLoggedIn(true);

    // Добавляем системное сообщение о входе
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      username: 'Система',
      text: `${username} присоединился к чату! 🎉`,
      timestamp: new Date(),
      color: '#888888'
    };

    setMessages([welcomeMessage]);
  };

  // Отправка сообщения
  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      username,
      text: currentMessage,
      timestamp: new Date(),
      color: userColor
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');

    // Симуляция ответа бота через 2-5 секунд
    setTimeout(() => {
      const activeBots = onlineUsers.filter(u => u.username !== username);
      if (activeBots.length === 0) return;

      const randomBot = activeBots[Math.floor(Math.random() * activeBots.length)];
      simulateTyping(randomBot.username);

      setTimeout(() => {
        const response = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          username: randomBot.username,
          text: response,
          timestamp: new Date(),
          color: randomBot.color
        };
        setMessages(prev => [...prev, botMessage]);
      }, 2000);
    }, Math.random() * 3000 + 2000);
  };

  // Обработка Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Форматирование времени
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isLoggedIn) {
    return (
      <Card className="p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-blue-400">💬 Живой Чат</h3>
          <p className="text-blue-300">
            Общайся с другими посетителями сайта в реальном времени!
          </p>
          
          <div className="max-w-md mx-auto space-y-4">
            <input
              type="text"
              placeholder="Введи своё имя..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && login()}
              className="w-full px-4 py-2 bg-blue-950/50 border border-blue-500/50 rounded-lg text-white placeholder-blue-300/70 focus:outline-none focus:border-blue-400"
              maxLength={20}
            />
            <button
              onClick={login}
              disabled={!username.trim()}
              className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              🚀 Войти в чат
            </button>
          </div>

          <div className="text-xs text-blue-400/60 mt-4">
            Создано @war_references специально для тебя! 🚀
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-blue-400">💬 Живой Чат</h3>
          <div className="flex items-center gap-2 text-sm text-blue-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {onlineUsers.length} онлайн
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {/* Список онлайн пользователей */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-semibold text-blue-300 mb-2">👥 Онлайн</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {onlineUsers.map((user, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: user.color }}
                  ></div>
                  <span className="text-gray-300 truncate">
                    {user.username}
                    {user.username === username && ' (ты)'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Чат */}
          <div className="md:col-span-3 space-y-4">
            {/* Сообщения */}
            <div className="h-80 bg-gray-900/50 rounded-lg p-4 overflow-y-auto border border-blue-500/30">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span 
                        className="font-semibold"
                        style={{ color: message.color }}
                      >
                        {message.username}
                      </span>
                      <span className="text-gray-500">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-200 ml-2">
                      {message.text}
                    </div>
                  </div>
                ))}

                {/* Индикатор печатания */}
                {isTyping.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    {isTyping.join(', ')} печатает...
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Ввод сообщения */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Напиши сообщение..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 bg-blue-950/50 border border-blue-500/50 rounded-lg text-white placeholder-blue-300/70 focus:outline-none focus:border-blue-400"
                maxLength={200}
              />
              <button
                onClick={sendMessage}
                disabled={!currentMessage.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Icon name="Send" size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-blue-400/60 text-center">
          Создано @war_references специально для тебя! 🚀
        </div>
      </div>
    </Card>
  );
}