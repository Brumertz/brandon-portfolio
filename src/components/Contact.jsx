import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { business, whatsappLink, contactLinks } from "../constants";
import { useLocale } from "../i18n";
import useInView from "../hooks/useInView";
import { fadeIn, textVariant } from "../utils/motion";
import { WhatsAppIcon, MailIcon, PhoneIcon, LocationIcon } from "./icons";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const infoIcons = {
  email: <MailIcon />,
  phone: <PhoneIcon />,
  location: <LocationIcon />,
};

const inputClass =
  "w-full bg-[#0a071e]/90 border border-white/15 hover:border-white/30 focus:border-[#915eff] focus:bg-[#140e33] focus:ring-2 focus:ring-[#915eff]/25 py-3 px-4 text-white placeholder-gray-500 text-sm rounded-xl outline-none transition-all duration-300";

const Contact = () => {
  const { content } = useLocale();
  const { contact } = content;

  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Defer the 3D Earth until the section is actually on screen — this keeps
  // a second WebGL context (and ~1.8 MB of textures) out of the initial load.
  // `lingerMs` keeps it alive briefly on the way out so the canvas is never
  // torn down mid-init (see useInView for why that matters), and releasing it
  // is what keeps the total live WebGL context count under the browser's cap
  // of 16 when the user scrolls back up to the tech grid.
  const [earthRef, showEarth] = useInView({ rootMargin: "400px", lingerMs: 800 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (feedback.message) setFeedback({ type: "", message: "" });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setFeedback({ type: "error", message: contact.validation.name });
      return false;
    }
    if (!form.email.trim()) {
      setFeedback({ type: "error", message: contact.validation.email });
      return false;
    }
    if (!EMAIL_REGEX.test(form.email)) {
      setFeedback({ type: "error", message: contact.validation.emailInvalid });
      return false;
    }
    if (!form.message.trim()) {
      setFeedback({ type: "error", message: contact.validation.message });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setFeedback({ type: "", message: "" });

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: business.brand,
          from_email: form.email,
          to_email: business.email,
          reply_to: form.email,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          setFeedback({ type: "success", message: contact.success });
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.error("EmailJS Error:", error);
          setFeedback({ type: "error", message: contact.errorFallback });
        }
      );
  };


  return (
    <div className="w-full flex flex-col items-center">
      <motion.div variants={textVariant()} className="text-center mb-10 w-full">
        <p className="section-sub text-center">{contact.sectionSub}</p>
        <h2 className="section-head text-center">{contact.sectionHead}</h2>
      </motion.div>

      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-stretch gap-8">
        {/* Direct contact info */}
        <motion.div
          variants={fadeIn("right", "spring", 0.15, 0.75)}
          className="w-full lg:w-[340px] flex flex-col gap-4"
        >
          <div
            className="rounded-3xl border border-white/10 p-6 sm:p-7 flex-1"
            style={{
              background:
                "linear-gradient(145deg, rgba(21,16,48,0.98) 0%, rgba(13,10,32,0.95) 100%)",
            }}
          >
            <h3 className="text-white font-bold text-xl tracking-tight">
              {contact.infoTitle}
            </h3>

            <ul className="mt-5 flex flex-col gap-4">
              {contact.info.map((item) => (
                <li key={item.key}>
                  <a
                    href={contactLinks[item.key]}
                    target={item.key === "location" ? "_blank" : undefined}
                    rel={
                      item.key === "location" ? "noopener noreferrer" : undefined
                    }
                    className="group flex items-start gap-3.5 rounded-xl p-2 -m-2 hover:bg-[#915eff]/10 transition-colors"
                  >
                    <span className="shrink-0 w-10 h-10 rounded-lg bg-[#915eff]/15 border border-[#915eff]/30 flex items-center justify-center text-[#915eff] group-hover:bg-[#915eff]/30 transition-colors">
                      {infoIcons[item.key]}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[12px] uppercase tracking-wider text-[#aaa6c3]">
                        {item.label}
                      </span>
                      <span className="block text-white text-[15px] font-semibold break-words group-hover:text-[#c9b8ff] transition-colors">
                        {item.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={whatsappLink(contact.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0a7d5b] to-[#07634a] text-white font-bold text-sm shadow-[0_10px_25px_rgba(37,211,102,0.25)] hover:shadow-[0_14px_35px_rgba(37,211,102,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <WhatsAppIcon />
            {contact.whatsapp}
          </a>
        </motion.div>

        {/* Form card */}
        <motion.div
          variants={fadeIn("left", "spring", 0.2, 0.75)}
          className="w-full flex-1 rounded-3xl overflow-hidden border border-white/10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(145,94,255,0.12)] relative"
          style={{
            background:
              "linear-gradient(145deg, rgba(21,16,48,0.98) 0%, rgba(13,10,32,0.95) 100%)",
          }}
        >
          <div className="absolute -top-20 -left-20 w-56 h-56 bg-[#915eff]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-[#4a2b99]/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-7 sm:p-10 flex flex-col items-center">
            <div className="w-full flex flex-col items-center text-center">
              <h3 className="text-white font-bold text-xl sm:text-2xl tracking-tight text-center w-full">
                {contact.cardTitle[0]}
                <span className="text-[#915eff]">{contact.cardTitle[1]}</span>
              </h3>
              <p
                className="mt-3 text-sm sm:text-[15px] leading-relaxed text-center w-full max-w-md mx-auto"
                style={{ color: "var(--color-secondary)", textAlign: "center" }}
              >
                {contact.cardText}
              </p>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-5 w-full"
              noValidate
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-white/90 text-sm font-semibold"
                >
                  {contact.labels.name}
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={contact.placeholders.name}
                  autoComplete="name"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-white/90 text-sm font-semibold"
                >
                  {contact.labels.email}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={contact.placeholders.email}
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="message"
                  className="text-white/90 text-sm font-semibold"
                >
                  {contact.labels.message}
                </label>
                <textarea
                  id="message"
                  rows={5}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={contact.placeholders.message}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {feedback.message && (
                <div
                  className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 ${
                    feedback.type === "success"
                      ? "bg-emerald-950/70 text-emerald-300 border border-emerald-500/40"
                      : "bg-rose-950/70 text-rose-300 border border-rose-500/40"
                  }`}
                  role="alert"
                >
                  {feedback.type === "success" ? (
                    <svg
                      className="w-5 h-5 shrink-0 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 shrink-0 text-rose-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto min-w-[200px] px-8 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] via-[#7028e0] to-[#5b21b6] text-white font-bold text-sm shadow-[0_10px_25px_rgba(145,94,255,0.4)] hover:shadow-[0_14px_35px_rgba(145,94,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      {contact.sending}
                    </>
                  ) : (
                    <>
                      <span>{contact.submit}</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* 3D Earth — mounted lazily when scrolled near */}
      <div
        ref={earthRef}
        className="w-full max-w-md h-[340px] sm:h-[420px] mx-auto mt-8 flex items-center justify-center"
      >
        {showEarth ? (
          <motion.div
            variants={fadeIn("up", "spring", 0.3, 0.75)}
            className="w-full h-full flex items-center justify-center"
          >
            <EarthCanvas />
          </motion.div>
        ) : (
          <div className="w-full h-full rounded-3xl bg-white/[0.03] border border-white/5" />
        )}
      </div>
      <p
        className="mt-3 text-center text-[13px]"
        style={{ color: "var(--color-secondary)" }}
      >
        {contact.earthLabel}
      </p>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
