import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true,
});

// Silently handle expected 401 on the auth-check endpoint so it doesn't
// appear as a red network error in the browser console for guest users.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const status = error.response?.status;
    // 401 on /api/user is expected when not logged in — don't log it
    if (status === 401 && url.includes('/api/user')) {
      return Promise.reject(error); // still reject so AuthContext sets user=null
    }
    return Promise.reject(error);
  }
);

/**
 * Fetch CSRF cookie from Laravel Sanctum.
 */
export const getCsrfCookie = async () => {
  return api.get('/sanctum/csrf-cookie');
};

/**
 * Auth API services
 */
export const authApi = {
  async login(credentials) {
    await getCsrfCookie();
    return api.post('/api/login', credentials);
  },
  async register(data) {
    await getCsrfCookie();
    return api.post('/api/register', data);
  },
  async logout() {
    await getCsrfCookie();
    return api.post('/api/logout');
  },
  async getUser() {
    return api.get('/api/user');
  },
};

/**
 * Schools & Discovery API services
 */
export const schoolsApi = {
  async getHome() {
    return api.get('/api/home');
  },
  async getSchools(params) {
    return api.get('/api/schools', { params });
  },
  async getSchool(slug) {
    return api.get(`/api/schools/${slug}`);
  },
  async compareSchools(ids) {
    return api.get('/api/schools/compare', { params: { ids } });
  },
  async getNearby(params) {
    return api.get('/api/schools/nearby', { params });
  },
};

/**
 * Interaction API services (Reviews, Tours, Dashboard)
 */
export const interactionsApi = {
  async getDashboard() {
    return api.get('/api/dashboard');
  },
  async submitReview(schoolId, data) {
    await getCsrfCookie();
    return api.post(`/api/schools/${schoolId}/reviews`, data);
  },
  async deleteReview(reviewId) {
    await getCsrfCookie();
    return api.delete(`/api/reviews/${reviewId}`);
  },
  async bookTour(schoolId, data) {
    await getCsrfCookie();
    return api.post(`/api/schools/${schoolId}/tours`, data);
  },
  async updateTourStatus(tourId, status) {
    await getCsrfCookie();
    return api.patch(`/api/tours/${tourId}/status`, { status });
  },
  async getSchoolProfile() {
    return api.get('/api/school-profile');
  },
  async updateSchoolProfile(data) {
    await getCsrfCookie();
    return api.post('/api/school-profile', data);
  },
  async getProfile() {
    return api.get('/api/profile');
  },
  async updateProfile(data) {
    await getCsrfCookie();
    return api.patch('/api/profile', data);
  },
  async deleteAccount(data) {
    await getCsrfCookie();
    return api.delete('/api/profile', { data });
  },
};

/**
 * Admin API services
 */
export const adminApi = {
  async approveListing(listingId, notes = '') {
    await getCsrfCookie();
    return api.post(`/api/admin/listings/${listingId}/approve`, { notes });
  },
  async rejectListing(listingId, rejectionReason) {
    await getCsrfCookie();
    return api.post(`/api/admin/listings/${listingId}/reject`, { rejection_reason: rejectionReason });
  },
  async updateUserRole(userId, role) {
    await getCsrfCookie();
    return api.patch(`/api/admin/users/${userId}/role`, { role });
  },
  async deleteReview(reviewId) {
    await getCsrfCookie();
    return api.delete(`/api/admin/reviews/${reviewId}`);
  },
};

export default api;
