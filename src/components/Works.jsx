import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { useLocale } from "../i18n";
import { fadeIn, textVariant } from "../utils/motion";
import { IS_TOUCH } from "../utils/isTouch";

// Touch-only devices skip react-tilt entirely: it relies on mousemove/mouseenter
// that never fire on touch screens, so the listeners would be wasted and could
// fight native touch-scroll.
const ExternalLinkIcon = () => (
  <svg
    className="w-1/2 h-1/2"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  live_link,
  labels,
}) => {
  // Shared card class — fluid on mobile, fixed on sm+
  const cardClass = "p-6 rounded-2xl w-full sm:w-[360px]";
  const cardStyle = { backgroundColor: "var(--color-tertiary)" };

  const inner = (
    <>
      <div className="relative w-full h-[230px]">
        <img
          src={image}
          alt={name}
          width={800}
          height={480}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover rounded-2xl"
        />

        <div className="absolute inset-0 flex justify-end m-3 gap-2 card-img_hover">
          {live_link && (
            <a
              href={live_link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${labels.liveDemo}: ${name}`}
              title={labels.liveDemo}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer text-white hover:text-[#915eff] transition-colors"
            >
              <ExternalLinkIcon />
            </a>
          )}
          {source_code_link && (
            <a
              href={source_code_link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${labels.sourceCode}: ${name}`}
              title={labels.sourceCode}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              <img
                src={github}
                alt=""
                width={20}
                height={20}
                className="w-1/2 h-1/2 object-contain"
              />
            </a>
          )}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-white font-bold text-[24px]">{name}</h3>
        <p
          className="mt-2 text-[14px]"
          style={{ color: "var(--color-secondary)" }}
        >
          {description}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <p
            key={`${name}-${tag.name}`}
            className={`text-[14px] ${tag.color}`}
          >
            #{tag.name}
          </p>
        ))}
      </div>
    </>
  );

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      {IS_TOUCH ? (
        <div className={cardClass} style={cardStyle}>
          {inner}
        </div>
      ) : (
        <Tilt
          options={{ max: 45, scale: 1, speed: 450 }}
          className={cardClass}
          style={cardStyle}
        >
          {inner}
        </Tilt>
      )}
    </motion.div>
  );
};

const Works = () => {
  const { content } = useLocale();
  const { projects } = content;

  const labels = {
    liveDemo: projects.liveDemo,
    sourceCode: projects.sourceCode,
  };

  return (
    <>
      <motion.div variants={textVariant()} className="text-center w-full mb-6">
        <p className="section-sub">{projects.sectionSub}</p>
        <h2 className="section-head">{projects.sectionHead}</h2>
      </motion.div>

      <div className="w-full flex justify-center">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-4 text-[17px] sm:text-[18px] max-w-3xl leading-[32px] text-center"
          style={{ color: "var(--color-secondary)" }}
        >
          {projects.intro}
        </motion.p>
      </div>

      <div className="mt-16 sm:mt-20 flex flex-wrap justify-center items-stretch gap-8 sm:gap-10 w-full max-w-5xl mx-auto">
        {projects.items.map((project, index) => (
          <ProjectCard
            key={`project-${index}`}
            index={index}
            labels={labels}
            {...project}
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
