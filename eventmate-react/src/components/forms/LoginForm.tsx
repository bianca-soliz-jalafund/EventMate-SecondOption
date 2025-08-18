import { useAuth } from "@/contexts/auth/AuthContext";
import {
  defaultValues,
  loginSchema,
  type LoginFormData,
} from "@/schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import InputForm from "../InputForm";
import FormDivider from "./form-components/AuthDivider";
import PasswordInput from "./form-components/PasswordInput";

interface LoginFormProps {
  handleSuccessLogin: (provider: string, email: string) => void;
}

const LoginForm = ({ handleSuccessLogin }: LoginFormProps) => {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      await signInWithEmail(data.email, data.password);
      handleSuccessLogin("email", data.email);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    await signInWithGoogle();
    handleSuccessLogin("google", "");
  };

  return (
    <div className="bg-pink-100 rounded-2xl shadow-xl border border-pink-200 p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          disabled={!isValid || isLoading}
        >
          {!isLoading && <span>Sign in</span>}
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
        Sign in with Google
      </Button>
    </div>
  );
};

export default LoginForm;
