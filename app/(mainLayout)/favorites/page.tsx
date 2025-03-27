import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { EmptyState } from "@/components/general/EmptyState";
import { JobCard } from "@/components/general/JobCard";

async function getFavorites(userId: string) {
  const data = await prisma.savedJobPost.findMany({
    where: {
      userId,
    },
    select: {
      JobPost: {
        select: {
          id: true,
          jobTitle: true,
          salaryFrom: true,
          salaryTo: true,
          location: true,
          employmentType: true,
          createdAt: true,
          Company: {
            select: {
              name: true,
              logo: true,
              location: true,
              about: true,
            },
          },
        },
      },
    },
  });
  return data;
}

export default async function FavoritesPage() {
  const user = await requireUser();
  const data = await getFavorites(user.id as string);

  if (data.length === 0) {
    return (
      <EmptyState
        title="No favorites found"
        description="You have no favorites yet"
        buttonText="Find a Jobs"
        href="/jobs"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 mt-5 gap-4">
      {/* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */}
      {data.map((favorite) => (
        <JobCard key={favorite.JobPost.id} job={favorite.JobPost} />
      ))}
    </div>
  );
}
