'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, User, Mail, Lock, ShieldCheck, ArrowLeft, ArrowRight, Key, Upload, Camera } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) return;

    const cleanUserStr = username.trim().toLowerCase();
    const newAccount = {
      id: `usr-${Date.now()}`,
      name: fullName.trim(),
      username: cleanUserStr,
      email: email.trim().toLowerCase() || `${cleanUserStr}@sbcollege.ac.in`,
      role,
      identifier: identifier.trim() || (role === 'student' ? 'Roll: ' + Math.floor(240100 + Math.random() * 99) : 'Staff: FAC-AI-' + Math.floor(10 + Math.random() * 89)),
      department: 'Artificial Intelligence & Data Science',
      status: 'pending', // Pending Admin Approval
      approvalStatus: 'pending',
      lastLogin: 'Pending Approval',
      password: password.trim() || 'SBCollege@2026',
      photo: photo || '/images/sb college logo.jpg'
    };

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sb_managed_logins');
        const existingUsers = saved ? JSON.parse(saved) : [];
        const updated = [newAccount, ...existingUsers.filter((u: any) => u.username !== cleanUserStr && u.id !== newAccount.id)];
        localStorage.setItem('sb_managed_logins', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {}
    }

    setIsSubmitted(true);
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[#F7F8F9] px-4 py-12 sm:px-6">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
        
        {/* Header Logo */}
        <div className="space-y-3 text-center">
          <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
            <Image 
              src="/images/sb college logo new.jpg" 
              alt="St. Berchmans College Logo" 
              fill 
              className="object-contain" 
              priority 
            />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#12192B]">
              Create Department Account
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Department of AI &amp; Data Science · St. Berchmans College
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="space-y-5 text-center py-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-[#12192B]">
                Registration Request Submitted!
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Your account registration for <strong>{fullName}</strong> has been submitted.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <ShieldCheck className="w-4 h-4 text-[#FA7538]" />
                Admin Access Control Policy
              </div>
              <p className="text-[11px] text-amber-700">
                Only the Chief Administrator (<code>adminaids</code>) has permission to review, approve, and activate user logins for the website. Once approved by Admin, you will be able to log in.
              </p>
            </div>

            <Link
              href="/portal"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#12192B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#FA7538] transition shadow-sm w-full"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Login Page
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4 text-xs">
            {/* Account Role Selector */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                I am registering as: *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    role === 'student'
                      ? 'bg-[#FA7538] text-white border-[#FA7538]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('faculty')}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    role === 'faculty'
                      ? 'bg-[#2E7D50] text-white border-[#2E7D50]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Faculty
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Firstname Secondname"
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
                />
              </div>
            </div>

            {/* Desired Username */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Username *
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="firstname_secondname"
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Format: firstname_secondname
              </p>
            </div>

            {/* Official Email */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="firstname_secondname@sbcollege.ac.in"
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
                />
              </div>
            </div>

            {/* Roll No / Staff ID */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {role === 'student' ? 'Roll Number' : 'Staff ID'}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === 'student' ? '400' : 'FAC-AI-01'}
                className="w-full rounded-xl border border-slate-300 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {role === 'student' ? 'Roll number format e.g. 400' : 'Staff ID format e.g. FAC-AI-01'}
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Create Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#FA7538]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#FA7538] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#E86326] cursor-pointer"
            >
              Submit Registration Request <ArrowRight className="h-4 w-4" />
            </button>

            <div className="border-t border-slate-100 pt-3 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/portal" className="font-bold text-[#FA7538] hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
