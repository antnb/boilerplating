import { z } from "zod";

export const updatePageSectionSchema = z.object({
  pageKey: z.string().min(1, "Page key wajib"),
  sectionKey: z.string().min(1, "Section key wajib"),
  data: z.record(z.unknown()),
});

export type UpdatePageSectionInput = z.infer<typeof updatePageSectionSchema>;
