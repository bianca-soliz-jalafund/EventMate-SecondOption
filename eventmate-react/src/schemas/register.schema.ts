import { z } from "zod";
const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z
      .string()
      .email("Enter valid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must be less than 50 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords not match",
    path: ["confirmPassword"],
  });
type RegisterFormData = z.infer<typeof registerSchema>;

const defaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export { registerSchema, type RegisterFormData, defaultValues };
