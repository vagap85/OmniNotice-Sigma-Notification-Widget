# 🔔 OmniNotice — Sigma Notification Widget

Виджет уведомлений для React. Показывает всплывающие уведомления с иконками, кнопками и плавными анимациями.



### 📦 Установка

npm install
🚀 Запуск
bash
# Запустить проект в браузере
npm run dev

# Собрать проект
npm run build

# Посмотреть собранную версию
npm run preview
🧪 Тесты
bash
# Запустить все тесты
npm run test

# Запустить тесты с отчётом о покрытии
npm run test:coverage

# Запустить тесты в режиме наблюдения (автоматический перезапуск)
npm run test:watch
## 📖Как использовать
# 1. Добавьте виджет в приложение
tsx
import NotificationCardList from './NotificationWidget/NotificationCardList';

function App() {
  return <NotificationCardList maxVisible={3} />;
}
# 2. Управляйте уведомлениями через ref
tsx
import { useRef } from 'react';
import NotificationCardList from './NotificationWidget/NotificationCardList';

function App() {
  const listRef = useRef(null);

  const showNotification = () => {
    listRef.current?.add({
      title: 'Новое уведомление',
      description: 'У вас есть новое сообщение',
      buttonText: 'Посмотреть',
      Icon: <BellIcon />,
    });
  };

  return (
    <>
      <button onClick={showNotification}>Показать уведомление</button>
      <NotificationCardList ref={listRef} maxVisible={3} />
    </>
  );
}
# 3. Методы, доступные через ref
Метод	Описание<br>
add(notification)	Добавить уведомление<br>
remove(id)	Удалить уведомление по ID<br>
⚙️ Настройки<br>
Создайте файл notification.config.ts:

ts
export default {
  maxVisible: 3,          // Максимум видимых уведомлений
  removalAnimationMs: 300 // Длительность анимации удаления (мс)
};
🧩 Структура уведомления<br>
ts
{
  id?: string,               // Уникальный ID (генерируется автоматически)<br>
  title: string,             // Заголовок<br>
  description: string,       // Описание<br>
  buttonText: string,        // Текст на кнопке<br>
  Icon?: React.ReactNode,   // Иконка (опционально)<br>
  onClose?: () => void,     // Функция при закрытии<br>
  onClick?: () => void      // Функция при клике на кнопку<br>
}
🎯 Тесты<br>
Компонент	Количество тестов	Что проверяем<br>
App	4	Рендеринг, добавление, счётчик, несколько уведомлений<br>
NotificationCardList	6	Добавление, удаление, ограничение по maxVisible, уникальные ID<br>
NotificationCard	7	Рендеринг, иконка, кнопка закрытия, ARIA-атрибуты<br>
Всего	18	✅ Все тесты проходят<br>
# 🐛 Что исправили в процессе<br>
SVG-атрибуты stroke-linecap	<br>
Заменили на strokeLinecap (React требует camelCase)<br>
Компонент возвращал null при пустом списке	
Добавили проверку в тестах<br>
jest не был определён в ESM-режиме	
Импортировали jest из @jest/globals<br>
Отсутствовал esModuleInterop в tsconfig.json	
Добавили настройку<br>
# 🔧 Технологии
React 18

TypeScript

Vite

Jest + Testing Library

CSS-модули (FLIP-анимация)

# 📊 Покрытие кода

Все файлы: Stmts 88.23% | Branch 77.14% | Funcs 93.54% | Lines 87.64% |<br>

### Что можно улучшить в виджете
В процессе тестирования и анализа кода были выявлены следующие моменты, которые можно доработать:

1. Добавить метод clear() для очистки всех уведомлений
Сейчас в NotificationCardList нет возможности очистить все уведомления одной командой.

Сейчас:


// ❌ Такого метода нет
listRef.current?.clear()
Как исправить:


useImperativeHandle(ref, () => ({
  add: ...,
  remove: ...,
  clear: () => setItems([]), // ✅ Добавить
}), [removeItem]);
2. Исправить логику maxVisible
По задумке должно показываться только maxVisible уведомлений, но сейчас в DOM попадают все, а скрываются только стилями.

Сейчас:


// ❌ Все уведомления рендерятся, часть скрыта CSS
{items.map((item) => <div key={item.id}>...</div>)}
Как исправить:


// ✅ Рендерить только первые maxVisible уведомлений
const visibleItems = items.slice(0, maxVisible);
{visibleItems.map((item) => <div key={item.id}>...</div>)}
3. Добавить data-testid для упрощения тестирования
Сейчас для тестов приходится искать элементы по классам или тексту, что делает тесты хрупкими.

Как исправить:


<div 
  data-testid="notification-card-list"
  data-testid="notification-card" 
  data-testid="close-button"
>
4. Добавить обработку клика на кнопку уведомления
Сейчас есть buttonText, но нет обработчика клика на эту кнопку (кроме onClose).

Как исправить:


interface NotificationCardProps {
  onClick?: () => void; // ✅ Добавить
}

// В компоненте
<button onClick={onClick}>
  {buttonText}
</button>
5. Добавить автоматическое скрытие по таймауту
В конфиге есть duration, но он не используется.

Как исправить:


// В NotificationCard
useEffect(() => {
  if (duration) {
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }
}, [duration, onClose]);
6. Улучшить обработку ошибок
Сейчас при ошибке в add() или remove() пользователь ничего не увидит.

Как исправить:


try {
  // код
} catch (error) {
  console.error('Ошибка при добавлении уведомления:', error);
  // Показать fallback-уведомление
}
7. Добавить типы для всех пропсов
Некоторые пропсы в NotificationCard не имеют явных типов.

Как исправить:

// ✅ Полный интерфейс
interface NotificationCardProps {
  id?: string;
  title: string;
  description: string;
  buttonText: string;
  Icon?: React.ReactNode;
  onClose?: () => void;
  onClick?: () => void;
  duration?: number;
  className?: string;
}
8. Улучшить анимации
FLIP-анимация работает, но можно сделать появление новых уведомлений с keyframe-анимацией.

Как исправить:

css
.notification-card-list__item--entering {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
}
9. Добавить поддержку кастомизации через пропсы
Сейчас стили жёстко зашиты в CSS-файлах.

Как исправить:

<NotificationCardList 
  maxVisible={3}
  className="my-custom-list"
  itemClassName="my-custom-item"
/>
10. Настроить автоматическое тестирование в CI/CD
Сейчас тесты запускаются только вручную.

Как исправить:
Добавить .github/workflows/test.yml:

yaml
name: Tests
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test
# 📊 Приоритеты для доработки
Приоритет	Задача	Сложность<br>
🔴 Высокий	Добавить clear()	Лёгкая<br>
🔴 Высокий	Исправить maxVisible	Средняя<br>
🟡 Средний	Обработка клика на кнопку	Лёгкая<br>
🟡 Средний	Автоматическое скрытие по таймауту	Лёгкая<br>
🟢 Низкий	Добавить data-testid	Лёгкая<br>
🟢 Низкий	CI/CD на GitHub Actions	Средняя<br>

📝 Лицензия
MIT

👤 Автор
Разработчик: Davyd Ordynskiy
Тестировщик: Evgeny Agapov
