import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio name', () => {
  render(<App />);
  const nameElement = screen.getByText(/Elisee/i);
  expect(nameElement).toBeInTheDocument();
});
