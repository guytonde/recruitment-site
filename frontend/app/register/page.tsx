'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { YEAR_LABELS, MAJORS } from '@/lib/constants';



export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [eid, setEid] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName) {
      setError('First and last name required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 12) {
      setError('Password must be at least 12 characters');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain an uppercase letter');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain a number');
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setError('Password must contain a special character (!@#$%^&*)');
      return;
    }

    if (eid && eid.length > 10) {
      setError('EID must not exceed 10 characters');
      return;
    }

    setLoading(true);

    try {
      await register(
        email,
        password,
        firstName,
        lastName,
        eid,
        major,
        parseInt(year)
      );
      router.push('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#191a1a]">
      <div className="bg-gray-900 p-8 rounded shadow w-full max-w-md border border-gray-800">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white"
              required
            />
          </div>

          {/* EID */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">EID *</label>
            <input
              type="text"
              value={eid}
              onChange={(e) => setEid(e.target.value.slice(0, 10))}
              placeholder="e.g., lhr12345"
              maxLength={10}
              className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white"
              required
            />
          </div>

          {/* Major */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Major *</label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white"
              required
            >
              <option value="">Select a major</option>
              {MAJORS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white"
              required
            >
              <option value="">Select your year</option>
              {Object.entries(YEAR_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Min 12 chars, 1 uppercase, 1 number, 1 special char (!@#$%^&*)
            </p>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-700 rounded px-3 py-2 bg-gray-800 text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 disabled:opacity-50 font-bold"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-teal-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
