import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { useState } from "react";

export default function Index() {
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);

  const handleDownloadFile = () => {
    // Имитация скачивания файла
    const link = document.createElement('a');
    link.href = '#'; // В реальности здесь будет ссылка на файл
    link.download = 'chicken_gun_mod.apk';
    link.click();
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-share-tech">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-pixel-dark via-background to-pixel-dark opacity-90"></div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="font-orbitron font-black text-4xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-retro-orange to-cyber-blue bg-clip-text text-transparent animate-pulse">
            🔥 CHICKEN GUN, ROBLOX, HYPER SANDBOX 🔥
          </h1>
          <h2 className="font-orbitron text-2xl md:text-3xl text-retro-orange mb-8">
            Твои Игры, Твои Правила!
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Надоело играть по чужим правилам? Хочешь больше возможностей и крутых фишек? Обращайся!
          </p>
          <a href="https://t.me/war_references" target="_blank" rel="noopener noreferrer">
            <Button 
              size="lg" 
              className="bg-retro-orange hover:bg-retro-orange/80 text-black font-orbitron font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-retro-orange/30"
            >
              <Icon name="MessageCircle" className="mr-2" />
              НАПИСАТЬ В TELEGRAM
            </Button>
          </a>
        </div>
      </section>

      {/* Chicken Gun Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="border-retro-orange/30 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <img 
                  src="/img/a4cd001c-8bf7-47ff-b970-98a81692f5ed.jpg" 
                  alt="Chicken Gun" 
                  className="w-32 h-32 object-cover rounded-lg border-2 border-retro-orange/50"
                />
              </div>
              <CardTitle className="font-orbitron text-3xl text-retro-orange flex items-center justify-center gap-2">
                🐔 CHICKEN GUN - БЕСПЛАТНО! 🐔
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-retro-orange/20">
                    <span className="text-2xl">♾️</span>
                    <span className="font-semibold">Бесконечные монеты - забудь про фарм!</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-retro-orange/20">
                    <span className="text-2xl">🛡️</span>
                    <span className="font-semibold">Бессмертие - стань непобедимым!</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-retro-orange/20">
                    <span className="text-2xl">🎨</span>
                    <span className="font-semibold">Свои текстуры - сделай игру уникальной!</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-retro-orange/20">
                    <span className="text-2xl">🧹</span>
                    <span className="font-semibold">Удаление объектов - создай идеальную карту!</span>
                  </div>
                </div>
              </div>
              <div className="text-center mt-6">
                <p className="font-orbitron text-cyber-blue text-xl mb-4">✨ И это еще не все! ✨</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-retro-orange hover:bg-retro-orange/80 text-black font-orbitron font-bold px-6 py-3 transition-all duration-300 hover:scale-105"
                    >
                      <Icon name="Download" className="mr-2" />
                      ПОЛУЧИТЬ CHICKEN GUN МОД
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-card border-retro-orange/30">
                    <DialogHeader>
                      <DialogTitle className="font-orbitron text-2xl text-retro-orange flex items-center gap-2">
                        <Icon name="Key" size={24} />
                        🐔 Инструкция для Chicken Gun
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Пошаговая инструкция для получения всех возможностей
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                      {/* Step 1 */}
                      <div className="border border-retro-orange/20 rounded-lg p-4 bg-background/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-retro-orange text-black font-orbitron font-bold w-8 h-8 rounded-full flex items-center justify-center">1</div>
                          <h3 className="font-orbitron font-bold text-retro-orange">Загрузка артефакта</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Скачайте таинственный файл, который я вам отправляю. Этот файл – ключ к новым возможностям!
                        </p>
                        <Button 
                          onClick={handleDownloadFile}
                          className="bg-retro-orange/20 border border-retro-orange text-retro-orange hover:bg-retro-orange hover:text-black"
                          variant="outline"
                        >
                          <Icon name="Download" className="mr-2" />
                          Скачать файл
                        </Button>
                      </div>

                      {/* Step 2 */}
                      <div className="border border-cyber-blue/20 rounded-lg p-4 bg-background/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-cyber-blue text-black font-orbitron font-bold w-8 h-8 rounded-full flex items-center justify-center">2</div>
                          <h3 className="font-orbitron font-bold text-cyber-blue">Врата в новый мир</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Откройте скачанное приложение. Перед вами возникнет кнопка, манящая надписью "Войти как гость" 
                          или ей подобной. Нажмите на нее – и вы окажетесь на пороге неизведанного.
                        </p>
                      </div>

                      {/* Step 3 */}
                      <div className="border border-primary/20 rounded-lg p-4 bg-background/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-primary text-primary-foreground font-orbitron font-bold w-8 h-8 rounded-full flex items-center justify-center">3</div>
                          <h3 className="font-orbitron font-bold text-primary">Связь с мастером</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Но это лишь начало вашего пути! Чтобы постичь все тонкости и секреты, свяжитесь со мной. 
                          Я лично раскрою вам следующие шаги и отвечу на все ваши вопросы.
                        </p>
                        <a href="https://t.me/war_references" target="_blank" rel="noopener noreferrer">
                          <Button className="bg-gradient-to-r from-retro-orange to-cyber-blue hover:from-retro-orange/80 hover:to-cyber-blue/80 text-black font-orbitron font-bold">
                            <Icon name="MessageCircle" className="mr-2" />
                            Связаться в Telegram для дальнейших инструкций
                          </Button>
                        </a>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Other Games Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Roblox Card */}
            <Card className="border-cyber-blue/30 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <img 
                    src="/img/7d3a1666-2f79-4b49-bfbd-d639a065f5a7.jpg" 
                    alt="Roblox" 
                    className="w-24 h-24 object-cover rounded-lg border-2 border-cyber-blue/50"
                  />
                </div>
                <CardTitle className="font-orbitron text-2xl text-cyber-blue">
                  ROBLOX
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-4">
                  Создаю уникальные возможности для твоих карт за звезды в Telegram! 
                  Сделай свою игру неповторимой! 🌟
                </p>
                <a href="https://t.me/war_references" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-black">
                    Узнать больше
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Hyper Sandbox Card */}
            <Card className="border-retro-orange/30 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <img 
                    src="/img/2b0ea8c1-e005-4b3d-b050-08e89f8afaba.jpg" 
                    alt="Hyper Sandbox" 
                    className="w-24 h-24 object-cover rounded-lg border-2 border-retro-orange/50"
                  />
                </div>
                <CardTitle className="font-orbitron text-2xl text-retro-orange">
                  HYPER SANDBOX
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-4">
                  Расширь границы своей креативности! 🛠️
                </p>
                <a href="https://t.me/war_references" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-retro-orange text-retro-orange hover:bg-retro-orange hover:text-black">
                    Подробнее
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Other Games Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Card className="border-primary/30 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-orbitron text-3xl text-primary">
                ДРУГИЕ ИГРЫ
              </CardTitle>
              <CardDescription className="text-lg">
                Договоримся о цене и воплотим твои мечты в реальность! 🤝
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center p-4 rounded-lg bg-background/30 border border-primary/20">
                  <Icon name="Shield" size={48} className="text-primary mb-2" />
                  <h3 className="font-orbitron font-bold">Защита</h3>
                  <p className="text-sm text-muted-foreground">Система защиты от блокировок</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-background/30 border border-primary/20">
                  <Icon name="Zap" size={48} className="text-retro-orange mb-2" />
                  <h3 className="font-orbitron font-bold">Моды</h3>
                  <p className="text-sm text-muted-foreground">Безопасное использование модов</p>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-background/30 border border-primary/20">
                  <Icon name="Gamepad2" size={48} className="text-cyber-blue mb-2" />
                  <h3 className="font-orbitron font-bold">Поддержка</h3>
                  <p className="text-sm text-muted-foreground">24/7 техническая поддержка</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-t from-pixel-dark/50 to-transparent">
        <div className="container mx-auto">
          <Card className="max-w-2xl mx-auto border-primary/30 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="font-orbitron text-3xl text-primary mb-2">
                СВЯЖИСЬ СО МНОЙ
              </CardTitle>
              <CardDescription className="text-lg">
                Пиши прямо сейчас и открой новые горизонты в любимых играх! 🚀
              </CardDescription>
              <div className="space-y-4 mt-4">
                {/* Response Time Warning */}
                <div className="bg-background/30 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Clock" className="text-primary" size={20} />
                    <span className="font-orbitron font-bold text-primary">Ответ не сразу</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ⚠️ Могу ответить не сразу - иногда очень занят и могу не заходить в Telegram до недели. 
                    У меня отключены уведомления, но я обязательно отвечу!
                  </p>
                </div>
                
                {/* Payment Info */}
                <div className="bg-background/30 border border-cyber-blue/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Star" className="text-cyber-blue" size={20} />
                    <span className="font-orbitron font-bold text-cyber-blue">Оплата</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    🎆 Оплата только звёздами в Telegram! Цена договорная, а для Chicken Gun всё БЕСПЛАТНО! 
                    Иногда могу сделать просто так бесплатно ради прикола 😄
                  </p>
                </div>
                
                {/* Disclaimer */}
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="AlertTriangle" className="text-destructive" size={20} />
                    <span className="font-orbitron font-bold text-destructive">Ответственность</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ⚠️ Мои услуги могут нарушать правила игры. Я не отвечаю за блокировки! 
                    Делаю это ради фана и прикола. В Chicken Gun блокировок нет! 🐔
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Имя</label>
                    <Input 
                      placeholder="Твое имя" 
                      className="bg-background/50 border-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Игра</label>
                    <Input 
                      placeholder="Какая игра тебя интересует?" 
                      className="bg-background/50 border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Сообщение</label>
                  <Textarea 
                    placeholder="Расскажи, что хочешь получить в игре..."
                    className="bg-background/50 border-primary/30 focus:border-primary min-h-[120px]"
                  />
                </div>
                <a href="https://t.me/war_references" target="_blank" rel="noopener noreferrer" className="block">
                  <Button 
                    type="button" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-retro-orange to-cyber-blue hover:from-retro-orange/80 hover:to-cyber-blue/80 text-black font-orbitron font-bold py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <Icon name="MessageCircle" className="mr-2" />
                    НАПИСАТЬ В TELEGRAM
                  </Button>
                </a>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-pixel-dark/30 border-t border-primary/20">
        <div className="container mx-auto text-center">
          <p className="font-orbitron text-primary/80">
            © 2024 Game Mods & Cheats. Твои игры, твои правила!
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="https://t.me/war_references" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Icon name="MessageCircle" className="mr-2" />
                @war_references
              </Button>
            </a>

          </div>
        </div>
      </footer>
    </div>
  );
}