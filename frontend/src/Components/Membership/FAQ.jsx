import React, { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "How do I register?",
    answer:
      "Simply click on any plan and message us on WhatsApp. We'll guide you through the registration process.",
  },
  {
    question: "Are all profiles verified?",
    answer:
      "Yes, every profile on Apna Vivah is manually verified by our team to ensure genuine connections.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Absolutely! You can upgrade anytime. Just contact us on WhatsApp and we'll adjust your membership.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, bank transfer, and all major payment methods. Contact us for details.",
  },
];

const FAQItem = ({ item, isOpen, onClick }) => {
  return (
    <div
      className={`rounded-2xl border transition duration-300 
      ${isOpen ? "bg-white shadow-lg border-orange-300" : "bg-white/70 border-[#e8dfd6]"}`}
    >
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center p-6 text-left"
      >
        <h3 className="text-lg font-semibold text-[#2d2a26]">
          {item.question}
        </h3>

        <Plus
          className={`transition duration-300 ${
            isOpen ? "rotate-45 text-orange-600" : "text-gray-600"
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 px-6 ${
          isOpen ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-600 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#f5f1eb] py-24">

      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#2d2a26]">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              isOpen={activeIndex === index}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
