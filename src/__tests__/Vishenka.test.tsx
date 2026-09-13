import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import  Vishenka from '../pages/Vishenka/Vishenka';

describe('Vishenka (заглушка)', () => {
  test('рендерит страницу «Вишенка»', () => {
    render(<Vishenka />);
    expect(screen.getByText(/Вишенка/i)).toBeInTheDocument();
  });

  test('показывает 4 канала: e-mail, смс, telegram, MAX', () => {
    render(<Vishenka />);
    expect(screen.getByText('По e-mail')).toBeInTheDocument();
    expect(screen.getByText('По смс')).toBeInTheDocument();
    expect(screen.getByText('В телеграм')).toBeInTheDocument();
    expect(screen.getByText('В MAX')).toBeInTheDocument();
  });

  test('кнопка "Отправить" отключена без данных', () => {
    render(<Vishenka />);
    const button = screen.getByText('Отправить');
    expect(button).toBeDisabled();
  });

  test('кнопка активна после заполнения темы и получателей', async () => {
    const user = userEvent.setup();
    render(<Vishenka />);

    await user.type(
      screen.getByPlaceholderText(/Специальное предложение/i),
      'Тест'
    );
    await user.type(
      screen.getByPlaceholderText(/example@mail.com/i),
      'test@mail.com'
    );

    expect(screen.getByText('Отправить')).not.toBeDisabled();
  });

  test('показывает количество добавленных адресов', async () => {
    const user = userEvent.setup();
    render(<Vishenka />);

    await user.type(
      screen.getByPlaceholderText(/example@mail.com/i),
      'a@mail.com b@mail.com c@mail.com'
    );

    expect(screen.getByText(/Добавлено адресов: 3/i)).toBeInTheDocument();
  });

  test('открывает подтверждение по клику на "Отправить"', async () => {
    const user = userEvent.setup();
    render(<Vishenka />);

    await user.type(
      screen.getByPlaceholderText(/Специальное предложение/i),
      'Тест'
    );
    await user.type(
      screen.getByPlaceholderText(/example@mail.com/i),
      'test@mail.com'
    );
    await user.click(screen.getByText('Отправить'));

    expect(screen.getByText('Подтвердите отправку')).toBeInTheDocument();
  });

  test('показывает прогресс после подтверждения', async () => {
    const user = userEvent.setup();
    render(<Vishenka />);

    await user.type(
      screen.getByPlaceholderText(/Специальное предложение/i),
      'Тест'
    );
    await user.type(
      screen.getByPlaceholderText(/example@mail.com/i),
      'test@mail.com'
    );
    await user.click(screen.getByText('Отправить'));
    await user.click(screen.getByText('Подтвердить'));

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('показывает успех после завершения отправки', async () => {
    const user = userEvent.setup();
    render(<Vishenka />);

    await user.type(
      screen.getByPlaceholderText(/Специальное предложение/i),
      'Тест'
    );
    await user.type(
      screen.getByPlaceholderText(/example@mail.com/i),
      'test@mail.com'
    );
    await user.click(screen.getByText('Отправить'));
    await user.click(screen.getByText('Подтвердить'));

    await waitFor(
      () => {
        expect(screen.getByText(/Успешно отправлено/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  test('отмена подтверждения возвращает к форме', async () => {
    const user = userEvent.setup();
    render(<Vishenka />);

    await user.type(
      screen.getByPlaceholderText(/Специальное предложение/i),
      'Тест'
    );
    await user.type(
      screen.getByPlaceholderText(/example@mail.com/i),
      'test@mail.com'
    );
    await user.click(screen.getByText('Отправить'));
    await user.click(screen.getByText('Отмена'));

    expect(screen.queryByText('Подтвердите отправку')).not.toBeInTheDocument();
  });
});