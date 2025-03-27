import { OnboardingForm } from "@/components/forms/onboarding/OnboardingForm";
import { prisma } from "../utils/db";
import { redirect } from "next/navigation";
import { requireUser } from "../utils/requireUser";

async function checkIfUserHasFinishedOnboarding(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      onboardingCompleted: true,
    },
  });

  // If the user has finished onboarding, redirect to the index page
  if (user?.onboardingCompleted === true) {
    return redirect("/");
  }

  return user;
}

export default async function OnboardingPage() {
  const user = await requireUser();

  await checkIfUserHasFinishedOnboarding(user.id as string);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10">
      <OnboardingForm />
    </div>
  );
}
