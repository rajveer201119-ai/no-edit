import { Star, Users } from "lucide-react";
import { motion } from "framer-motion";

interface LandingCredibilityProps {
  onStartDesigning: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const quotes = [
  {
    text: "Mapped our entire SaaS in an afternoon. JSON export dropped straight into our repo — zero rework.",
    name: "Aarav S.",
    role: "Founder · B2B SaaS",
  },
  {
    text: "We finally stopped arguing about site structure in Figma. EPIC gives us one source of truth before any UI work.",
    name: "Priya M.",
    role: "UX Lead · Agency",
  },
  {
    text: "The user-flow builder is exactly what I wanted from Whimsical without the price tag.",
    name: "Rohan K.",
    role: "Product Manager",
  },
];

export const LandingCredibility = ({ onStartDesigning }: LandingCredibilityProps) => {
  return (
    <div className="relative py-12 md:py-16">
      <section className="container mx-auto px-4 max-w-5xl">
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
          className="text-center text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-2"
        >
          Trusted by product teams
        </motion.h2>
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
          className="text-center text-sm text-muted-foreground mb-8"
        >
          Founders, designers, and PMs who plan structure before pixels.
        </motion.p>
        <div className="grid md:grid-cols-3 gap-4">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.name}
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 2} variants={fadeUp}
              className="p-6 rounded-xl bg-muted/20 border border-border"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-foreground text-foreground" />
                ))}
              </div>
              <blockquote className="text-sm text-foreground leading-relaxed mb-4">
                "{q.text}"
              </blockquote>
              <figcaption className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-3.5 w-3.5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{q.name}</p>
                  <p className="text-[10px] text-muted-foreground">{q.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>
    </div>
  );
};
