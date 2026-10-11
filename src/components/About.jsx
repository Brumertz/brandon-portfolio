import { useEffect, useState } from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { SectionWrapper } from "../hoc";
import { useLocale } from "../i18n";
import useInView from "../hooks/useInView";
import { fadeIn, textVariant } from "../utils/motion";
import { IS_TOUCH } from "../utils/isTouch";

/**
 * Cards reveal on their own IntersectionObserver, not the section-level
 * `whileInView` stagger — that fired ~300-600ms before the cards were on
 * screen, so visitors found them already settled. The keyframe reproduces the
 * original `fadeIn`; touch devices get a tighter 0.12s stagger because their
 * cards arrive one at a time down a single column.
 */
const CARD_GRADIENT = "w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card";

const ServiceCard = ({ index, title, icon }) => {
  const [ref, inView] = useInView({ rootMargin: "0px 0px -10% 0px" });
  const [revealed, setRevealed] = useState(false);

  // `once: true` semantics: a card that has played keeps its final state even
  // if the visitor scrolls it back out.
  useEffect(() => {
    if (inView) setRevealed(true);
  }, [inView]);

  const inner = (
    <div
      className="rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col"
      style={{ backgroundColor: "var(--color-tertiary)" }}
    >
      <img
        src={icon}
        alt=""
        width={64}
        height={64}
        loading="lazy"
        decoding="async"
        className="w-16 h-16 object-contain"
      />
      <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
    </div>
  );

  return (
    <Tilt
      options={{ max: 45, scale: 1, speed: 450 }}
      className="xs:w-[250px] w-full"
    >
      <div
        ref={ref}
        className={`card-reveal ${CARD_GRADIENT}${revealed ? " is-in" : ""}`}
        style={{
          animationDelay: `${(index * (IS_TOUCH ? 0.12 : 0.2)).toFixed(2)}s`,
        }}
      >
        {inner}
      </div>
    </Tilt>
  );
};

const About = () => {
  const { content } = useLocale();
  const { about } = content;

  return (
    <>
      <motion.div variants={textVariant()} className="text-center w-full">
        <p className="section-sub">{about.sectionSub}</p>
        <h2 className="section-head">{about.sectionHead}</h2>
      </motion.div>

      <div className="w-full flex justify-center">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-4 text-[17px] max-w-3xl leading-[30px] text-center"
          style={{ color: "var(--color-secondary)" }}
        >
          {about.paragraph}
        </motion.p>
      </div>

      {/* Credentials strip */}
      <motion.ul
        variants={fadeIn("", "", 0.2, 0.75)}
        className="mt-7 flex flex-wrap justify-center items-center gap-3"
      >
        {about.credentials.map((credential) => (
          <li
            key={credential}
            className="px-4 py-1.5 rounded-full border border-[#915eff]/40 bg-[#915eff]/10 text-[#c9b8ff] text-[13px] font-medium tracking-wide"
          >
            {credential}
          </li>
        ))}
      </motion.ul>

      <div className="mt-16 sm:mt-20 flex flex-wrap justify-center items-center gap-8 sm:gap-10 w-full max-w-5xl mx-auto">
        {about.services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
