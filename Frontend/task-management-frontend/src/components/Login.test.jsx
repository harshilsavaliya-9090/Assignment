import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';

jest.mock('../services/api', () => ({
  authAPI: {
    login: jest.fn(),
  },
}));

const Wrapper = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('Login Component', () => {
  const mockOnSwitchToSignup = jest.fn();

  test('renders login page', () => {
    render(<Login onSwitchToSignup={mockOnSwitchToSignup} />, {
      wrapper: Wrapper,
    });

    expect(
      screen.getByRole('heading', { name: /login/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /login/i })
    ).toBeInTheDocument();
  });

  test('switches to signup', () => {
    render(<Login onSwitchToSignup={mockOnSwitchToSignup} />, {
      wrapper: Wrapper,
    });

    fireEvent.click(screen.getByText(/sign up/i));
    expect(mockOnSwitchToSignup).toHaveBeenCalled();
  });
});
