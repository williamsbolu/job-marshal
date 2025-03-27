import { prisma } from "@/app/utils/db";
import { EmptyState } from "./EmptyState";
import { JobCard } from "./JobCard";
import { MainPagination } from "./MainPagination";
import { JobPostStatus } from "@prisma/client";

async function getData({
  page = 1,
  pageSize = 2,
  jobTypes = [],
  jobLocation = "",
}: {
  page: number;
  pageSize: number;
  jobTypes: string[];
  jobLocation: string;
}) {
  const skip = (page - 1) * pageSize;

  const where = {
    status: JobPostStatus.ACTIVE,
    ...(jobTypes.length > 0 && {
      employmentType: {
        in: jobTypes,
      },
    }),
    ...(jobLocation &&
      jobLocation !== "worldwide" && {
        location: jobLocation,
      }),
  };

  const [data, totalCount] = await Promise.all([
    prisma.jobPost.findMany({
      where: where,
      take: pageSize,
      skip: skip,
      select: {
        id: true,
        jobTitle: true,
        employmentType: true,
        location: true,
        salaryFrom: true,
        salaryTo: true,
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
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.jobPost.count({
      where: {
        status: "ACTIVE",
      },
    }),
  ]);

  // Ceil: rounds the number up to the nearest integer: eg 3.1 -> 4, 3.6 -> 4
  return { jobs: data, totalPages: Math.ceil(totalCount / pageSize) };
}

export async function JobListings({
  currentPage,
  jobTypes,
  jobLocation,
}: {
  currentPage: number;
  jobTypes: string[];
  jobLocation: string;
}) {
  const { jobs, totalPages } = await getData({
    page: currentPage,
    pageSize: 2,
    jobTypes,
    jobLocation,
  });

  return (
    <>
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try searching for a different job title or location"
          buttonText="Clear all filters"
          href="/"
        />
      )}

      <div className="flex justify-center mt-6">
        <MainPagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </>
  );
}
