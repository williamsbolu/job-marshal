import { notFound } from "next/navigation";
import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { EditJobForm } from "@/components/forms/EditJobForm";

async function getData(jobId: string, userId: string) {
  // Only the user that created should be able to view the job
  const data = await prisma.jobPost.findUnique({
    where: {
      id: jobId,
      Company: {
        userId: userId,
      },
    },
    select: {
      benefits: true,
      id: true,
      jobTitle: true,
      jobDescription: true,
      salaryFrom: true,
      salaryTo: true,
      location: true,
      employmentType: true,
      listingDuration: true,
      Company: {
        select: {
          name: true,
          logo: true,
          about: true,
          website: true,
          xAccount: true,
          location: true,
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

type Params = Promise<{ jobId: string }>;

export default async function EditJob({ params }: { params: Params }) {
  const { jobId } = await params;
  const user = await requireUser();

  const data = await getData(jobId, user.id!);

  return <EditJobForm jobPost={data} />;
}
