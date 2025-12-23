import { render, screen, fireEvent } from '@testing-library/react';
import Signup from './Signup';

jest.mock('../services/api', () => ({
  authAPI: {
    signup: jest.fn(),
  },
}));

describe('Signup Component', () => {
  const mockOnSwitchToLogin = jest.fn();

  test('renders signup page', () => {
    render(<Signup onSwitchToLogin={mockOnSwitchToLogin} />);

    expect(
      screen.getByRole('heading', { name: /sign up/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });

  test('switches to login', () => {
    render(<Signup onSwitchToLogin={mockOnSwitchToLogin} />);

    fireEvent.click(screen.getByText(/login/i));
    expect(mockOnSwitchToLogin).toHaveBeenCalled();
  });
});
