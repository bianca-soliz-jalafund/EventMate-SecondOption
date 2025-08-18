const AuthDivider = () => {
  return (
    <div className="my-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-pink-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-pink-100 px-3 text-pink-700 font-medium">
            Or continue with
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthDivider;
