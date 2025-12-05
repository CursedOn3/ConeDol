import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    redirect('/home');
  }

  const [userCount, contentCount, watchlistCount, continueWatchingCount] = await Promise.all([
    prisma.user.count(),
    prisma.customContent.count(),
    prisma.watchlist.count(),
    prisma.continueWatching.count(),
  ]);

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />

      <div className="pt-24 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Admin Dashboard</h1>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-netflix-darkGray p-6 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-2">Total Users</h3>
              <p className="text-3xl font-bold">{userCount}</p>
            </div>
            <div className="bg-netflix-darkGray p-6 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-2">Custom Content</h3>
              <p className="text-3xl font-bold">{contentCount}</p>
            </div>
            <div className="bg-netflix-darkGray p-6 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-2">Watchlist Items</h3>
              <p className="text-3xl font-bold">{watchlistCount}</p>
            </div>
            <div className="bg-netflix-darkGray p-6 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-2">Continue Watching</h3>
              <p className="text-3xl font-bold">{continueWatchingCount}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/admin/content/add"
                className="px-6 py-3 bg-netflix-red hover:bg-red-700 rounded transition-colors"
              >
                Add Custom Content
              </Link>
              <Link
                href="/admin/content"
                className="px-6 py-3 bg-netflix-gray hover:bg-netflix-lightGray rounded transition-colors"
              >
                Manage Content
              </Link>
              <Link
                href="/admin/users"
                className="px-6 py-3 bg-netflix-gray hover:bg-netflix-lightGray rounded transition-colors"
              >
                Manage Users
              </Link>
            </div>
          </div>

          {/* Recent Users */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Users</h2>
            <div className="bg-netflix-darkGray rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-netflix-gray">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user: { id: string; name: string | null; email: string | null; createdAt: Date }) => (
                    <tr key={user.id} className="border-t border-netflix-gray">
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
