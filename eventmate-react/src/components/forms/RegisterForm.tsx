import { useAuth } from "@/contexts/auth/AuthContext";
import {
  defaultValues,
  registerSchema,
  type RegisterFormData,
} from "@/schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import InputForm from "../InputForm";
import FormDivider from "./form-components/AuthDivider";
import PasswordInput from "./form-components/PasswordInput";

interface RegisterFormProps {
  handleSuccessRegister: () => void;
}

const RegisterForm = ({ handleSuccessRegister }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await signUpWithEmail(data.email, data.password, data.name);
      handleSuccessRegister();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = () => {
    signInWithGoogle();
  };

  return (
    <div className="bg-pink-100 rounded-2xl shadow-xl border border-pink-200 p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <InputForm
          {...register("name")}
          label="Name"
          type="text"
          placeholder="Enter your name"
          leftIcon={<User className="h-4 w-4" />}
          errorMessage={errors.name?.message}
          fullWidth
          className="transition-all duration-200"
        />
        <InputForm
          {...register("email")}
          label="Email address"
          type="email"
          placeholder="Enter your email"
          leftIcon={<Mail className="h-4 w-4" />}
          errorMessage={errors.email?.message}
          fullWidth
          className="transition-all duration-200"
        />

        <PasswordInput
          register={register}
          label="Password"
          placeholder="Enter your password"
          leftIcon={<Lock className="h-4 w-4" />}
          errorMessage={errors.password?.message}
          fullWidth
          className="transition-all duration-200"
        />

        <PasswordInput
          register={register}
          keyName="confirmPassword"
          label="Confirm Password"
          placeholder="Enter your password"
          leftIcon={<Lock className="h-4 w-4" />}
          errorMessage={errors.confirmPassword?.message}
          fullWidth
          className="transition-all duration-200"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          disabled={!isValid || isLoading}
        >
          {!isLoading && <span>Sign up</span>}
        </Button>
      </form>
      <FormDivider />
      <Button
        type="button"
        fullWidth
        variant="secondary"
        onClick={handleSocialLogin}
        disabled={isLoading}
      >
        Sign up with Google
      </Button>
    </div>
  );
};

export default RegisterForm;
