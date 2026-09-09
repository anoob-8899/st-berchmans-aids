'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/types';
import { useAdminEdit } from '@/lib/AdminEditContext';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  User,
  AlertTriangle 
} from 'lucide-react';

export default function UnifiedPortalLoginPage() {
  const router = useRouter();
  const { setIsAdminLoggedIn } = useAdminEdit();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkSuspended = (inputEmail: string): boolean => {
    try {
      const saved = localStorage.getItem('sb_managed_logins');
      if (saved) {
        const users = JSON.parse(saved);
        const match = users.find((u: any) => u.email.toLowerCase() === inputEmail.toLowerCase());
        if (match && match.status === 'suspended') {
          return true;
        }
      }
    } catch (e) {}
    return false;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Check if account is suspended by administrator
    if (checkSuspended(email)) {
      setErrorMessage('Access Denied: This account is currently suspended by the department administrator. Please contact aids@sbcollege.ac.in.');
      return;
    }

    setIsLoading(true);

    if (selectedRole === 'admin') {
      setIsAdminLoggedIn(true);
    } else {
      setIsAdminLoggedIn(false);
    }

    setTimeout(() => {
      if (selectedRole === 'student') {
        router.push('/portal/student');
      } else if (selectedRole === 'faculty') {
        router.push('/portal/faculty');
      } else {
        router.push('/portal/admin');
      }
    }, 600);
  };

  const quickLogin = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);

    if (role === 'student') {
      setIsAdminLoggedIn(false);
      setEmail('kevin.paul@student.sbcollege.ac.in');
      setPassword('••••••••');
      router.push('/portal/student');
    } else if (role === 'faculty') {
      setIsAdminLoggedIn(false);
      setEmail('hod.aids@sbcollege.ac.in');
      setPassword('••••••••');
      router.push('/portal/faculty');
    } else {
      setIsAdminLoggedIn(true);
      setEmail('admin.aids@sbcollege.ac.in');
      setPassword('••••••••');
      router.push('/portal/admin');
    }
  };

  return (
    <div className="bg-[#F7F8F9] min-h-screen flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-[#12192B]/20 bg-white p-1 shadow-sm">
            <Image
              src="/images/sb college logo.jpg"
              alt="St. Berchmans Logo"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#12192B]">
              Department Login
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              One common login for Students, Faculty & Administrators
            </p>
          </div>
        </div>

        {/* Quick Demo Role Switcher */}
        <div className="bg-[#F7F8F9] p-3 rounded-2xl border border-slate-200 space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            ⚡ Instant Role Login (Demo Showcase)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => quickLogin('student')}
              className="py-2 px-2 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-700 hover:bg-[#FFF5F0] hover:text-[#FA7538] hover:border-[#FA7538]/40 transition shadow-xs cursor-pointer"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => quickLogin('faculty')}
              className="py-2 px-2 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-700 hover:bg-[#EEF8F2] hover:text-[#2E7D50] hover:border-[#2E7D50]/40 transition shadow-xs cursor-pointer"
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => quickLogin('admin')}
              className="py-2 px-2 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white transition shadow-xs cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Access Role</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'student', label: 'Student' },
                { id: 'faculty', label: 'Faculty' },
                { id: 'admin', label: 'Admin' },
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id as UserRole)}
                  className={`py-2 px-2 rounded-xl font-bold uppercase tracking-wider transition ${
                    selectedRole === r.id
                      ? 'bg-[#12192B] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Official Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="id@sbcollege.ac.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input type="checkbox" defaultChecked className="rounded text-[#FA7538]" />
              <span>Remember me</span>
            </label>
            <a href="#" className="font-semibold text-[#FA7538] hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-full font-bold text-xs uppercase tracking-wider bg-[#FA7538] text-white hover:bg-[#E86326] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isLoading ? 'Authenticating...' : `Enter ${selectedRole.toUpperCase()} Dashboard`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          Need an account? Contact Department Office: <span className="text-slate-600 font-medium">aids@sbcollege.ac.in</span>
        </div>
      </div>
    </div>
  );
}