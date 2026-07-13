
const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-5">

        {/* Modern Circle Loader */}
        <div className="relative flex h-20 w-20 items-center justify-center">

          {/* Light background circle */}
          <div className="absolute inset-0 rounded-full border-[5px] border-gray-100" />

          {/* Outer rotating circle */}
          <div className="absolute inset-0 animate-spin rounded-full border-[5px] border-transparent border-t-red-500 border-r-red-300" />

          {/* Inner rotating circle */}
          <div className="absolute h-12 w-12 animate-[spin_1.2s_linear_infinite_reverse] rounded-full border-4 border-transparent border-b-red-500 border-l-red-300" />

          {/* Center pulse */}
          <div className="h-3 w-3 animate-pulse rounded-full bg-red-500 shadow-lg shadow-red-300" />

        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Loading
            <span className="animate-pulse">...</span>
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Please wait a moment
          </p>
        </div>

      </div>
    </div>
  );
};

export default Loader;

