interface LoaderProps {
  text?: string;
  className?: string;
}

const Loader = ({ text, className }: LoaderProps) => {
  return (
    <div
      className={`w-full h-screen flex flex-col items-center justify-center gap-3 bg-pink-50 ${className}`}
    >
      <div
        className="w-6 h-6 border-4 border-pink-500 border-t-transparent border-solid rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />

      {text && (
        <p className="text-sm text-pink-900 font-medium animate-pulse">
          {text}
        </p>
      )}

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
