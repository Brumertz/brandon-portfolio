import { Link } from "react-router-dom";

import { logo } from "../assets";
import { business, contactLinks } from "../constants";
import { useLocale } from "../i18n";
import { GithubIcon, LinkedinIcon, MailIcon, PhoneIcon } from "./icons";

const socialIcons = {
  github: <GithubIcon />,
  linkedin: <LinkedinIcon />,
  email: <MailIcon />,
  phone: <PhoneIcon />,
};

const socialLinks = [
  { name: "GitHub", url: business.github, icon: "github" },
  { name: "LinkedIn", url: business.linkedin, icon: "linkedin" },
  { name: business.email, url: contactLinks.email, icon: "email" },
  { name: business.phoneDisplay, url: contactLinks.phone, icon: "phone" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { content } = useLocale();
  const { footer } = content;

  const contactRows = [
    {
      key: "email",
      label: footer.email,
      value: business.email,
      href: contactLinks.email,
    },
    {
      key: "phone",
      label: footer.phone,
      value: business.phoneDisplay,
      href: contactLinks.phone,
    },
    {
      key: "location",
      label: footer.location,
      value: business.location,
      href: contactLinks.location,
    },
  ];

  return (
    <footer className="relative w-full bg-transparent border-t border-white/10 z-10 flex flex-col items-center justify-center mt-14 sm:mt-18">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#915eff] to-transparent shadow-[0_0_15px_#915eff]" />

      <div className="w-full max-w-6xl mx-auto padding-x py-10 sm:py-12 flex flex-col items-center justify-center gap-7 text-center">
        <Link
          to="/"
          className="flex items-center justify-center gap-3"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src={logo}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <p className="text-white text-[17px] font-bold tracking-wider">
            {business.brand}
          </p>
        </Link>

        {/* Direct contact */}
        <ul className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
          {contactRows.map((row) => (
            <li key={row.key}>
              <a
                href={row.href}
                target={row.key === "location" ? "_blank" : undefined}
                rel={
                  row.key === "location" ? "noopener noreferrer" : undefined
                }
                className="text-[14px] text-[#aaa6c3] hover:text-white transition-colors"
              >
                <span className="text-[#915eff] font-semibold">
                  {row.label}:
                </span>{" "}
                {row.value}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target={social.url.startsWith("mailto:") || social.url.startsWith("tel:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={social.name}
              title={social.name}
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#aaa6c3] hover:text-white hover:bg-[#915eff]/20 hover:border-[#915eff]/50 hover:scale-110 hover:shadow-[0_0_15px_rgba(145,94,255,0.4)] transition-all duration-300"
            >
              {socialIcons[social.icon] || social.name[0]}
            </a>
          ))}
        </div>

        <p className="text-center text-sm text-[#aaa6c3] font-medium mt-1">
          © {currentYear}{" "}
          <span className="text-white font-semibold">{business.brand}</span>.{" "}
          {footer.rights}
        </p>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center justify-center gap-1.5 text-xs text-[#aaa6c3] hover:text-[#915eff] transition-colors cursor-pointer group mt-1"
        >
          <span>{footer.backToTop}</span>
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
