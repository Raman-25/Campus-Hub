/**
 * Campus Hub - Centralized API Service
 *
 * Only HTTP 401 clears the session and redirects to login.
 * HTTP 400, 404, 500 surface the server's error message and keep the user logged in.
 */

const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_BASE_URL) ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://campus-hub-epjq.onrender.com');

let onUnauthorizedCallback = null;

export function setUnauthorizedHandler(callback) {
  onUnauthorizedCallback = callback;
}

/**
 * Extracts a human-readable error message from a server response.
 * Handles Spring Boot error JSON, ApiResponse<ApiError> envelopes,
 * plain strings, and Error instances.
 */
export function extractErrorMessage(data, fallback = 'A server error occurred.') {
  if (!data) return fallback;
  if (typeof data === 'string') return data;

  if (data instanceof Error) {
    if (data.data) {
      return extractErrorMessage(data.data, data.message || fallback);
    }
    return data.message || fallback;
  }

  // ApiResponse envelope: { error: { error: "Actual message" } }
  if (data.error && typeof data.error === 'object' && data.error.error) {
    return data.error.error;
  }

  // Prefer data.message over the generic data.error phrase
  if (data.message && typeof data.message === 'string' && data.message.trim()) {
    return data.message;
  }

  if (typeof data.error === 'string' && data.error.trim()) {
    if (data.error !== 'Internal Server Error' && data.error !== 'Bad Request') {
      return data.error;
    }
  }

  return fallback;
}

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 204) {
    return null;
  }

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => null);
  } else {
    const text = await response.text().catch(() => '');
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
  }

  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');

    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }

    const message = extractErrorMessage(data, 'Session expired or unauthorized. Please log in again.');
    const err = new Error(message);
    err.status = 401;
    err.data = data;
    throw err;
  }

  if (!response.ok) {
    const message = extractErrorMessage(
      data,
      `Request failed with status ${response.status} (${response.statusText || 'Error'})`
    );

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(
        new CustomEvent('campus-hub:api-error', {
          detail: { message, status: response.status, data },
        })
      );
    }

    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  // Unwrap ApiResponse envelope if present
  if (data && typeof data === 'object' && 'data' in data && data.data !== undefined) {
    return data.data;
  }

  return data;
}

export const adminApi = {
  getStudents(departmentCode, year) {
    const params = new URLSearchParams({ department: departmentCode, year: String(year) });
    return apiRequest(`/admin/student?${params.toString()}`);
  },

  deleteStudent(studentId) {
    return apiRequest(`/admin/student/${studentId}`, { method: 'DELETE' });
  },

  // year does not apply for professors
  getProfessors(departmentCode) {
    const params = new URLSearchParams({ department: departmentCode });
    return apiRequest(`/admin/professor?${params.toString()}`);
  },

  deleteProfessor(professorId) {
    return apiRequest(`/admin/professor/${professorId}`, { method: 'DELETE' });
  },

  getSubjects(departmentCode, year) {
    const params = new URLSearchParams({ department: departmentCode, year: String(year) });
    return apiRequest(`/admin/subject?${params.toString()}`);
  },

  // department must be the human-readable name (e.g. "Computer Science"); year is 1-4
  createSubject({ title, department, year }) {
    return apiRequest('/admin/subject', {
      method: 'POST',
      body: JSON.stringify({ title, department, year: Number(year) }),
    });
  },

  updateSubject(subjectId, { title, department, year }) {
    return apiRequest(`/admin/subject/${subjectId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, department, year: Number(year) }),
    });
  },

  deleteSubject(subjectId) {
    return apiRequest(`/admin/subject/${subjectId}`, { method: 'DELETE' });
  },

  assignProfessor(subjectId, professorId) {
    const params = new URLSearchParams({ professorId: String(professorId) });
    return apiRequest(`/admin/subject/${subjectId}/assign?${params.toString()}`, { method: 'PUT' });
  },

  unassignProfessor(subjectId) {
    return apiRequest(`/admin/subject/${subjectId}/assign`, { method: 'DELETE' });
  },
};

export const studentApi = {
  /** GET /student/me → { name, rollNumber, department, year } */
  getMe() {
    return apiRequest('/student/me');
  },

  /** GET /student/subjects → [{ id, title, professorName, attendance, grade }] */
  getSubjects() {
    return apiRequest('/student/subjects');
  },

  /** GET /student/subjects/{id}/attendance → [{ date, present }] (last 3, newest first) */
  getAttendance(subjectId) {
    return apiRequest(`/student/subjects/${subjectId}/attendance`);
  },

  /** GET /student/subjects/{id}/attendance?date=YYYY-MM-DD → [{ date, present }] or [] */
  getAttendanceByDate(subjectId, date) {
    return apiRequest(`/student/subjects/${subjectId}/attendance?date=${date}`);
  },
};

export const professorApi = {
  getSubjects() {
    return apiRequest('/professor/subjects');
  },

  getMe() {
    return apiRequest('/professor/me');
  },

  getStudents(subjectId) {
    return apiRequest(`/professor/subjects/${subjectId}/students`);
  },

  // Returns [{ name, rollNumber, present: true/false/null }]
  getAttendanceByDate(subjectId, date) {
    return apiRequest(`/professor/subjects/${subjectId}/attendance?date=${date}`);
  },

  markAttendance(payload) {
    return apiRequest('/professor/attendance', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  enterGrades(payload) {
    return apiRequest('/professor/grades', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
