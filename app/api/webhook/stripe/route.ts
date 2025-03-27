// localhost:3000/api/webhook/stripe

import { prisma } from "@/app/utils/db";
import { stripe } from "@/app/utils/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();

  const headersList = await headers();

  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new Response(`Webhook error`, {
      status: 400,
    });
  }

  // Get the session
  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const customerId = session.customer;
    const jobId = session.metadata?.jobId;

    if (!jobId) {
      return new Response(`No job id found`, {
        status: 400,
      });
    }

    // get the companyId by the user
    const company = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId as string,
      },
      select: {
        Company: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!company) {
      return new Response(`No company found for user`, {
        status: 400,
      });
    }

    console.log("updating status");

    await prisma.jobPost.update({
      where: {
        id: jobId,
        companyId: company?.Company?.id,
      },
      data: {
        status: "ACTIVE",
      },
    });
  }

  // Return a successful response
  return new Response(null, {
    status: 200,
  });
}
