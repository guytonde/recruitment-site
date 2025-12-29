'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { YEAR_LABELS } from '@/lib/constants';


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Use useEffect to handle redirect
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-12">Your Dashboard</h1>

        {/* User Info Card */}
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 mb-8">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <p className="text-gray-400 text-sm">First Name</p>
              <p className="text-xl font-bold">{user.firstName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Last Name</p>
              <p className="text-xl font-bold">{user.lastName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-lg font-bold break-all">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">EID</p>
              <p className="text-xl font-bold">{user.eid || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Major</p>
              <p className="text-xl font-bold">{user.major || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Year</p>
              <p className="text-xl font-bold">
                {user.year ? YEAR_LABELS[user.year as keyof typeof YEAR_LABELS] : 'Not provided'}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm">Role</p>
            <p className="text-xl font-bold">{user.role || 'Not provided'}</p>
          </div>
        </div>

        {/* Applicant Section */}
        {user.role === 'applicant' && (
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Applications</h2>
            <p className="text-gray-400 mb-6">
              Ready to apply? Start your application to one of our teams.
            </p>
            <Link 
              href="/apply"
              className="inline-block bg-teal-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-600 transition"
            >
              Start Application
            </Link>
          </div>
        )}

        {/* Admin Section */}
        {user.role === 'admin' && (
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
            <p className="text-gray-400">
              Admin features coming soon. You'll be able to manage applications, phases, and more here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
