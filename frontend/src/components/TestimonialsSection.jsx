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

const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{
        y: -5,
        boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.25)",
        transition: { duration: 0.3 },
      }}
    >
      {/* Star Rating */}
      <div className="flex mb-3">
        {Array(testimonial.rating)
          .fill(0)
          .map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
          ))}
      </div>

      {/* Quote */}
      <p className="text-gray-700 italic flex-grow text-lg">
        "{testimonial.quote}"
      </p>

      {/* Separator */}
      <div className="w-10 h-1 bg-emerald-400 my-4 rounded-full"></div>

      {/* Author Info */}
      <div className="mt-auto">
        <p className="text-lg font-bold text-gray-800">{testimonial.name}</p>
        <p className="text-sm text-emerald-600 font-medium">
          {testimonial.title}
        </p>
      </div>
    </motion.div>
  );
};

// --- Main Component ---
const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-emerald-600 uppercase tracking-wider mb-2">
            Loved By Plant Parents
          </h2>
          <p className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            What Our Users Say
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
