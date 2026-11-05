import { z } from "zod";

/**
 * Mirrors the enquiry contract in docs/cargodev-api-integration.md
 * (section 7) and doc/design/ftj-website-brief.md (section 5). The client
 * form validates with its own hand-written rules for translated messages;
 * this schema is the server-side authority, used by the mock route below
 * until the real CargoDev enquiry endpoint exists.
 */
export const EnquirySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().min(1).max(150).email(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+() .-]{5,40}$/)
    .optional()
    .or(z.literal("")),
  country: z.string().trim().min(2).max(60),
  message: z.string().trim().min(10).max(2000),
  vehicle: z.string().max(200).optional(),
  // Honeypot: real visitors leave this empty; bots that fill it still get
  // a 202 from the real API, so this route mirrors that (see the route).
  website: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof EnquirySchema>;
