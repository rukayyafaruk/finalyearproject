import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { getCsrfCookie } from '../api/client';

/**
 * Route resolution mapping for React SPA.
 */
export const route = (name, params = null) => {
  const routes = {
    'home': '/',
    'schools.index': '/schools',
    'schools.compare': '/schools/compare',
    'schools.show': (p) => `/schools/${typeof p === 'object' ? p?.slug || p?.id : p}`,
    'login': '/login',
    'register': '/register',
    'logout': '/logout',
    'dashboard': '/dashboard',
    'profile.edit': '/profile',
    'profile.update': '/api/profile',
    'profile.destroy': '/api/profile',
    'school-profile.edit': '/school-profile/edit',
    'school-profile.update': '/api/school-profile',
    'reviews.store': (p) => `/api/schools/${typeof p === 'object' ? p?.id : p}/reviews`,
    'reviews.destroy': (p) => `/api/reviews/${typeof p === 'object' ? p?.id : p}`,
    'tours.store': (p) => `/api/schools/${typeof p === 'object' ? p?.id : p}/tours`,
    'tours.updateStatus': (p) => `/api/tours/${typeof p === 'object' ? p?.id : p}/status`,
    'admin.listings.approve': (p) => `/api/admin/listings/${typeof p === 'object' ? p?.id : p}/approve`,
    'admin.listings.reject': (p) => `/api/admin/listings/${typeof p === 'object' ? p?.id : p}/reject`,
    'admin.users.updateRole': (p) => `/api/admin/users/${typeof p === 'object' ? p?.id : p}/role`,
    'admin.reviews.destroy': (p) => `/api/admin/reviews/${typeof p === 'object' ? p?.id : p}`,
    'password.request': '/forgot-password',
    'password.email': '/api/forgot-password',
    'password.reset': '/reset-password',
    'password.store': '/api/password/reset',
    'password.update': '/api/password',
    'password.confirm': '/confirm-password',
    'verification.send': '/api/email/verification-notification',
  };

  const handler = routes[name];
  let resolvedUrl = '#';

  if (typeof handler === 'function') {
    resolvedUrl = handler(params);
  } else if (typeof handler === 'string') {
    resolvedUrl = handler;
    if (params && typeof params === 'object') {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, val);
        }
      });
      const qs = searchParams.toString();
      if (qs) {
        resolvedUrl += `?${qs}`;
      }
    }
  } else {
    resolvedUrl = typeof name === 'string' && name.startsWith('/') ? name : `/${name ?? ''}`;
  }

  return resolvedUrl;
};

// Attach to window so existing JSX templates calling route(...) work without modification
if (typeof window !== 'undefined') {
  window.route = route;
}

function LogoutLink({ children, onClick, className, title, ...props }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleClick = async (event) => {
    onClick?.(event);
    if (event.defaultPrevented || processing) return;

    event.preventDefault();
    setProcessing(true);
    setError('');

    try {
      await logout();
      navigate('/', { replace: true });
    } catch (logoutError) {
      console.error('Unable to sign out.', logoutError);
      setError('Sign out failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <button
        {...props}
        type="button"
        className={className}
        title={title}
        disabled={processing || props.disabled}
        onClick={handleClick}
      >
        {processing ? 'Signing out…' : children}
      </button>
      {error && <span role="alert" className="ml-2 text-xs text-red-600">{error}</span>}
    </>
  );
}

/**
 * Universal Link component compatible with both href and to props.
 */
export const Link = React.forwardRef(({ href, to, children, method = 'get', as, ...props }, ref) => {
  const destination = to || href || '#';

  if (method.toLowerCase() === 'post' && destination === '/logout') {
    return <LogoutLink {...props}>{children}</LogoutLink>;
  }

  return (
    <RouterLink ref={ref} to={destination} {...props}>
      {children}
    </RouterLink>
  );
});

Link.displayName = 'Link';

/**
 * Universal Head component to update document title.
 */
export const Head = ({ title }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} - Kindred Path`;
    }
  }, [title]);

  return null;
};

/**
 * usePage hook replacement providing auth state and current props.
 */
export const usePage = () => {
  const { user } = useAuth();
  return {
    props: {
      auth: {
        user,
      },
    },
    url: window.location.pathname + window.location.search,
  };
};

/**
 * Global router object for programmatic navigation and API calls.
 */
export const router = {
  visit: (url, options = {}) => {
    if (options.data && Object.keys(options.data).length > 0) {
      const searchParams = new URLSearchParams(options.data);
      const targetUrl = url.includes('?') ? `${url}&${searchParams}` : `${url}?${searchParams}`;
      window.location.href = targetUrl;
    } else {
      window.location.href = url;
    }
  },
  get: (url, data = {}, options = {}) => {
    const searchParams = new URLSearchParams(data);
    const targetUrl = Object.keys(data).length > 0
      ? (url.includes('?') ? `${url}&${searchParams}` : `${url}?${searchParams}`)
      : url;
    window.location.href = targetUrl;
  },
  post: async (url, data = {}, options = {}) => {
    try {
      await getCsrfCookie();
      const apiUrl = url.startsWith('/api') ? url : `/api${url}`;
      const response = await api.post(apiUrl, data);
      if (options.onSuccess) options.onSuccess(response);
      return response;
    } catch (err) {
      if (options.onError) options.onError(err.response?.data?.errors || err);
      throw err;
    }
  },
  patch: async (url, data = {}, options = {}) => {
    try {
      await getCsrfCookie();
      const apiUrl = url.startsWith('/api') ? url : `/api${url}`;
      const response = await api.patch(apiUrl, data);
      if (options.onSuccess) options.onSuccess(response);
      return response;
    } catch (err) {
      if (options.onError) options.onError(err.response?.data?.errors || err);
      throw err;
    }
  },
  delete: async (url, options = {}) => {
    try {
      await getCsrfCookie();
      const apiUrl = url.startsWith('/api') ? url : `/api${url}`;
      const response = await api.delete(apiUrl);
      if (options.onSuccess) options.onSuccess(response);
      return response;
    } catch (err) {
      if (options.onError) options.onError(err.response?.data?.errors || err);
      throw err;
    }
  },
};

/**
 * useForm hook replacement providing state, error handling, and submission via Axios.
 */
export const useForm = (initialValues = {}) => {
  const [data, setDataState] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);

  const setData = (keyOrObject, value) => {
    if (typeof keyOrObject === 'string') {
      setDataState((prev) => ({ ...prev, [keyOrObject]: value }));
    } else if (typeof keyOrObject === 'function') {
      setDataState(keyOrObject);
    } else {
      setDataState((prev) => ({ ...prev, ...keyOrObject }));
    }
  };

  const reset = (...fields) => {
    if (fields.length === 0) {
      setDataState(initialValues);
    } else {
      setDataState((prev) => {
        const next = { ...prev };
        fields.forEach((f) => {
          next[f] = initialValues[f] !== undefined ? initialValues[f] : '';
        });
        return next;
      });
    }
  };

  const clearErrors = (...fields) => {
    if (fields.length === 0) {
      setErrors({});
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        fields.forEach((f) => delete next[f]);
        return next;
      });
    }
  };

  const submit = async (method, url, options = {}) => {
    setProcessing(true);
    clearErrors();
    try {
      await getCsrfCookie();
      const apiUrl = url.startsWith('/api') ? url : `/api${url}`;
      const response = await api[method.toLowerCase()](apiUrl, data);
      setRecentlySuccessful(true);
      setTimeout(() => setRecentlySuccessful(false), 3000);
      if (options.onSuccess) options.onSuccess(response);
      if (apiUrl.includes('/login') || apiUrl.includes('/register')) {
        window.location.href = '/dashboard';
      }
      return response;
    } catch (err) {
      const serverErrors = err.response?.data?.errors || {};
      setErrors(serverErrors);
      if (options.onError) options.onError(serverErrors);
      throw err;
    } finally {
      setProcessing(false);
      if (options.onFinish) options.onFinish();
    }
  };

  return {
    data,
    setData,
    errors,
    setErrors,
    clearErrors,
    processing,
    recentlySuccessful,
    reset,
    post: (url, options) => submit('post', url, options),
    put: (url, options) => submit('put', url, options),
    patch: (url, options) => submit('patch', url, options),
    delete: (url, options) => submit('delete', url, options),
  };
};
