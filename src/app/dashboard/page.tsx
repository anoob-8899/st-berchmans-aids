import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { StudentService, FacultyService } from '@/lib/services';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import FacultyDashboard from '@/components/dashboard/FacultyDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '32px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFEAE3', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px', color: '#1C1917' }}>
          Authentication Required
        </h1>
        <p style={{ color: '#756860', fontSize: '0.9rem', marginBottom: '24px' }}>
          Please sign in with your student, faculty, or administrator account to access the portal dashboard.
        </p>
        <Link href="/" style={{ padding: '10px 24px', background: '#1C1917', color: '#FFFFFF', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
          Return to Home & Sign In &rarr;
        </Link>
      </div>
    );
  }

  if (user.role === 'STUDENT' && user.status === 'PENDING') {
    return (
      <div style={{ maxWidth: '640px', margin: '80px auto', padding: '36px', background: '#FBF9F7', borderRadius: '16px', border: '1px solid #FDB27C', textAlign: 'center' }}>
        <span style={{ padding: '4px 12px', background: '#fef3c7', color: '#92400e', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
          REGISTRATION PENDING APPROVAL
        </span>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: 700, margin: '16px 0 12px', color: '#1C1917' }}>
          Account Awaiting Admin Review
        </h1>
        <p style={{ color: '#756860', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '24px' }}>
          Hello <strong>{user.fullName || user.username}</strong>. Your student account registration has been submitted successfully and is currently awaiting approval from the department administrator.
        </p>
        <div style={{ padding: '14px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #EFEAE3', fontSize: '0.85rem', color: '#1C1917' }}>
          Once approved by the Head of Department / System Administrator, full access to student resources and SYNAPSE portfolios will be granted.
        </div>
      </div>
    );
  }

  if (user.role === 'STUDENT') {
    const profile = await StudentService.getProfileByUserId(user.id);
    return <StudentDashboard user={user} profile={profile} />;
  }

  if (user.role === 'FACULTY') {
    const profile = await FacultyService.getFacultyByUserId(user.id, user.email);
    return <FacultyDashboard user={user} profile={profile} />;
  }

  if (user.role === 'ADMIN') {
    return <AdminDashboard user={user} />;
  }

  return <div>Role dashboard not found.</div>;
}
