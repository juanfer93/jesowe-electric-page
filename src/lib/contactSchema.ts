import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().trim().max(80).optional().or(z.literal("")),
  lastName: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email."),
  message: z.string().trim().min(2, "Please enter your message.").max(4000)
});

export type ContactFormValues = z.infer<typeof contactSchema>;
