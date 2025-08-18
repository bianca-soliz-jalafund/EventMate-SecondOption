import { z } from "zod";
const loginSchema = z.object({
  email: z
    .string()
    .email("Enter valid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const defaultValues = {
  email: "",
  password: "",
};

export { loginSchema, type LoginFormData, defaultValues };
