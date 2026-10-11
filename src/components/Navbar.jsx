import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { navLinks, languages, business } from "../constants";
import { useLocale } from "../i18n";
import { logo, menu, close } from "../assets";

// Declared at module scope: defining it inside `Navbar` created a new component
// type on every render, so React unmounted/remounted it each time (losing
// keyboard focus). It reads the locale itself via the context.
const LanguageToggle = ({ className = "" }) => {
  const { lang, setLang, content } = useLocale();
  return (
    <div
      className={`flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5 ${className}`}
      role="group"
      aria-label={content.nav.language}
    >
      {languages.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          // px-3/py-1.5 keeps the target >= 24x24 (WCAG 2.5.8), and the
          // darker #7c3aed gives white text 5.7:1 (WCAG 1.4.3 needs 4.5:1).
          className={`px-3 py-1.5 min-h-[28px] text-[12px] font-semibold tracking-wider rounded-md transition-colors cursor-pointer ${
            lang === code
              ? "bg-[#7c3aed] text-white shadow-[0_0_10px_rgba(145,94,255,0.5)]"
              : "text-[#aaa6c3] hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

const Navbar = () => {
  const { content } = useLocale();
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navTitle = (id) => content.nav[id];

  return (
    <nav
      className={`w-full items-center fixed top-0 z-20 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-[#050816]/90 backdrop-blur-md border-b border-white/5 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="w-full padding-x flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img
            src={logo}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <p className="text-white text-[18px] font-bold cursor-pointer flex">
            {business.brand}
          </p>
        </Link>

        <ul className="list-none hidden sm:flex flex-row gap-5 md:gap-6 lg:gap-8 items-center">
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.id ? "text-white" : "text-[#aaa6c3]"
              } hover:text-white text-[14px] lg:text-[15px] font-medium cursor-pointer transition-colors`}
              onClick={() => setActive(nav.id)}
            >
              <a href={`#${nav.id}`}>{navTitle(nav.id)}</a>
            </li>
          ))}
          <li>
            <LanguageToggle />
          </li>
          <li>
            <a
              href={`mailto:${business.email}?subject=${encodeURIComponent(
                content.nav.hireMe
              )}`}
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#6824e8] text-white text-[14px] font-semibold shadow-[0_8px_20px_rgba(145,94,255,0.35)] hover:shadow-[0_10px_28px_rgba(145,94,255,0.55)] hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              {content.nav.hireMe}
            </a>
          </li>
        </ul>

        <div className="sm:hidden flex flex-1 justify-end items-center gap-3">
          <LanguageToggle />
          <img
            src={toggle ? close : menu}
            alt="menu"
            width={28}
            height={28}
            className="w-[28px] h-[28px] object-contain cursor-pointer"
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[180px] z-10 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] ${
                    active === nav.id ? "text-white" : "text-[#aaa6c3]"
                  }`}
                  onClick={() => {
                    setToggle(false);
                    setActive(nav.id);
                  }}
                >
                  <a href={`#${nav.id}`}>{navTitle(nav.id)}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
