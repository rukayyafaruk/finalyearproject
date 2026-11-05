import React, { useState, useEffect } from 'react';
import { interactionsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './Dashboard/AdminDashboard';
import SchoolDashboard from './Dashboard/SchoolDashboard';
import ParentDashboard from './Dashboard/ParentDashboard';
import { Loader2 } from 'lucide-react';

export default function Dashboard(props) {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    interactionsApi.getDashboard()
      .then((res) => {
        if (isMounted) {
          setDashboardData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load dashboard data.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-4" />
        <p className="text-sm">Loading your personalized dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-6">
        <div className="bg-slate-900 border border-red-500/30 p-8 rounded-2xl max-w-md text-center">
          <p className="text-red-400 font-semibold mb-2">Error Loading Dashboard</p>
          <p className="text-sm text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const role = dashboardData?.role || user?.role || 'parent';

  if (role === 'admin') {
    return <AdminDashboard {...dashboardData} />;
  }

  if (role === 'school') {
    return <SchoolDashboard {...dashboardData} />;
  }

  return <ParentDashboard {...dashboardData} />;
}
