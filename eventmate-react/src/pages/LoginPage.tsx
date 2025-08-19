import LoginForm from "@/components/forms/LoginForm";
import { Container } from "@/components/ui/Container";
const LoginPage = () => {
  const handleSuccessLogin = () => {
    console.log("Login successful");
    location.href = "/";
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-neutral-800 text-gray-200">
      <Container>
        {/* La "tarjeta" de login con estilos modernos */}
        <div className="max-w-md w-full mx-auto bg-pink-300/50 p-8 rounded-xl shadow-lg shadow-pink-500/10 border border-pink-500/20">
          <div className="text-center mb-8">
            {/* Título con un gradiente de color para un toque extra */}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-400 text-transparent bg-clip-text mb-2">
              Welcome Back
            </h1>
            <p className="text-white">Sign in to continue</p>
          </div>

          <LoginForm handleSuccessLogin={handleSuccessLogin} />

          <div className="text-center mt-8">
            <p className="text-gray-400">
              Don't have an account yet?{" "}
              <a
                href="/register"
                style={{ color: "white" }}
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default LoginPage;
