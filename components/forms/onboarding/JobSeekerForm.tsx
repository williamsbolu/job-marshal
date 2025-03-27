import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { jobSeekerSchema } from "@/app/utils/zodSchemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/general/UploadThingReexported";
import { createJobSeeker } from "@/app/actions";
import { useState } from "react";

export function JobSeekerForm() {
  const [pending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof jobSeekerSchema>>({
    resolver: zodResolver(jobSeekerSchema),
    defaultValues: {
      about: "",
      name: "",
      resume: "",
    },
  });

  async function onSubmit(data: z.infer<typeof jobSeekerSchema>) {
    try {
      setIsPending(true);
      await createJobSeeker(data);
    } catch (error) {
      // 3hr 3min
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        console.log("Something went wrong");
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself..." {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume (PDF)</FormLabel>
              <FormControl>
                {field.value ? (
                  <div className="relative w-fit">
                    <Image
                      src="/pdf.png"
                      alt="pdf resume img"
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                    <Button
                      type="button"
                      variant={"destructive"}
                      size="icon"
                      className="absolute -top-2 -right-2"
                      onClick={() => field.onChange("")} //remove the selected saved image from the form state // TODO: Later i can delete image stored on my storage whenever the user cancels an image upload.
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <UploadDropzone
                    endpoint="resumeUploader"
                    onClientUploadComplete={(res) => {
                      field.onChange(res[0].ufsUrl);
                    }}
                    onUploadError={(err) => {
                      console.log("Something went wront");
                      console.log(err);
                    }}
                    className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary"
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
