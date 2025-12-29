'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Recruitment System</h1>
          <div className="space-x-4">
            <Link href="/login" className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600">
              Login
            </Link>
            <Link href="/register" className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Recruitment System</h1>
          <div>
            <span className="mr-4">Welcome, {user.name}</span>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded">
              <h3 className="font-bold">Name</h3>
              <p>{user.name}</p>
            </div>
            <div className="p-4 border rounded">
              <h3 className="font-bold">Email</h3>
              <p>{user.email}</p>
            </div>
            <div className="p-4 border rounded">
              <h3 className="font-bold">Role</h3>
              <p>{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
