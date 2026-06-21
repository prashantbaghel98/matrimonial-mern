
import React from "react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const WHATSAPP_NUMBER = "917017225698";

const PlanCard = ({ plan }) => {
  const { t } = useTranslation();

  const handleChoosePlan = () => {
    const message = `Hello Apna Vivah Team,

I am interested in the ${plan.name} Plan.

Plan Details:
• Price: ${plan.price}
• Duration: ${plan.duration}

Please guide me with the next steps.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl p-8 border transition duration-300 h-full
      ${
        plan.badge
          ? "bg-white shadow-2xl scale-105 border-orange-500"
          : "bg-white border-[#e8dfd6] hover:shadow-xl hover:-translate-y-3"
      }`}
    >
      {plan.badge && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2
          bg-gradient-to-r from-red-600 to-orange-500
          text-white text-xs px-4 py-1 rounded-full shadow"
        >
          {plan.badge}
        </div>
      )}

      <div>
        <h3 className="text-2xl font-semibold text-[#4b1e23] mb-2">
          {plan.name}
        </h3>

        <p className="text-gray-500 mb-6">{plan.duration}</p>

        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl blur-md opacity-60"></div>

          <div className="relative bg-white rounded-xl py-6 shadow-sm">
            <div className="flex items-end justify-center gap-2">
              <span className="text-5xl font-bold text-[#2d2a26]">
                {plan.price}
              </span>
            </div>
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-gray-600"
            >
              <Check
                size={18}
                className="text-green-500 mt-1 flex-shrink-0"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleChoosePlan}
        className={`w-full py-3 rounded-xl font-semibold transition duration-300
        ${
          plan.badge
            ? "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:shadow-lg hover:scale-105"
            : "border border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white"
        }`}
      >
        {t("membership.choosePlan")}
      </button>
    </div>
  );
};

const MembershipPlans = () => {
  const { t } = useTranslation();

  const plans = t("membership.plans", {
    returnObjects: true,
  });

  return (
    <section className="w-full bg-[#f5f1eb] py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <p className="text-orange-600 font-semibold tracking-widest uppercase text-sm mb-3">
          {t("membership.pageTitle")}
        </p>

        <h2 className="text-4xl sm:text-5xl font-bold text-[#2d2a26] mb-6">
          {t("membership.hero.title")}
        </h2>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16">
          {t("membership.hero.description")}
        </p>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <PlanCard
              key={index}
              plan={plan}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default MembershipPlans;