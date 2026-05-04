import { RevealOnView } from "@/components/motion/RevealOnView";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND, whatsappLink } from "@/lib/brand";

const contactCards: {
  icon: typeof MapPin;
  title: string;
  text: string;
  href?: string;
}[] = [
  { icon: MapPin, title: "Visit", text: BRAND.address },
  { icon: Phone, title: "Call", text: BRAND.phone, href: `tel:${BRAND.phoneTel}` },
  { icon: Mail, title: "Email", text: BRAND.email, href: `mailto:${BRAND.email}` },
  { icon: MessageCircle, title: "WhatsApp", text: "Tap below to message us" },
];

const Contact = () => (
  <RevealOnView className="container-edge py-16 max-w-4xl">
    <p className="text-xs uppercase tracking-[0.3em] text-primary">Contact</p>
    <h1 className="font-display text-4xl md:text-6xl font-bold mt-2">Talk to us.</h1>
    <p className="text-muted-foreground mt-3 max-w-xl">
      Call <span className="text-foreground/90">{BRAND.phone}</span>, email{" "}
      <a href={`mailto:${BRAND.email}`} className="text-foreground/90 underline-offset-4 hover:text-primary hover:underline">
        {BRAND.email}
      </a>
      , or WhatsApp — we aim to reply quickly during store hours.
    </p>

    <div className="mt-10 grid md:grid-cols-2 gap-4">
      {contactCards.map((c) => (
        <div key={c.title} className="glass rounded-xl p-6">
          <c.icon className="h-5 w-5 text-primary" />
          <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{c.title}</p>
          {c.href ? (
            <a href={c.href} className="mt-1 block font-medium hover:text-primary transition-colors break-all">
              {c.text}
            </a>
          ) : (
            <p className="mt-1 font-medium">{c.text}</p>
          )}
        </div>
      ))}
    </div>

    <div className="mt-8">
      <Button asChild variant="whatsapp" size="xl">
        <a href={whatsappLink("Hi GEN-Z! I have a question.")} target="_blank" rel="noreferrer">
          <MessageCircle className="h-5 w-5" /> Message us on WhatsApp
        </a>
      </Button>
    </div>
  </RevealOnView>
);

export default Contact;
