import * as z from "zod";

export const DevFormSchema = z.object({
    name: z
      .string()
      .nonempty("Please specify an name"),
    email: z
      .string()
      .nonempty("Please specify an email")
      .email("Please specify a valid email"),
  });