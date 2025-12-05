import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfileSelector } from '@/components/ProfileSelector';

export default async function ProfilesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const profiles = await prisma.profile.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return <ProfileSelector profiles={profiles} />;
}
