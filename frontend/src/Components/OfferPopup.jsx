import { useEffect, useState } from "react";
import { X } from "lucide-react";

const OfferPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const popupShown = localStorage.getItem("eliteOfferShown");

    if (!popupShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    localStorage.setItem("eliteOfferShown", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const whatsappLink =
    "https://wa.me/917017225698?text=Hello%20I%20am%20interested%20in%20the%20Elite%2012%20Month%20Membership%20Offer%20for%20₹3100";

  return (
    <>
      <style>
        {`
          @keyframes blinkOffer {
            0%,100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: .5;
              transform: scale(1.08);
            }
          }

          .blink-offer {
            animation: blinkOffer 1s infinite;
          }

          @keyframes popupShow {
            from {
              opacity: 0;
              transform: translateY(20px) scale(.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .popup-animation {
            animation: popupShow .3s ease-out;
          }
        `}
      </style>

      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="popup-animation relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

          {/* Close Button */}
          <button
            onClick={closePopup}
            className="absolute right-3 top-3 z-20 rounded-full bg-white p-2 shadow-lg transition hover:scale-110"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div
            className="px-5 py-6 text-center text-white"
            style={{
              background:
                "linear-gradient(135deg, oklch(57.7% 0.245 27.325), oklch(64.6% 0.222 41.116))",
            }}
          >
           

            <h2 className="mt-4 text-2xl font-extrabold">
              Elite Membership Discount
            </h2>

            <p className="mt-1 text-sm text-white/90">
              12 Months Premium Access
            </p>
          </div>

          {/* Content */}
          <div className="p-5 text-center">

            {/* Price */}
            <div>


              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-xl text-gray-400 line-through">
                  ₹3999
                </span>

                <span
                  className="text-5xl font-extrabold"
                  style={{
                    color: "oklch(57.7% 0.245 27.325)",
                  }}
                >
                  ₹3100
                </span>
              </div>

              <div
                className="blink-offer mx-auto mt-3 inline-flex rounded-full px-4 py-2 text-sm font-bold text-white"
                style={{
                  background: "oklch(64.6% 0.222 41.116)",
                }}
              >
                Save ₹899 Today
              </div>
            </div>

            {/* Features */}
            <div className="mt-5 rounded-2xl bg-gray-50 p-4">
              <ul className="space-y-2 text-start text-sm text-gray-700">
                <li>✅ Unlimited Profile Views</li>
                <li>✅ Direct WhatsApp Connection</li>
              </ul>
            </div>

            {/* Urgency */}
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
              <p className="text-sm font-bold text-red-600">
                ⏳ Offer Ending Soon
              </p>
            </div>

            {/* CTA */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block w-full rounded-2xl py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(135deg, oklch(57.7% 0.245 27.325), oklch(64.6% 0.222 41.116))",
              }}
            >
              Claim Offer on WhatsApp
            </a>


          </div>
        </div>
      </div>
    </>
  );
};

export default OfferPopup;