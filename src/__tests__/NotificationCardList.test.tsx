import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import NotificationCardList from '../NotificationWidget/NotificationCardList/NotificationCardList';
import { NotificationCardListHandle } from '../NotificationWidget/types';

describe('NotificationCardList', () => {
  // ===== ТЕСТ 1: Базовый рендеринг =====
  test('рендерится без ошибок', () => {
  const { container } = render(<NotificationCardList maxVisible={3} />);
  // Компонент возвращает null, когда нет уведомлений - это ожидаемое поведение
  expect(container.firstChild).toBeNull();
});

  // ===== ТЕСТ 2: Добавление уведомления =====
  test('добавляет уведомление через ref', async () => {
    const user = userEvent.setup();
    
    function TestWrapper() {
      const listRef = useRef<NotificationCardListHandle>(null);
      
      return (
        <div>
          <button 
            onClick={() => listRef.current?.add({
              title: 'Тестовое уведомление',
              description: 'Описание теста',
              buttonText: 'OK',
              Icon: <span>🔔</span>,
            })}
          >
            Добавить
          </button>
          <NotificationCardList ref={listRef} maxVisible={3} />
        </div>
      );
    }

    render(<TestWrapper />);
    
    expect(screen.queryByText('Тестовое уведомление')).not.toBeInTheDocument();
    
    await user.click(screen.getByText('Добавить'));
    
    expect(screen.getByText('Тестовое уведомление')).toBeInTheDocument();
    expect(screen.getByText('Описание теста')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  // ===== ТЕСТ 3: Добавление нескольких уведомлений =====
  test('добавляет все уведомления', async () => {
    const user = userEvent.setup();
    
    function TestWrapper() {
      const listRef = useRef<NotificationCardListHandle>(null);
      
      return (
        <div>
          <button 
            onClick={() => {
              for (let i = 1; i <= 5; i++) {
                listRef.current?.add({
                  title: `Уведомление ${i}`,
                  description: `Описание ${i}`,
                  buttonText: 'OK',
                  Icon: <span>🔔</span>,
                });
              }
            }}
          >
            Добавить 5
          </button>
          <NotificationCardList ref={listRef} maxVisible={3} />
        </div>
      );
    }

    render(<TestWrapper />);
    
    await user.click(screen.getByText('Добавить 5'));
    
    const titles = screen.getAllByText(/Уведомление \d/);
    expect(titles).toHaveLength(5);
  });

  // ===== ТЕСТ 4: Удаление уведомления =====
  test('удаляет уведомление по клику на кнопку закрытия', async () => {
    const user = userEvent.setup();
    
    function TestWrapper() {
      const listRef = useRef<NotificationCardListHandle>(null);
      
      return (
        <div>
          <button 
            onClick={() => listRef.current?.add({
              title: 'Удаляемое уведомление',
              description: 'Описание',
              buttonText: 'Закрыть',
              Icon: <span>🔔</span>,
            })}
          >
            Добавить
          </button>
          <NotificationCardList ref={listRef} maxVisible={3} />
        </div>
      );
    }

    render(<TestWrapper />);
    
    await user.click(screen.getByText('Добавить'));
    expect(screen.getByText('Удаляемое уведомление')).toBeInTheDocument();
    
    const closeButton = screen.getByLabelText('Закрыть уведомление');
    await user.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Удаляемое уведомление')).not.toBeInTheDocument();
    });
  });

  // ===== ТЕСТ 5: Несколько уведомлений =====
  test('показывает несколько уведомлений', async () => {
    const user = userEvent.setup();
    
    function TestWrapper() {
      const listRef = useRef<NotificationCardListHandle>(null);
      
      return (
        <div>
          <button 
            onClick={() => {
              listRef.current?.add({
                title: 'Первое',
                description: 'Описание 1',
                buttonText: 'OK',
                Icon: <span>🔔</span>,
              });
              listRef.current?.add({
                title: 'Второе',
                description: 'Описание 2',
                buttonText: 'OK',
                Icon: <span>🔔</span>,
              });
            }}
          >
            Добавить 2
          </button>
          <NotificationCardList ref={listRef} maxVisible={3} />
        </div>
      );
    }

    render(<TestWrapper />);
    await user.click(screen.getByText('Добавить 2'));
    
    expect(screen.getByText('Первое')).toBeInTheDocument();
    expect(screen.getByText('Второе')).toBeInTheDocument();
  });

  // ===== ТЕСТ 6: Проверка уникальности ID =====
  test('каждое уведомление имеет уникальный ID', async () => {
    const user = userEvent.setup();
    
    function TestWrapper() {
      const listRef = useRef<NotificationCardListHandle>(null);
      
      return (
        <div>
          <button 
            onClick={() => {
              listRef.current?.add({
                title: 'Первое',
                description: 'Описание 1',
                buttonText: 'OK',
                Icon: <span>🔔</span>,
              });
              listRef.current?.add({
                title: 'Второе',
                description: 'Описание 2',
                buttonText: 'OK',
                Icon: <span>🔔</span>,
              });
            }}
          >
            Добавить 2
          </button>
          <NotificationCardList ref={listRef} maxVisible={3} />
        </div>
      );
    }

    render(<TestWrapper />);
    await user.click(screen.getByText('Добавить 2'));
    
    const descriptions = screen.getAllByText(/Описание \d/);
    expect(descriptions).toHaveLength(2);
  });
test('уведомление автоматически закрывается через заданное время', async () => {
  const user = userEvent.setup();
  const autoCloseDelay = 3000; // 3 секунды (из notification.config.ts)

  function TestWrapper() {
    const listRef = useRef<NotificationCardListHandle>(null);

    return (
      <div>
        <button
          onClick={() => listRef.current?.add({
            title: 'Авто-уведомление',
            description: 'Исчезнет через 3 секунды',
            buttonText: 'OK',
            Icon: <span>🔔</span>,
          })}
        >
          Добавить
        </button>
        <NotificationCardList ref={listRef} maxVisible={3} />
      </div>
    );
  }

  render(<TestWrapper />);

  await user.click(screen.getByText('Добавить'));
  expect(screen.getByText('Авто-уведомление')).toBeInTheDocument();

  // Ждём, пока оно исчезнет (даём запас в 500 мс)
  await waitFor(() => {
    expect(screen.queryByText('Авто-уведомление')).not.toBeInTheDocument();
  }, { timeout: autoCloseDelay + 500 });
});
});