export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchWithAuth(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // In a real app, you would add auth token here
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        message: `Request failed with status ${response.status}` 
      }));
      throw new Error(error.message || 'Something went wrong');
    }
    
    // Check if the response is empty
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Jobs API
export const jobsApi = {
  getAll: () => fetchWithAuth('/jobs'),
  getById: (id) => fetchWithAuth(`/jobs/${id}`),
  create: (data) => fetchWithAuth('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchWithAuth(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchWithAuth(`/jobs/${id}`, { method: 'DELETE' }),
};

// Candidates API
export const candidatesApi = {
  getAll: () => fetchWithAuth('/candidates'),
  getById: (id) => fetchWithAuth(`/candidates/${id}`),
  create: (data) => fetchWithAuth('/candidates', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchWithAuth(`/candidates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Appointments API
export const appointmentsApi = {
  getAll: () => fetchWithAuth('/appointments'),
  getById: (id) => fetchWithAuth(`/appointments/${id}`),
  create: (data) => fetchWithAuth('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status) => fetchWithAuth(`/appointments/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify({ status }) 
  }),
};

// Conversations API
export const conversationsApi = {
  getByCandidateId: (candidateId) => fetchWithAuth(`/conversations/${candidateId}`),
  create: (data) => fetchWithAuth('/conversations', { method: 'POST', body: JSON.stringify(data) }),
};