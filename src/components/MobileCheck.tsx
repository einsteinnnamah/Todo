"use client";

interface MobileCheckProps {
  children: React.ReactNode;
  mobileOnly?: boolean;
}

const MobileCheck = ({ children, mobileOnly = true }: MobileCheckProps) => {
  return (
    <>
      {/* Mobile View */}
      <div className={`${mobileOnly ? "block md:hidden" : "block"}`}>
        {children}
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">
            📱 Mobile Version Only
          </h1>
          <p className="text-gray-300 mb-4">
            This application is optimized for mobile devices only.
          </p>
          <p className="text-gray-400 text-sm">
            Please open this application on your mobile phone or reduce your
            browser window size.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            <p>Scan QR code or visit on mobile:</p>
            {/* You can add a QR code here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileCheck;
