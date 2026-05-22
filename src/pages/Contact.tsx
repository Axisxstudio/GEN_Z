import { useState, FormEvent } from "react";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { Mail, MapPin, MessageCircle, Phone, Clock, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BRAND, whatsappLink } from "@/lib/brand";
import { toast } from "sonner";

const contactCards = [
  { 
    icon: MapPin, 
    title: "Visit Studio", 
    text: BRAND.address, 
    desc: "Trincomalee Main St.", 
    href: undefined 
  },
  { 
    icon: Phone, 
    title: "Call Direct", 
    text: BRAND.phone, 
    href: `tel:${BRAND.phoneTel}`, 
    desc: "Mon-Sun, 9AM - 10PM" 
  },
  { 
    icon: Mail, 
    title: "Email Us", 
    text: BRAND.email, 
    href: `mailto:${BRAND.email}`, 
    desc: "Direct reply in 24h" 
  },
  { 
    icon: MessageCircle, 
    title: "WhatsApp Live", 
    text: "Open Chat Session", 
    href: whatsappLink("Hi GEN-Z! I have a question about fits or pricing."), 
    desc: "Fastest concierge response" 
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    
    // Simulate premium backend submit delay
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Message sent! Our concierge team will reach out shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset success state after a few seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="pb-20 pt-8 space-y-16">
      {/* Header Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="container-edge">
          <RevealOnView className="max-w-3xl space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">Get In Touch</p>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight">
              Talk to us.
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed">
              Have questions about sizing, premium fits, custom orders, or delivery? Reach out to our concierge team directly. We are here to keep your vibe high.
            </p>
          </RevealOnView>
        </div>
      </section>

      {/* Main Grid: Form & Info Columns */}
      <section className="container-edge">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          
          {/* Column 1: Custom Interactive Contact Form */}
          <RevealOnView className="glass-strong border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="font-display text-2xl font-bold">Send a Message</h2>
              <p className="text-xs text-muted-foreground">We usually reply via email or phone within a couple of hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-zinc-400">
                  Your Name <span className="text-primary">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  disabled={submitting}
                  className="bg-secondary/20 border-border/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl h-11 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-zinc-400">
                  Email Address <span className="text-primary">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={submitting}
                  className="bg-secondary/20 border-border/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl h-11 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-zinc-400">
                  Subject <span className="text-muted-foreground text-[10px]">(Optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Sizing Advice / Delivery Info"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  disabled={submitting}
                  className="bg-secondary/20 border-border/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl h-11 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-zinc-400">
                  Your Message <span className="text-primary">*</span>
                </label>
                <Textarea
                  placeholder="Tell us what you're looking for or any questions..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  required
                  disabled={submitting}
                  className="bg-secondary/20 border-border/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-2xl min-h-[120px] transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full h-12 mt-2 font-semibold tracking-wider uppercase text-xs gap-2 transition-all duration-300 hover:scale-[1.01]"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Sending Message...
                  </>
                ) : submitted ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    Sent Successfully
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Submit Inquiry
                  </>
                )}
              </Button>
            </form>
          </RevealOnView>

          {/* Column 2: Info Cards & Stylized Map HUD */}
          <div className="space-y-8">
            
            {/* Quick Contact Info Cards Grid */}
            <RevealOnView className="grid grid-cols-2 gap-4">
              {contactCards.map((c) => {
                const CardContent = (
                  <div className="bg-gradient-card border border-border/50 hover:border-primary/30 transition-all duration-300 rounded-2xl p-5 space-y-3 h-full">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <c.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{c.title}</p>
                      <h3 className="font-semibold text-sm leading-tight text-foreground break-all">{c.text}</h3>
                      <p className="text-[10px] text-muted-foreground">{c.desc}</p>
                    </div>
                  </div>
                );

                if (c.href) {
                  return (
                    <a key={c.title} href={c.href} target={c.title.includes("WhatsApp") ? "_blank" : undefined} rel="noreferrer" className="block select-none">
                      {CardContent}
                    </a>
                  );
                }

                return <div key={c.title}>{CardContent}</div>;
              })}
            </RevealOnView>

            {/* Store Hours & Drop Method Card */}
            <RevealOnView className="bg-gradient-card border border-border/50 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">Concierge Availability</h3>
                  <p className="text-xs text-muted-foreground">Always active when drops are live.</p>
                </div>
              </div>
              
              <div className="h-px bg-border/40" />

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium">Monday - Friday</span>
                  <span className="font-mono text-xs uppercase text-zinc-400">9:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="font-medium">Saturday - Sunday</span>
                  <span className="font-mono text-xs uppercase text-zinc-400">10:00 AM - 9:00 PM</span>
                </div>
              </div>

              <div className="bg-secondary/35 border border-border/40 p-3.5 rounded-xl text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">Note:</strong> Tapping on any product on the shop page launches a direct WhatsApp window. For the fastest response regarding sizing or immediate payments, always prefer the WhatsApp Live chat channel.
              </div>
            </RevealOnView>

            {/* Stylized brutalist Map HUD */}
            <RevealOnView className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-border/40 bg-black group shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1478860126073-1c35b755d9d7?w=800"
                alt="Trincomalee Map Grid"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.25] group-hover:scale-105 transition-all duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.18)_0%,transparent_100%)] pointer-events-none" />
              
              {/* Pulsating brutalist radar target ping */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="absolute inline-flex h-14 w-14 rounded-full bg-primary/20 animate-ping opacity-75" />
                <span className="absolute inline-flex h-8 w-8 rounded-full bg-primary/40 animate-ping opacity-80" />
                <div className="relative h-4.5 w-4.5 rounded-full bg-primary border-2 border-white flex items-center justify-center shadow-lg shadow-primary/60">
                  <MapPin className="h-2.5 w-2.5 text-primary-foreground" />
                </div>
              </div>

              {/* Coordinates hud sticker */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between backdrop-blur-md bg-black/55 border border-border/60 p-2.5 rounded-xl text-[10px] tracking-widest uppercase font-mono text-zinc-400 select-none">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> TRINCO STUDIO
                </span>
                <span>8.5713° N, 81.2335° E</span>
              </div>
            </RevealOnView>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
