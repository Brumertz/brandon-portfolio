import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { SectionWrapper } from "../hoc";
import { useLocale } from "../i18n";
import { textVariant } from "../utils/motion";

const ExperienceCard = ({ experience }) => (
  <VerticalTimelineElement
    contentStyle={{ background: "#1d1836", color: "#fff" }}
    contentArrowStyle={{ borderRight: "7px solid #232631" }}
    date={experience.date}
    iconStyle={{ background: experience.iconBg }}
    icon={
      <div className="flex justify-center items-center w-full h-full">
        <img
          src={experience.icon}
          alt={experience.company_name}
          width={60}
          height={60}
          loading="lazy"
          decoding="async"
          className="w-[60%] h-[60%] object-contain"
        />
      </div>
    }
  >
    <div>
      <h3 className="text-white text-[22px] font-bold leading-snug">
        {experience.title}
      </h3>
      <p
        className="text-[16px] font-semibold"
        style={{ marginLeft: 25, color: "var(--color-secondary)" }}
      >
        {experience.company_name}
      </p>
    </div>

    <ul className="padding mt-5 list-disc ml-5 space-y-2">
      {experience.points.map((point, index) => (
        <li
          key={`experience-point-${index}`}
          className="text-[14px] pl-1 tracking-wider"
        >
          {point}
        </li>
      ))}
    </ul>
  </VerticalTimelineElement>
);

const Experience = () => {
  const { content } = useLocale();
  const { experience } = content;

  return (
    <>
      <motion.div variants={textVariant()} className="text-center w-full">
        <p className="section-sub">{experience.sectionSub}</p>
        <h2 className="section-head">{experience.sectionHead}</h2>
      </motion.div>

      <div className="mt-16 sm:mt-20 flex flex-col items-center w-full max-w-4xl mx-auto">
        <VerticalTimeline>
          {experience.items.map((item, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={item}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
