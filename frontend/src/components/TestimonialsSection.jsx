import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Sarah K.",
    title: "Houseplant Enthusiast",
    quote:
      "PlantCareAI completely changed my watering schedule! My fiddle leaf fig has never looked happier. The reminders are perfectly timed.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rajesh P.",
    title: "Urban Gardener",
    quote:
      "The AI chat feature is incredible. It helped me diagnose a pest problem on my basil plant instantly. It's like having a botanist in my pocket.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily B.",
    title: "Beginner Plant Owner",
    quote:
      "I used to panic about plant care. Now, thanks to the tracking and easy-to-use interface, I feel confident. Highly recommend this app!",
    rating: 4,
  },
  {
    id: 4,
    name: "Carlos M.",
    title: "Succulent Collector",
    quote:
      "I have over 30 succulents, and keeping track used to be a nightmare. PlantCareAI makes it easy to monitor them all in one place!",
    rating: 5,
  },
  {
    id: 5,
    name: "Lina W.",
    title: "Busy Professional",
    quote:
      "As someone with a hectic schedule, I love the smart notifications. My plants stay alive and I don’t have to stress. Game-changer.",
    rating: 4,
  },
];

const TestimonialCard = ({ testimonial, index }) => {
  // Calculate delay for staggered animation effect
  const delay = index * 0.1; // Reduced delay for faster initial appearance

  return (
    <motion.div
      // Reduced padding (p-6) and font size (text-lg) for smaller card size
      // Added flex-shrink-0 and specific width for horizontal scrolling
      // Added scroll-snap-align-start for clean snapping behavior
      className="group bg-white p-6 rounded-3xl shadow-xl border border-green-50 flex flex-col h-full cursor-pointer transform transition-all duration-300 relative overflow-hidden flex-shrink-0 w-[90vw] sm:w-[350px] scroll-snap-align-start"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: delay, ease: "backOut" }}
      whileHover={{
        y: -5, // Slightly less aggressive lift for a smaller card
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.35)", // Richer shadow with green tint
        transition: { duration: 0.3 },
      }}
    >
      {/* Star Rating */}
      <div className="flex mb-3 relative z-10">
        {Array(testimonial.rating)
          .fill(0)
          .map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
          ))}
      </div>

      {/* Quote (reduced to text-lg) */}
      <p className="text-gray-800 text-lg font-medium flex-grow italic leading-relaxed mb-4 relative z-10">
        "{testimonial.quote}"
      </p>

      {/* Separator - Wider and bolder */}
      <div className="w-12 h-1 bg-emerald-500 my-3 rounded-full relative z-10"></div>

      {/* Author Info (reduced to text-lg) */}
      <div className="mt-auto relative z-10">
        <p className="text-lg font-extrabold text-gray-900">
          {testimonial.name}
        </p>
        <p className="text-sm text-emerald-700 font-semibold">
          {testimonial.title}
        </p>
      </div>
    </motion.div>
  );
};

// --- Main Component ---
const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header - kept centered, added padding back here */}
        <div className="text-center mb-16 px-6 lg:px-8">
          <motion.h2
            className="text-base font-semibold text-emerald-600 uppercase tracking-wider mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Loved By Thousands of Plant Parents
          </motion.h2>
          <motion.p
            className="text-5xl font-extrabold text-gray-900 tracking-tight"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            What Our Users Say
          </motion.p>
        </div>

        {/* Horizontal Scrolling Row: Uses flex and overflow-x-scroll for the row-wise behavior. */}
        <div className="flex space-x-6 overflow-x-scroll snap-x snap-mandatory pb-8 hide-scrollbar px-6 lg:px-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Custom styles to hide the horizontal scrollbar for a cleaner slider look */}
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scroll-snap-align-start {
          scroll-snap-align: start;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
