import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { CreateJobForm } from "@/components/forms/CreateJobForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ArjetLogo from "@/public/arcjet.jpg";
import injestLogo from "@/public/inngest-locale.png";
import Image from "next/image";
import { redirect } from "next/navigation";

const companies = [
  { id: 0, name: "Arcjet", logo: ArjetLogo },
  { id: 1, name: "Injest", logo: injestLogo },
  { id: 2, name: "Arcjet", logo: ArjetLogo },
  { id: 3, name: "Injest", logo: injestLogo },
  { id: 4, name: "Arcjet", logo: ArjetLogo },
  { id: 5, name: "Injest", logo: injestLogo },
];

const testimonials = [
  {
    quote:
      "We found our ideal candidate within 48hours of posting. The quality of applicants was exceptional!",
    author: "Sarah Chen",
    company: "TechCorp",
  },
  {
    quote:
      "This platform made hiring remote talent incredibly simple. Highly recommended!",
    author: "Mark Johnson",
    company: "StartupX",
  },
  {
    quote:
      "We've consistently found high-quality candidates here. It's our go-to platform for all our hiring needs.",
    author: "Emily Rodriguez",
    company: "InnovateNow",
  },
];

const stats = [
  { id: 0, value: "10k+", label: "Montly active job seekers" },
  { id: 1, value: "48h", label: "Average time to hire" },
  { id: 2, value: "95%", label: "Employer satisfaction rate" },
  { id: 3, value: "500+", label: "Companies hiring remotely" },
];

async function getCompany(userId: string) {
  // Find a company where the userId matches the posters userId
  const data = await prisma.company.findUnique({
    where: {
      userId,
    },
    select: {
      name: true,
      location: true,
      about: true,
      logo: true,
      xAccount: true,
      website: true,
    },
  });

  // if the user does not have a company
  if (!data) {
    return redirect("/");
  }

  return data;
}

export default async function PostJobPage() {
  const user = await requireUser();
  const data = await getCompany(user.id as string);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
      <CreateJobForm
        companyAbout={data.about}
        companyLogo={data.logo}
        companyName={data.name}
        companyWebsite={data.website}
        companylocation={data.location}
        companyXAccount={data.xAccount}
      />

      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Trusted by Industry Leaders
            </CardTitle>
            <CardDescription>
              Join thousands of companies hiring top talent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Logos */}
            <div className="grid grid-cols-3 gap-4">
              {companies.map((company) => (
                <div key={company.id} className="">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={80}
                    height={80}
                    className="rounded-lg opacity-75 transition-opacity hover:opacity-100"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <blockquote
                  key={index}
                  className="border-l-2 border-primary pl-4"
                >
                  <p className="text-sm text-muted-foreground italic">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <footer className="mt-2 text-sm font-medium">
                    - {testimonial.author}, {testimonial.company}
                  </footer>
                </blockquote>
              ))}
            </div>

            {/* We will render stats here */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.id} className="rounded-lg bg-muted p-4">
                  <h4 className="text-2xl font-bold">{stat.value}</h4>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
