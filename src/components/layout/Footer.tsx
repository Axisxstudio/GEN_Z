import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { BRAND, STUDIO } from "@/lib/brand";

export const Footer = () => (
  <footer className="border-t border-border/60 mt-24 bg-gradient-to-b from-transparent to-black">
    <div className="container-edge py-16 grid gap-12 md:grid-cols-4">
      <div className="md:col-span-2 max-w-md">
        <Link to="/" className="inline-block mb-2">
          <img
            src="/logo.png"
            alt={BRAND.name}
            className="h-10 md:h-12 object-contain mix-blend-lighten [filter:brightness(1.2)]"
          />
        </Link>
        <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
          {BRAND.tagline}. Premium streetwear, perfumes & accessories curated for the new generation in {BRAND.city}.
        </p>
        <div className="mt-6 flex gap-3">
          <a href={BRAND.socials.instagram} target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-md border border-border transition-all duration-200 ease-out hover:border-primary hover:text-primary hover:scale-105 active:scale-100" aria-label="Instagram">
            <Instagram className="h-4 w-4" />
          </a>
          <a href={BRAND.socials.facebook} target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-md border border-border transition-all duration-200 ease-out hover:border-primary hover:text-primary hover:scale-105 active:scale-100" aria-label="Facebook">
            <Facebook className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Shop</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/categories/mens-wear" className="hover:text-primary transition-colors duration-200 ease-out">Mens Wear</Link></li>
          <li><Link to="/categories/kids-wear" className="hover:text-primary transition-colors duration-200 ease-out">Kids Wear</Link></li>
          <li><Link to="/categories/perfumes" className="hover:text-primary transition-colors duration-200 ease-out">Perfumes</Link></li>
          <li><Link to="/categories/belts" className="hover:text-primary transition-colors duration-200 ease-out">Belts</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Contact</h4>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" /> {BRAND.address}
          </li>
          <li className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-primary" />
            <a href={`tel:${BRAND.phoneTel}`} className="hover:text-primary transition-colors duration-200 ease-out">
              {BRAND.phone}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-primary" />
            <a href={`mailto:${BRAND.email}`} className="hover:text-primary transition-colors duration-200 ease-out break-all">
              {BRAND.email}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-border/60">
      <div className="container-edge py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
        <div className="text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
          <p>© {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.</p>
          <Link to="/admin" className="text-muted-foreground/30 hover:text-primary transition-colors duration-200 ease-out" aria-label="Admin Login">
            <ShieldCheck className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="text-center sm:text-right">
          Website developed by{" "}
          <a
            href={STUDIO.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground/90 underline-offset-4 transition-colors duration-200 ease-out hover:text-primary hover:underline"
          >
            {STUDIO.name}
          </a>
          <span className="text-muted-foreground/80"> · </span>
          <a
            href={STUDIO.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 ease-out hover:text-primary"
          >
            {STUDIO.domain}
          </a>
        </p>
      </div>
    </div>
  </footer>
);
