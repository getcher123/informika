import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/assets/2001-1350.svg" alt="МОСОБАВУЗ Logo" className="h-10" />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="text-[#00629B] hover:text-[#004d7a]">МЕДИАЦЕНТР</a>
            <a href="#" className="text-[#00629B] hover:text-[#004d7a]">ПРОЕКТНАЯ БИРЖА</a>
            <a href="#" className="text-[#00629B] hover:text-[#004d7a]">КОНКУРС</a>
            <a href="#" className="text-[#00629B] hover:text-[#004d7a]">ОБУЧЕНИЕ</a>
            <a href="#" className="text-[#00629B] hover:text-[#004d7a] flex items-center gap-2">
              ВОЙТИ
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section with gradient background */}
      <section className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #00D4FF 0%, #B794F6 100%)'
      }}>
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="bg-white rounded-[50px] px-8 md:px-12 py-12 md:py-16 relative shadow-xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#00629B] mb-6 leading-tight">
                  Акселератор корпоративных инноваций: путь к технологическому лидерству
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                  Объединяем инноваторов, предпринимателей и учебные заведения. Выбирайте проекты или участвуйте в конкурсах!
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-8">
                  <div>
                    <div className="text-4xl md:text-5xl font-bold text-[#00D4FF] mb-2">40+</div>
                    <p className="text-sm text-gray-600">
                      Проектов от ведущих специалистов и компаний, предоставляющих лучшие практики и инструменты для реализации ваших идей
                    </p>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-bold text-[#00D4FF] mb-2">15+</div>
                    <p className="text-sm text-gray-600">
                      Ведущих университетов Москвы и Подмосковья предоставят в роли менторов и экспертов при оценке проектов для лучших идей
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-[#00D4FF] hover:bg-[#00b8e6] text-white px-8 py-6 rounded-full text-base font-medium shadow-lg">
                    Смотреть проекты
                  </Button>
                  <Button variant="outline" className="border-2 border-[#00629B] text-[#00629B] hover:bg-[#00629B] hover:text-white px-8 py-6 rounded-full text-base font-medium shadow-lg">
                    Участвовать в конкурсах
                  </Button>
                </div>
              </div>

              <div className="relative">
                <img src="/assets/2001-1338.webp" alt="Innovation illustration" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#00629B] text-center mb-12">
            Экосистема успеха: всё для реализации ваших идей и проектов
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Партнерство */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-[#00629B] mb-4">Партнерство</h3>
              <p className="text-sm text-gray-600 mb-4">
                Совместная работа с АО «МосОблЕИРЦ» в реализации учебных инновационных проектов на базе реальных бизнес-процессов для решения актуальных задач
              </p>
              <ul className="space-y-3">
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-purple-500 mt-1">●</span>
                  <span>Профессиональное сопровождение: проекты получают инструменты, поддержку от экспертов и доступ к реальным бизнес-кейсам</span>
                </li>
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-purple-500 mt-1">●</span>
                  <span>Индивидуальный подход: детальная оценка потенциала вашего проекта (команды) и персональные рекомендации</span>
                </li>
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-purple-500 mt-1">●</span>
                  <span>Практическая реализация: возможность внедрения разработанного решения и дальнейшее развитие проекта</span>
                </li>
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-purple-500 mt-1">●</span>
                  <span>Экспертная оценка: глубокие консультации или аудит проекта от профессионалов различных направлений</span>
                </li>
              </ul>
              <div className="mt-6">
                <img src="/assets/2001-1339.webp" alt="Partnership" className="w-32 mx-auto" />
              </div>
            </div>

            {/* Сообщество */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-[#00629B] mb-4">Сообщество</h3>
              <p className="text-sm text-gray-600 mb-4">
                Объединяющая платформа: доступ к уникальному сообществу экспертов, менторов и единомышленников для обмена опытом и развития проектов
              </p>
              <ul className="space-y-3">
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-purple-500 mt-1">●</span>
                  <span>Поддержка: обратная связь от профессионалов своего с участием программы и партнёров</span>
                </li>
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-purple-500 mt-1">●</span>
                  <span>Постоянная связь: доступ к сообществу после завершения программы для дальнейшего развития</span>
                </li>
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-purple-500 mt-1">●</span>
                  <span>Совместная работа: возможность для совместной работы над проектами и обмена опытом</span>
                </li>
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-purple-500 mt-1">●</span>
                  <span>Экспертная поддержка: возможность с ведущими специалистами отрасли</span>
                </li>
              </ul>
              <div className="mt-6">
                <img src="/assets/2001-1340.webp" alt="Community" className="w-32 mx-auto" />
              </div>
            </div>

            {/* Продвижение */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-[#00629B] mb-4">Продвижение</h3>
              <p className="text-sm text-gray-600 mb-4">
                Успешное реализация проектов становятся возможной благодаря и внедрению в деятельность партнёра после успешного завершения акселератора
              </p>
              <ul className="space-y-3">
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-[#00D4FF] mt-1">●</span>
                  <span>Экспертная реализация: наличие проект проходит многоуровневую оценку комиссии и экспертов</span>
                </li>
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-[#00D4FF] mt-1">●</span>
                  <span>Системная интеграция: проведение решений внедряется в определённые проектные платформы</span>
                </li>
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-[#00D4FF] mt-1">●</span>
                  <span>Практическая реализация: от идеи до полноценного функционирования в бизнес - среде</span>
                </li>
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-[#00D4FF] mt-1">●</span>
                  <span>Масштабное публичное: проекты получают возможность для дальнейшего масштабирования и развития</span>
                </li>
              </ul>
              <div className="mt-6">
                <img src="/assets/2001-1341.webp" alt="Promotion" className="w-32 mx-auto" />
              </div>
            </div>

            {/* Финансирование */}
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-[#00629B] mb-4">Финансирование</h3>
              <p className="text-sm text-gray-600 mb-4">
                Максимальная поддержка: призовые гранты для развития лучших проектов и развитие интеграторов
              </p>
              <ul className="space-y-3">
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-[#00D4FF] mt-1">●</span>
                  <span>Целевое финансирование: средства выделяются на реализацию проектов, успешно прошедших все этапы отбора</span>
                </li>
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-[#00D4FF] mt-1">●</span>
                  <span>Системы "подушки безопасности": помощь проектов становится вашу идею реализовать и масштабировать решения</span>
                </li>
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-[#00D4FF] mt-1">●</span>
                  <span>Поддержка и услуги в финансировании: получают возможность для дальнейшего развития и масштабирования</span>
                </li>
                <li className="flex gap-2 text-sm text-gray-700">
                  <span className="text-[#00D4FF] mt-1">●</span>
                  <span>Грантовая поддержка: премиум обеспечение средствами необходимыми для дальнейшего развития вашего</span>
                </li>
              </ul>
              <div className="mt-6">
                <img src="/assets/2001-1342.webp" alt="Financing" className="w-32 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to participate */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#00629B] text-center mb-12">
            Как принять участие?
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Become part of real business */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 text-center">
              <div className="mb-6">
                <img src="/assets/2001-1404.webp" alt="Business" className="w-48 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-[#00629B] mb-4">
                Станьте частью реального бизнеса!
              </h3>
              <p className="text-gray-600 mb-6">
                Присоединяйтесь к работе над реальными бизнес-кейсами от ведущей компании АО «МосОблЕИРЦ». Работая бок о бок с опытными менторами и экспертами, вы не только получите бесценный практический опыт, но и сможете внести реальный вклад в развитие инноваций.
              </p>
              <Button className="bg-[#B794F6] hover:bg-[#a77de8] text-white px-8 py-6 rounded-full font-medium shadow-lg">
                Стать частью команды
              </Button>
            </div>

            {/* Start competition */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 text-center">
              <div className="mb-6">
                <img src="/assets/2001-1405.webp" alt="Competition" className="w-48 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-[#00629B] mb-4">
                Стартап-конкурс: ваш путь к успеху
              </h3>
              <p className="text-gray-600 mb-6">
                Откройте для себя новые горизонты развития! Наш конкурс — это уникальная площадка для представления инновационных решений. Лучшие команды и участники профессиональной оценки и широкие возможности для дальнейшего роста. Примите вызов и покажите свой потенциал!
              </p>
              <Button className="bg-[#00D4FF] hover:bg-[#00b8e6] text-white px-8 py-6 rounded-full font-medium shadow-lg">
                Подать заявку
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#00629B] text-center mb-12">
            Наши партнеры
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl flex items-center justify-center">
              <img src="/assets/2001-1431.webp" alt="МИФИ" className="max-h-16" />
            </div>
            <div className="bg-white p-6 rounded-xl flex items-center justify-center">
              <img src="/assets/2001-1453.webp" alt="Московский Политех" className="max-h-16" />
            </div>
            <div className="bg-white p-6 rounded-xl flex items-center justify-center">
              <img src="/assets/2001-1475.webp" alt="МГТУ им. Баумана" className="max-h-16" />
            </div>
            <div className="bg-white p-6 rounded-xl flex items-center justify-center">
              <img src="/assets/2001-1497.webp" alt="СИНЕРЗА" className="max-h-16" />
            </div>
            <div className="bg-white p-6 rounded-xl flex items-center justify-center">
              <img src="/assets/2001-1500.webp" alt="Российский университет дружбы народов" className="max-h-16" />
            </div>
            <div className="bg-white p-6 rounded-xl flex items-center justify-center">
              <img src="/assets/2001-1514.webp" alt="МОСОБАВУЗ" className="max-h-16" />
            </div>
            <div className="bg-white p-6 rounded-xl flex items-center justify-center">
              <img src="/assets/2001-1343.webp" alt="Строительный университет" className="max-h-16" />
            </div>
            <div className="bg-white p-6 rounded-xl flex items-center justify-center">
              <img src="/assets/2001-1344.webp" alt="Губкинский университет" className="max-h-16" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#00629B] mb-6">
                Решение сегодня - рост завтра!
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Каждое решение приближает вас к цели. Присоединяйтесь к нашему акселератору и открывайте двери к новому опыту, знаниям и карьерному росту. Ваше будущее начинается здесь!
              </p>
              <Button className="bg-[#00D4FF] hover:bg-[#00b8e6] text-white px-12 py-6 rounded-full text-lg font-medium shadow-lg">
                Стать участником
              </Button>
            </div>
            <div className="relative">
              <img src="/assets/2001-1406.webp" alt="Growth illustration" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src="/assets/2001-1350.svg" alt="МОСОБАВУЗ Logo" className="h-12 mb-4" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Платформа</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#00629B]">О нас</a></li>
                <li><a href="#" className="hover:text-[#00629B]">Проекты</a></li>
                <li><a href="#" className="hover:text-[#00629B]">Команда</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Ресурсы</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#00629B]">Мероприятия</a></li>
                <li><a href="#" className="hover:text-[#00629B]">Блог</a></li>
                <li><a href="#" className="hover:text-[#00629B]">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Связаться</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#00629B]">Контакты</a></li>
                <li><a href="#" className="hover:text-[#00629B]">Поддержка</a></li>
                <li><a href="#" className="hover:text-[#00629B]">Партнёрам</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

