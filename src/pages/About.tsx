import { BRAND } from "@/lib/brand";
import { RevealOnView } from "@/components/motion/RevealOnView";

const About = () => (
  <RevealOnView className="container-edge py-16 max-w-3xl">
    <p className="text-xs uppercase tracking-[0.3em] text-primary">About</p>
    <h1 className="font-display text-4xl md:text-6xl font-bold mt-2">Built for the new generation.</h1>
    <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
      <p>
        {BRAND.fullName} is a premium streetwear destination based in {BRAND.city}.
        We curate the kind of fits, fragrances and accessories that make young men feel unstoppable —
        without forcing you to scroll through endless online checkouts.
      </p>
      <p>
        See something you love? Tap WhatsApp. We'll confirm size, color, delivery and price in seconds.
        It's how shopping should feel: personal, fast, premium.
      </p>
      <p className="text-foreground italic">
        "{BRAND.tagline}." — that's the whole brief.
      </p>
    </div>
  </RevealOnView>
);

export default About;
