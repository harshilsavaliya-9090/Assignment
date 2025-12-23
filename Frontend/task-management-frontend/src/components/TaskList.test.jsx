jest.mock('../services/api', () => ({
  taskAPI: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskList from './TaskList';
import { taskAPI } from '../services/api';
import { AuthProvider } from '../context/AuthContext';

const MockedTaskList = () => (
  <AuthProvider>
    <TaskList />
  </AuthProvider>
);

describe('TaskList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task list and form', async () => {
    taskAPI.getTasks.mockResolvedValue({ data: [] });

    render(<MockedTaskList />);

    await waitFor(() => {
      expect(screen.getByText('Task Manager')).toBeInTheDocument();
      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });
  });

  test('displays tasks', async () => {
    taskAPI.getTasks.mockResolvedValue({
      data: [
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: true },
      ],
    });

    render(<MockedTaskList />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  test('creates a new task', async () => {
    taskAPI.getTasks.mockResolvedValue({ data: [] });
    taskAPI.createTask.mockResolvedValue({ data: {} });

    render(<MockedTaskList />);

    fireEvent.change(screen.getByPlaceholderText(/task title/i), {
      target: { value: 'New Task' },
    });

    fireEvent.click(screen.getByText('Create Task'));

    await waitFor(() => {
      expect(taskAPI.createTask).toHaveBeenCalled();
    });
  });

  test('toggles task completion', async () => {
    taskAPI.getTasks.mockResolvedValue({
      data: [{ id: 1, title: 'Task 1', completed: false }],
    });
    taskAPI.updateTask.mockResolvedValue({ data: {} });

    render(<MockedTaskList />);

    const checkbox = await screen.findByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(taskAPI.updateTask).toHaveBeenCalled();
    });
  });

  test('deletes a task', async () => {
    taskAPI.getTasks.mockResolvedValue({
      data: [{ id: 1, title: 'Task 1', completed: false }],
    });
    taskAPI.deleteTask.mockResolvedValue({ data: {} });

    render(<MockedTaskList />);

    fireEvent.click(await screen.findByText('Delete'));

    await waitFor(() => {
      expect(taskAPI.deleteTask).toHaveBeenCalled();
    });
  });
});
