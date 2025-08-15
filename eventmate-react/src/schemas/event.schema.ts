import { z } from "zod";

const eventFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  date: z.string().min(1, "Date is required"),
  place: z.string().min(1, "Place is required"),
  category: z.string().min(1, "Category is required"),
  image: z.any().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

const defaultEventFormData: EventFormData = {
  title: "",
  description: "",
  date: "",
  place: "",
  category: "",
  image: undefined,
};

export { eventFormSchema, type EventFormData, defaultEventFormData };
