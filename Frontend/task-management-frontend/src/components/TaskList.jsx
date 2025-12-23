import React, { useState, useEffect } from 'react';
import { taskAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await taskAPI.getTasks();
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskAPI.updateTask(editingTask.id, { title, description });
        setEditingTask(null);
      } else {
        await taskAPI.createTask(title, description);
      }
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      setError('Failed to save task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      await taskAPI.updateTask(id, { completed: !completed });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskAPI.deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logout();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Task Manager</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.formCard}>
        <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
        <form onSubmit={handleCreateTask}>
          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <textarea
              placeholder="Task Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
              rows="3"
            />
          </div>
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.createButton}>
              {editingTask ? 'Update Task' : 'Create Task'}
            </button>
            {editingTask && (
              <button type="button" onClick={handleCancelEdit} style={styles.cancelButton}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.taskList}>
        <h2>My Tasks</h2>
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks yet. Create one above!</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} style={styles.taskCard}>
              <div style={styles.taskContent}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id, task.completed)}
                  style={styles.checkbox}
                />
                <div style={styles.taskDetails}>
                  <h3 style={task.completed ? styles.completedTitle : styles.title}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p style={styles.description}>{task.description}</p>
                  )}
                </div>
              </div>
              <div style={styles.taskActions}>
                <button
                  onClick={() => handleEditTask(task)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  formCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical',
  },
  createButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: '#ffe6e6',
    borderRadius: '4px',
  },
  taskList: {
    marginTop: '2rem',
  },
  taskCard: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskContent: {
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
  },
  checkbox: {
    marginRight: '1rem',
    marginTop: '0.3rem',
    cursor: 'pointer',
  },
  taskDetails: {
    flex: 1,
  },
  title: {
    margin: '0 0 0.5rem 0',
  },
  completedTitle: {
    margin: '0 0 0.5rem 0',
    textDecoration: 'line-through',
    color: '#888',
  },
  description: {
    margin: 0,
    color: '#666',
  },
  taskActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default TaskList;