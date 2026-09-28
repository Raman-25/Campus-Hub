/**
 * Campus Hub - Centralized API Service
 * 
 * Strict error handling rules:
 * - Only HTTP 401 (bad/expired token) may clear the session and redirect to login.
 * - HTTP 400, 404, 500 do NOT log out — they extract and display the server's
 *   actual error message to the user, keeping the user logged in.
 */

const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_BASE_URL) ||
  'http://localhost:8080';

// Global handler for 401 Unauthorized responses
let onUnauthorizedCallback = null;

export function setUnauthorizedHandler(callback) {
  onUnauthorizedCallback = callback;
}

// Global handler for non-401 error notifications (400, 404, 500)
let onErrorCallback = null;

export function setErrorHandler(callback) {
  onErrorCallback = callback;
}

/**
 * Extracts human-readable error message from server response.
 * Handles:
 * - Spring Boot standard error JSON: { error: "Internal Server Error", message: "Actual message", status: 500 }
 * - ApiResponse<ApiError> envelope: { data: null, error: { error: "Actual message", statusCode: "..." } }
 * - Plain string or Error instance
 */
export function extractErrorMessage(data, fallback = 'A server error occurred.') {
  if (!data) return fallback;
  if (typeof data === 'string') return data;

  // Handle Error instances passed in
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

  // Spring Boot standard error body: prefer data.message over generic data.error!
  if (data.message && typeof data.message === 'string' && data.message.trim()) {
    return data.message;
  }

  // String error field (if not generic HTTP phrase)
  if (typeof data.error === 'string' && data.error.trim()) {
    if (data.error !== 'Internal Server Error' && data.error !== 'Bad Request') {
      return data.error;
    }
  }

  return fallback;
}

/**
 * Base fetch wrapper with Bearer token authentication and strict status-code handling.
 */
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
  });

  // 1. Handle HTTP 204 No Content
  if (response.status === 204) {
    return null;
  }

  // 2. Parse response body (JSON, text, or null)
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

  // 3. STRICT RULE: ONLY HTTP 401 may clear session and redirect to login
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

  // 4. STRICT RULE: HTTP 400, 404, 500 MUST NOT log out.
  // Extract and propagate the server's actual error message.
  if (!response.ok) {
    const message = extractErrorMessage(
      data,
      `Request failed with status ${response.status} (${response.statusText || 'Error'})`
    );

    // Notify registered error callback & dispatch browser event
    if (onErrorCallback) {
      onErrorCallback(message, response.status, data);
    }
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

  // 5. Success (2xx): Return data unwrapped if wrapped in ApiResponse envelope
  if (data && typeof data === 'object' && 'data' in data && data.data !== undefined) {
    return data.data;
  }

  return data;
}

// -------------------------------------------------------------
// Admin Endpoints
// -------------------------------------------------------------

export const adminApi = {
  // Students: GET /admin/student?department=&year=
  getStudents(departmentCode, year) {
    const params = new URLSearchParams({
      department: departmentCode,
      year: String(year),
    });
    return apiRequest(`/admin/student?${params.toString()}`);
  },

  // Delete Student: DELETE /admin/student/{id}
  deleteStudent(studentId) {
    return apiRequest(`/admin/student/${studentId}`, {
      method: 'DELETE',
    });
  },

  // Professors: GET /admin/professor?department= (year does NOT apply)
  getProfessors(departmentCode) {
    const params = new URLSearchParams({
      department: departmentCode,
    });
    return apiRequest(`/admin/professor?${params.toString()}`);
  },

  // Delete Professor: DELETE /admin/professor/{id}
  deleteProfessor(professorId) {
    return apiRequest(`/admin/professor/${professorId}`, {
      method: 'DELETE',
    });
  },

  // Subjects: GET /admin/subject?department=&year=
  getSubjects(departmentCode, year) {
    const params = new URLSearchParams({
      department: departmentCode,
      year: String(year),
    });
    return apiRequest(`/admin/subject?${params.toString()}`);
  },

  // Create Subject: POST /admin/subject
  // Body must have readable department name (e.g. "Computer Science") and integer year (1-4)
  createSubject({ title, department, year }) {
    return apiRequest('/admin/subject', {
      method: 'POST',
      body: JSON.stringify({
        title,
        department,
        year: Number(year),
      }),
    });
  },

  // Update Subject: PUT /admin/subject/{subjectId}
  updateSubject(subjectId, { title, department, year }) {
    return apiRequest(`/admin/subject/${subjectId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        department,
        year: Number(year),
      }),
    });
  },

  // Delete Subject: DELETE /admin/subject/{subjectId}
  deleteSubject(subjectId) {
    return apiRequest(`/admin/subject/${subjectId}`, {
      method: 'DELETE',
    });
  },

  // Assign Professor to Subject: PUT /admin/subject/{subjectId}/assign?professorId={professorId}
  assignProfessor(subjectId, professorId) {
    const params = new URLSearchParams({
      professorId: String(professorId),
    });
    return apiRequest(`/admin/subject/${subjectId}/assign?${params.toString()}`, {
      method: 'PUT',
    });
  },

  // Unassign Professor from Subject: DELETE /admin/subject/{subjectId}/assign
  unassignProfessor(subjectId) {
    return apiRequest(`/admin/subject/${subjectId}/assign`, {
      method: 'DELETE',
    });
  },
};
