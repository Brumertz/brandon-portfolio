import { motion } from "framer-motion";

import { SectionWrapper } from "../hoc";
import { business, whatsappLink } from "../constants";
import { useLocale } from "../i18n";
import { fadeIn, textVariant } from "../utils/motion";
import { WhatsAppIcon, MailIcon } from "./icons";

const ServiceCard = ({ item, index }) => (
  <motion.article
    variants={fadeIn("up", "spring", index * 0.15, 0.75)}
    className="relative w-full sm:w-[calc(50%-24px)] lg:w-[calc(25%-30px)] min-w-[260px] p-7 sm:p-8 rounded-2xl border border-white/10 bg-[#151030]/80 hover:border-[#915eff]/60 hover:-translate-y-2 transition-all duration-300 shadow-card flex flex-col justify-between"
  >
    <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#915eff] to-transparent opacity-60" />

    <div>
      <span className="inline-flex self-start px-3.5 py-1.5 rounded-full text-[12px] font-semibold tracking-wide bg-[#915eff]/15 text-[#c9b8ff] border border-[#915eff]/30">
        {item.highlight}
      </span>

      <h3 className="mt-5 text-white font-bold text-[22px] leading-snug">
        {item.title}
      </h3>
    </div>

    <p
      className="mt-6 text-[15px] leading-[26px] flex-1"
      style={{ color: "var(--color-secondary)" }}
    >
      {item.description}
    </p>
  </motion.article>
);

const Services = () => {
  const { content } = useLocale();
  const { services } = content;

  return (
    <div className="w-full py-8 sm:py-12">
      <motion.div variants={textVariant()} className="text-center w-full">
        <p className="section-sub">{services.sectionSub}</p>
        <h2 className="section-head">{services.sectionHead}</h2>
      </motion.div>

      <div className="w-full flex justify-center mt-6 mb-14 sm:mb-18">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="text-[17px] sm:text-[18px] max-w-3xl leading-[32px] text-center"
          style={{ color: "var(--color-secondary)" }}
        >
          {services.intro}
        </motion.p>
      </div>

      <div className="w-full flex flex-wrap justify-center items-stretch gap-8 sm:gap-10">
        {services.items.map((item, index) => (
          <ServiceCard key={item.title} item={item} index={index} />
        ))}
      </div>

      {/* CTA band */}
      <motion.div
        variants={fadeIn("up", "spring", 0.3, 0.75)}
        className="mt-20 sm:mt-24 w-full max-w-4xl mx-auto rounded-3xl border border-white/10 overflow-hidden relative"
        style={{
          background:
            "linear-gradient(145deg, rgba(21,16,48,0.98) 0%, rgba(13,10,32,0.95) 100%)",
        }}
      >
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-48 bg-[#915eff]/25 blur-3xl pointer-events-none" />

        <div className="relative z-10 p-7 sm:p-10 flex flex-col items-center text-center gap-5">
          <h3 className="text-white font-bold text-xl sm:text-2xl tracking-tight">
            {services.cta.title}
          </h3>
          <p
            className="text-[15px] max-w-lg leading-relaxed"
            style={{ color: "var(--color-secondary)" }}
          >
            {services.cta.text}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-1">
            <a
              href={whatsappLink(services.cta.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0a7d5b] to-[#07634a] text-white font-bold text-sm shadow-[0_10px_25px_rgba(37,211,102,0.25)] hover:shadow-[0_14px_35px_rgba(37,211,102,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <WhatsAppIcon />
              {services.cta.whatsapp}
            </a>

            <a
              href={`mailto:${business.email}?subject=${encodeURIComponent(
                services.cta.title
              )}`}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-[#915eff]/50 bg-[#915eff]/10 text-white font-bold text-sm hover:bg-[#915eff]/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <MailIcon />
              {services.cta.email}
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Services, "services");
