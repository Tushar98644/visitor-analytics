import { z } from 'zod';

export const VisitorEventSchema = z.object({
  type: z.enum(['pageview', 'click', 'session_end']),
  page: z.string().min(1,{message: "Page is required"}),
  sessionId: z.string().min(1,{message: "Session ID is required"}),
  timestamp: z.string().regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,
    { message: "Invalid ISO timestamp format" }
  ),
  country: z.string().min(2, { message: "Country code must be at least 2 characters" }),
  metadata: z.record(z.string(),z.unknown()).optional(),
});

export type VisitorEvent = z.infer<typeof VisitorEventSchema>;