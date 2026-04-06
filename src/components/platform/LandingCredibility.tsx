import { Download, Sparkles, Star, Users, Palette } from "lucide-react";
import { motion } from "framer-motion";

interface LandingCredibilityProps {
  onStartDesigning: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export const LandingCredibility = ({ onStartDesigning }: LandingCredibilityProps) => {
  return (
    <div className="relative py-12 md:py-16">
      {/* Social Proof — Featured Quote */}
      <section className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
          className="text-center p-8 md:p-10 rounded-xl bg-muted/20 border border-border">
          <div className="flex justify-center gap-0.5 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
            ))}
          </div>
          <p className="text-base md:text-lg font-medium mb-4 max-w-xl mx-auto leading-relaxed text-foreground">
            "We planned our entire SaaS in EPIC before writing any code. The JSON export saved our team hours of architecture meetings."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-4 w-4 text-foreground" />
            </div>
            <div className="text-left">
              <p className="font-medium text-xs text-foreground">Builders & Founders</p>
              <p className="text-[10px] text-muted-foreground">Using EPIC daily</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
