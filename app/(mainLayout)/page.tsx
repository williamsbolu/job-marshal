import { Suspense } from "react";
import { JobFilter } from "@/components/general/JobFilter";
import { JobListingLoading } from "@/components/general/JobListingLoading";
import { JobListings } from "@/components/general/JobListings";

type searchParams = {
  searchParams: Promise<{
    page?: string;
    jobTypes?: string;
    location?: string;
  }>;
};

export default async function Home({ searchParams }: searchParams) {
  const params = await searchParams;

  const currentPage = Number(params.page) || 1;
  console.log(params.jobTypes);
  const jobTypes = params.jobTypes?.split(",") || [];
  const jobLocation = params.location || "";

  const filterKey = `page=${currentPage};types=${jobTypes.join(
    ","
  )};location=${jobLocation}`;

  return (
    <div className="grid grid-cols-3 gap-8">
      <JobFilter />

      <div className="col-span-2 flex flex-col gap-6">
        <Suspense key={filterKey} fallback={<JobListingLoading />}>
          <JobListings
            currentPage={currentPage}
            jobTypes={jobTypes}
            jobLocation={jobLocation}
          />
        </Suspense>
      </div>
    </div>
  );
}
