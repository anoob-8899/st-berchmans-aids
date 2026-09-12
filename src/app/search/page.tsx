import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTicker from '@/components/LiveTicker';
import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Dynamic search

export const metadata = {
  title: 'Search Database | AI & Data Science - St. Berchmans College',
  description: 'Search across faculty members, academic notes, student profiles, projects, and events.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams?.q?.trim() || '';

  let faculty: any[] = [];
  let notes: any[] = [];
  let students: any[] = [];
  let projects: any[] = [];
  let events: any[] = [];

  if (query) {
    [faculty, notes, students, projects, events] = await Promise.all([
      prisma.facultyProfile.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { specialization: { contains: query } },
            { designation: { contains: query } },
          ],
        },
      }),
      prisma.academicNote.findMany({
        where: {
          approved: true,
          OR: [
            { title: { contains: query } },
            { subjectName: { contains: query } },
          ],
        },
      }),
      prisma.studentProfile.findMany({
        where: {
          user: { status: 'APPROVED' },
          OR: [
            { fullName: { contains: query } },
            { bio: { contains: query } },
          ],
        },
      }),
      prisma.studentProject.findMany({
        where: {
          approved: true,
          OR: [
            { title: { contains: query } },
            { domain: { contains: query } },
            { summary: { contains: query } },
          ],
        },
      }),
      prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { venue: { contains: query } },
          ],
        },
      }),
    ]);
  }

  const totalResults = faculty.length + notes.length + students.length + projects.length + events.length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FBF9F7' }}>
      <Header />
      <LiveTicker />

      <main style={{ flex: 1 }}>
        {/* Search Header */}
        <section style={{ background: 'linear-gradient(135deg, #1C1917 0%, #231F1C 100%)', color: '#ffffff', padding: '50px 0', borderBottom: '4px solid #FDB27C' }}>
          <div className="container">
            <div style={{ maxWidth: '720px' }}>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px' }}>
                Department Database Search
              </h1>
              
              <form action="/search" method="GET" style={{ display: 'flex', gap: '12px', background: '#ffffff', padding: '6px', borderRadius: '14px', border: '2px solid #FDB27C' }}>
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Search faculty, notes, subjects, projects, events..."
                  style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', padding: '10px 16px', fontSize: '1rem', color: '#1C1917' }}
                />
                <button type="submit" className="btn btn-primary" style={{ borderRadius: '10px', background: '#005691' }}>
                  Search
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section style={{ padding: '60px 0' }}>
          <div className="container">
            {!query ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '20px', border: '1px solid #EFEAE3' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '8px' }}>
                  Enter a search term above
                </h3>
                <p style={{ color: '#756860', fontSize: '0.94rem' }}>
                  Try searching for "Deep Learning", "Antony Joseph", "Python", "SYNAPSE", or "Machine Learning".
                </p>
              </div>
            ) : totalResults === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '20px', border: '1px solid #EFEAE3' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '8px' }}>
                  No Database Records Found for "{query}"
                </h3>
                <p style={{ color: '#756860', fontSize: '0.94rem' }}>
                  No matching faculty members, academic notes, student profiles, projects, or events were found in the department database.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <div style={{ fontSize: '1rem', color: '#756860', fontWeight: 600 }}>
                  Found <strong>{totalResults}</strong> result(s) for "{query}":
                </div>

                {/* Faculty Matches */}
                {faculty.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '16px', borderBottom: '2px solid #EFEAE3', paddingBottom: '8px' }}>
                      Faculty Members ({faculty.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                      {faculty.map((f) => (
                        <div key={f.id} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1.5px solid #EFEAE3' }}>
                          <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', color: '#1C1917', marginBottom: '4px' }}>
                            {f.name}
                          </h4>
                          <div style={{ fontSize: '0.82rem', color: '#b91c1c', fontWeight: 700, marginBottom: '8px' }}>
                            {f.designation}
                          </div>
                          <p style={{ fontSize: '0.88rem', color: '#756860', margin: 0 }}>
                            {f.specialization}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Matches */}
                {notes.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '16px', borderBottom: '2px solid #EFEAE3', paddingBottom: '8px' }}>
                      Academic Notes ({notes.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                      {notes.map((n) => (
                        <div key={n.id} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1.5px solid #EFEAE3' }}>
                          <div style={{ fontSize: '0.78rem', color: '#005691', fontWeight: 700, marginBottom: '4px' }}>
                            Semester {n.semester} &bull; {n.subjectName}
                          </div>
                          <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', color: '#1C1917', marginBottom: '6px' }}>
                            {n.title}
                          </h4>
                          <div style={{ fontSize: '0.84rem', color: '#756860' }}>
                            Uploaded by {n.uploadedByName}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects Matches */}
                {projects.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '16px', borderBottom: '2px solid #EFEAE3', paddingBottom: '8px' }}>
                      Student Projects ({projects.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                      {projects.map((p) => (
                        <div key={p.id} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1.5px solid #EFEAE3' }}>
                          <span style={{ background: '#FDB27C', color: '#1C1917', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                            {p.domain}
                          </span>
                          <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', color: '#1C1917', marginTop: '8px', marginBottom: '6px' }}>
                            {p.title}
                          </h4>
                          <p style={{ fontSize: '0.88rem', color: '#756860', margin: 0 }}>
                            {p.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Events Matches */}
                {events.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '16px', borderBottom: '2px solid #EFEAE3', paddingBottom: '8px' }}>
                      Events ({events.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                      {events.map((e) => (
                        <div key={e.id} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1.5px solid #EFEAE3' }}>
                          <span style={{ background: '#005691', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                            {e.category}
                          </span>
                          <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', color: '#1C1917', marginTop: '8px', marginBottom: '6px' }}>
                            {e.title}
                          </h4>
                          <p style={{ fontSize: '0.88rem', color: '#756860', margin: 0 }}>
                            {e.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Students Matches */}
                {students.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1C1917', marginBottom: '16px', borderBottom: '2px solid #EFEAE3', paddingBottom: '8px' }}>
                      Student Profiles ({students.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                      {students.map((s) => (
                        <div key={s.id} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1.5px solid #EFEAE3' }}>
                          <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', color: '#1C1917', marginBottom: '4px' }}>
                            {s.fullName}
                          </h4>
                          <div style={{ fontSize: '0.82rem', color: '#756860' }}>
                            Batch {s.batch} &bull; Semester {s.semester}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
