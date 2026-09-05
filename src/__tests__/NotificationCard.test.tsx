import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals'; // <-- Добавлен импорт jest
import NotificationCard from '../NotificationWidget/NotificationCard/NotificationCard';
import type { NotificationCardProps } from '../NotificationWidget/types';

describe('NotificationCard', () => {
  // ===== ТЕСТ 1: Рендеринг с обязательными пропсами =====
  test('рендерит уведомление с заголовком и описанием', () => {
    const props: NotificationCardProps = {
      title: 'Тестовый заголовок',
      description: 'Тестовое описание',
      buttonText: 'OK',
    };

    render(<NotificationCard {...props} />);

    expect(screen.getByText('Тестовый заголовок')).toBeInTheDocument();
    expect(screen.getByText('Тестовое описание')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  // ===== ТЕСТ 2: Рендеринг с иконкой =====
  test('рендерит иконку, если она передана', () => {
    const props: NotificationCardProps = {
      title: 'Заголовок',
      description: 'Описание',
      buttonText: 'OK',
      Icon: <span data-testid="custom-icon">🔔</span>,
    };

    render(<NotificationCard {...props} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByText('🔔')).toBeInTheDocument();
  });

  // ===== ТЕСТ 3: Рендеринг без иконки =====
  test('рендерится без иконки, если она не передана', () => {
    const props: NotificationCardProps = {
      title: 'Заголовок',
      description: 'Описание',
      buttonText: 'OK',
    };

    render(<NotificationCard {...props} />);

    const iconContainer = document.querySelector('.notification-card__icon');
    expect(iconContainer).toBeEmptyDOMElement();
  });

  // ===== ТЕСТ 4: Вызов onClose при клике на кнопку закрытия =====
  test('вызывает onClose при клике на кнопку закрытия', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();

    const props: NotificationCardProps = {
      title: 'Заголовок',
      description: 'Описание',
      buttonText: 'OK',
      onClose: handleClose,
    };

    render(<NotificationCard {...props} />);

    const closeButton = screen.getByLabelText('Закрыть уведомление');
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // ===== ТЕСТ 5: Не вызывает onClose, если он не передан =====
  test('не вызывает onClose при клике, если он не передан', async () => {
    const user = userEvent.setup();

    const props: NotificationCardProps = {
      title: 'Заголовок',
      description: 'Описание',
      buttonText: 'OK',
    };

    render(<NotificationCard {...props} />);

    const closeButton = screen.getByLabelText('Закрыть уведомление');
    await user.click(closeButton);

    expect(closeButton).toBeInTheDocument();
  });

  // ===== ТЕСТ 6: Проверка аттрибутов доступности (a11y) =====
  test('имеет правильные ARIA-атрибуты', () => {
    const props: NotificationCardProps = {
      title: 'Доступное уведомление',
      description: 'Описание',
      buttonText: 'OK',
    };

    render(<NotificationCard {...props} />);

    const card = document.querySelector('.notification-card');
    expect(card).toHaveAttribute('role', 'alert');
    expect(card).toHaveAttribute('aria-labelledby');
    expect(card).toHaveAttribute('aria-describedby');
  });

  // ===== ТЕСТ 7: Кнопка закрытия имеет правильный aria-label =====
  test('кнопка закрытия имеет aria-label', () => {
    const props: NotificationCardProps = {
      title: 'Заголовок',
      description: 'Описание',
      buttonText: 'OK',
    };

    render(<NotificationCard {...props} />);

    const closeButton = screen.getByLabelText('Закрыть уведомление');
    expect(closeButton).toBeInTheDocument();
  });
});