import { motion } from "framer-motion";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { useLocale } from "../i18n";
import useInView from "../hooks/useInView";
import { textVariant } from "../utils/motion";
import { IS_TOUCH } from "../utils/isTouch";

/**
 * Touch-only devices render a static sphere instead of a WebGL ball. The page
 * already holds three always-on contexts (hero, stars, planet); adding nine
 * more would cross the per-page WebGL cap (8 on iOS Safari, 16 on Chrome) and
 * kill the oldest contexts — blanking the hero. Phones lack the GPU headroom
 * anyway, so the compositor draws the same artwork for free.
 */
/** The 3D ball's artwork without the context cost: a shaded static sphere. */
const techSphereStyle = (icon, index) => ({
  backgroundImage: `url(${icon})`,
  // Negative so every sphere starts mid-cycle instead of waiting its turn:
  // the grid animates together but out of phase, like the old <Float> field.
  animationDelay: `-${(index * 0.35).toFixed(2)}s`,
});

/**
 * One tech icon. The WebGL canvas only exists while the cell is near the
 * viewport, so content that is off-screen owns no context at all.
 *
 * The placeholder is the same size as the canvas, so mounting/unmounting
 * cannot shift layout.
 */
const TechBall = ({ technology, index }) => {
  const [ref, inView] = useInView({ rootMargin: "250px", lingerMs: 800 });

  return (
    <div
      ref={ref}
      className={`w-24 h-24${IS_TOUCH ? " tech-cell" : ""}`}
      title={technology.name}
      role="img"
      aria-label={technology.name}
    >
      {IS_TOUCH ? (
        <div
          className="tech-sphere"
          style={techSphereStyle(technology.icon, index)}
        />
      ) : inView ? (
        <BallCanvas icon={technology.icon} />
      ) : (
        <div className="w-full h-full" />
      )}
    </div>
  );
};

const Tech = () => {
  const { content } = useLocale();

  return (
    <>
      <motion.div variants={textVariant()} className="text-center mb-14">
        <p className="section-sub">{content.tech.sectionSub}</p>
        <h2 className="section-head">{content.tech.sectionHead}</h2>
      </motion.div>

      <div className="flex flex-row flex-wrap justify-center gap-10">
        {technologies.map((technology, index) => (
          <TechBall
            key={technology.name}
            technology={technology}
            index={index}
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "tech");
