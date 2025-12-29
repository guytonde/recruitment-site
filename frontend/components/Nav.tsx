'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function Nav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-[#2a2420] border-b border-[#3a3430] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <Link href="/" className="text-2xl font-bold text-[#FF8C00]">
            🚗 Solar Car Recruitment
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/dashboard" 
              className="text-[#e8e8e8] hover:text-[#BF5700] transition font-medium"
            >
              Dashboard
            </Link>
            
            <Link 
              href="/about" 
              className="text-[#e8e8e8] hover:text-[#BF5700] transition font-medium"
            >
              About
            </Link>
            
            <Link 
              href="/faqs" 
              className="text-[#e8e8e8] hover:text-[#BF5700] transition font-medium"
            >
              FAQs
            </Link>

            {user?.role === 'applicant' && (
              <Link 
                href="/apply" 
                className="bg-[#BF5700] text-white px-4 py-2 rounded font-medium hover:bg-[#FF8C00] transition"
              >
                Apply
              </Link>
            )}

            {user ? (
              <>
                <span className="text-[#3a3430]">|</span>
                <span className="text-sm text-[#b8b8b8]">Hi, {user.firstName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-[#DC143C] text-white px-4 py-2 rounded font-medium hover:bg-[#B91230] transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <span className="text-[#3a3430]">|</span>
                <Link 
                  href="/login" 
                  className="text-[#e8e8e8] hover:text-[#BF5700] transition font-medium"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-[#BF5700] text-white px-4 py-2 rounded font-medium hover:bg-[#FF8C00] transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
