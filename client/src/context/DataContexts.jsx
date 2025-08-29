import React, { createContext, useState, useEffect } from 'react';

// Create the DataContext
export const DataContext = createContext();

// Create a provider component
export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    users: [],
    jobs: [],
    applications: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const base = import.meta.env.VITE_API_BASE_URL;

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${base}/api/users`);
      const users = await response.json();
      setData(prev => ({ ...prev, users }));
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${base}/api/jobs`);
      const jobs = await response.json();
      setData(prev => ({ ...prev, jobs }));
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications from API
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${base}/api/apply/getallapplies`);
      const applications = await response.json();
      setData(prev => ({ ...prev, applications }));
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new item
  const addItem = async (type, item) => {
    try {
      let endpoint = '';
      let newItem = null;
      
      switch (type) {
        case 'users':
          endpoint = '/api/users/register/candidate';
          newItem = await registerUser(item);
          break;
        case 'jobs':
          endpoint = '/api/jobs';
          newItem = await createJob(item);
          break;
        case 'applications':
          endpoint = '/api/apply';
          newItem = await createApplication(item);
          break;
        default:
          throw new Error('Invalid type');
      }
      
      setData(prev => ({
        ...prev,
        [type]: [...prev[type], newItem]
      }));
      
      return newItem;
    } catch (err) {
      setError(`Failed to add ${type}`);
      console.error(`Error adding ${type}:`, err);
      throw err;
    }
  };

  // Update an item
  const updateItem = async (type, id, updates) => {
    try {
      let endpoint = '';
      let updatedItem = null;
      
      switch (type) {
        case 'users':
          endpoint = `/api/users/${id}`;
          updatedItem = await updateUser(id, updates);
          break;
        case 'jobs':
          endpoint = `/api/jobs/${id}`;
          updatedItem = await updateJob(id, updates);
          break;
        case 'applications':
          endpoint = `/api/apply/${id}`;
          updatedItem = await updateApplication(id, updates);
          break;
        default:
          throw new Error('Invalid type');
      }
      
      setData(prev => ({
        ...prev,
        [type]: prev[type].map(item => 
          item.id === id ? { ...item, ...updatedItem } : item
        )
      }));
      
      return updatedItem;
    } catch (err) {
      setError(`Failed to update ${type}`);
      console.error(`Error updating ${type}:`, err);
      throw err;
    }
  };

  // Delete an item
  const deleteItem = async (type, id) => {
    try {
      let endpoint = '';
      
      switch (type) {
        case 'users':
          endpoint = `/api/users/${id}`;
          await deleteUser(id);
          break;
        case 'jobs':
          endpoint = `/api/jobs/${id}`;
          await deleteJob(id);
          break;
        case 'applications':
          endpoint = `/api/apply/${id}`;
          await deleteApplication(id);
          break;
        default:
          throw new Error('Invalid type');
      }
      
      setData(prev => ({
        ...prev,
        [type]: prev[type].filter(item => item.id !== id)
      }));
    } catch (err) {
      setError(`Failed to delete ${type}`);
      console.error(`Error deleting ${type}:`, err);
      throw err;
    }
  };

  // User API functions
  const registerUser = async (userData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${base}/api/users/register/candidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to register user');
    }
    
    return await response.json();
  };

  const updateUser = async (id, userData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${base}/api/users/${id},`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    
    return await response.json();
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${base}/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    
    return await response.json();
  };

  // Job API functions
  const createJob = async (jobData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${base}/api/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(jobData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create job');
    }
    
    return await response.json();
  };

  const updateJob = async (id, jobData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${base}/api/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(jobData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update job');
    }
    
    return await response.json();
  };

  const deleteJob = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${base}/api/jobs/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete job');
    }
    
    return await response.json();
  };

  // Application API functions
  const createApplication = async (applicationData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${base}/api/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(applicationData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create application');
    }
    
    return await response.json();
  };

  const updateApplication = async (id, applicationData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${base}/api/apply/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(applicationData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update application');
    }
    
    return await response.json();
  };

  const deleteApplication = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${base}/api/apply/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete application');
    }
    
    return await response.json();
  };

  // Initial data loading
  useEffect(() => {
    fetchUsers();
    fetchJobs();
    fetchApplications();
  }, []);

  // Context value
  const contextValue = {
    data,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    fetchUsers,
    fetchJobs,
    fetchApplications
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;