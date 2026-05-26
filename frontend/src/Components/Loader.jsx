const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      
      <div className="flex flex-col items-center gap-4">

        <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

        <h2 className="text-lg font-semibold text-gray-700">
          Loading...
        </h2>

      </div>

    </div>
  );
};

export default Loader;