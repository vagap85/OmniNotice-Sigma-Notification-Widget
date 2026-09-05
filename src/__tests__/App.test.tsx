import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App', () => {
  test('рендерит кнопку и виджет', () => {
    render(<App />);
    expect(screen.getByText('Показать уведомление')).toBeInTheDocument();
  });

  test('по клику на кнопку появляется уведомление', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    await user.click(screen.getByText('Показать уведомление'));
    
    expect(screen.getByText(/Новое уведомление/)).toBeInTheDocument();
    expect(screen.getByText('У вас есть новое сообщение, требующее внимания.')).toBeInTheDocument();
    expect(screen.getByText('Посмотреть')).toBeInTheDocument();
  });

  test('при каждом клике номер уведомления увеличивается', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    await user.click(screen.getByText('Показать уведомление'));
    expect(screen.getByText('Новое уведомление 1')).toBeInTheDocument();
    
    await user.click(screen.getByText('Показать уведомление'));
    expect(screen.getByText('Новое уведомление 2')).toBeInTheDocument();
    
    await user.click(screen.getByText('Показать уведомление'));
    expect(screen.getByText('Новое уведомление 3')).toBeInTheDocument();
  });

  test('может показывать несколько уведомлений', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    await user.click(screen.getByText('Показать уведомление'));
    await user.click(screen.getByText('Показать уведомление'));
    await user.click(screen.getByText('Показать уведомление'));
    
    expect(screen.getByText('Новое уведомление 1')).toBeInTheDocument();
    expect(screen.getByText('Новое уведомление 2')).toBeInTheDocument();
    expect(screen.getByText('Новое уведомление 3')).toBeInTheDocument();
  });
});