import {
  css,
  figma,
  git,
  html,
  javascript,
  mongodb,
  nodejs,
  reactjs,
  tailwind,
} from "../assets";

/**
 * Single source of truth for business identity.
 * Used by the contact section, footer, SEO tags and the contact form.
 */
export const business = {
  brand: "BrtzDesigns",
  email: "brtz.designs@gmail.com",
  phoneDisplay: "+61 406 771 491",
  phoneTel: "+61406771491",
  whatsapp: "61406771491",
  location: "Perth, Australia",
  github: "https://github.com/Brumertz",
  linkedin: "https://www.linkedin.com/in/brandon-morales-cordoba-592958280/",
};

/** Pre-filled WhatsApp deep link. `text` is URL-encoded by the caller. */
export const whatsappLink = (text = "") =>
  `https://wa.me/${business.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** Deep links for the three contact rows, shared by Contact and Footer. */
export const contactLinks = {
  email: `mailto:${business.email}`,
  phone: `tel:${business.phoneTel}`,
  location: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    business.location
  )}`,
};

/**
 * Section anchors — titles are translated and live in the i18n locale files.
 * Order also drives the navbar menu order.
 */
export const navLinks = [
  { id: "about" },
  { id: "work" },
  { id: "tech" },
  { id: "services" },
  { id: "projects" },
  { id: "contact" },
];

/** Languages the site is published in. `en` is the default/fallback. */
export const languages = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

const technologies = [
  { name: "HTML 5", icon: html },
  { name: "CSS 3", icon: css },
  { name: "JavaScript", icon: javascript },
  { name: "React JS", icon: reactjs },
  { name: "Tailwind CSS", icon: tailwind },
  { name: "Node JS", icon: nodejs },
  { name: "MongoDB", icon: mongodb },
  { name: "Git", icon: git },
  { name: "Figma", icon: figma },
];

export { technologies };
