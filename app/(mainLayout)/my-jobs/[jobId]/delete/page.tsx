import { deleteJobPost } from "@/app/actions";
import { requireUser } from "@/app/utils/requireUser";
import { GeneralSubmitButton } from "@/components/general/SubmitButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, TrashIcon } from "lucide-react";
import Link from "next/link";

type Params = Promise<{ jobId: string }>;

export default async function DeleteJob({ params }: { params: Params }) {
  const { jobId } = await params;
  await requireUser();

  return (
    <div className="">
      <Card className="max-w-lg mx-auto mt-24">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete your job
            listing and remove all of your data from our servers.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center gap-4 justify-between">
          <Link
            href="/my-jobs"
            className={buttonVariants({ variant: "secondary" })}
          >
            <ArrowLeft />
            Cancel
          </Link>

          <form
            action={async () => {
              "use server";

              await deleteJobPost(jobId);
            }}
          >
            <GeneralSubmitButton
              text="Delete Job"
              variant="destructive"
              icon={<TrashIcon />}
            />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
