import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { useLocale } from "../i18n";
import useInView from "../hooks/useInView";
import useMediaQuery from "../hooks/useMediaQuery";
import { textVariant } from "../utils/motion";
import { IS_TOUCH } from "../utils/isTouch";
import { isBudgetExceeded, subscribeBudget } from "../utils/webglBudget";

/**
 * Whether the grid renders live <BallCanvas>s or the static CSS sphere.
 *
 * - Pointer-capable devices (desktop/laptop) always get WebGL: the page holds
 *   ~10 contexts there (hero + 9 balls), inside Chrome's 16-context cap.
 * - Touch-only devices get WebGL only while the viewport is tablet-wide
 *   (>= 768px — the same breakpoint the hero uses). The cap that forced the
 *   original all-or-nothing fallback (8 on iOS Safari, 16 on Chrome) is a
 *   device/browser property, not a touch property: a tablet has the GPU
 *   headroom a phone lacks, so narrow phones keep the static sphere while
 *   tablets get the real 3D balls.
 * - If ANY context on the page is ever lost (`webglcontextlost` — the browser
 *   saying the cap was hit, a GPU reset, …), every ball falls back to the
 *   static sphere for the rest of the session (utils/webglBudget.js). That
 *   releases the 9 ball contexts in one step, which is what lets the older,
 *   more important one — the hero — restore instead of staying blank.
 *
 * The width check is reactive (useMediaQuery) because responsive mode and
 * rotation move it at runtime; `IS_TOUCH` stays the one-shot trait it is.
 */
const useBallMode = () => {
  const wideEnough = useMediaQuery("(min-width: 768px)");
  const budgetExceeded = useSyncExternalStore(
    subscribeBudget,
    isBudgetExceeded,
    () => false
  );
  return (!IS_TOUCH || wideEnough) && !budgetExceeded;
};

/**
 * The 3D ball's artwork without the context cost: a shaded static sphere.
 * The icon rides on a `--tech-icon` custom property instead of an inline
 * `background-image`, so styles.css can layer the facet/light stack *under*
 * the icon (an inline `background-image` would clobber that whole stack).
 *
 * Negative delay so every sphere starts mid-cycle instead of waiting its turn:
 * the grid animates together but out of phase, like the old <Float> field.
 */
const techSphereStyle = (icon, index) => ({
  "--tech-icon": `url(${icon})`,
  animationDelay: `-${(index * 0.35).toFixed(2)}s`,
});

/**
 * One tech icon. The WebGL canvas only exists while the cell is near the
 * viewport, so content that is off-screen owns no context at all.
 *
 * The placeholder is the same size as the canvas, so mounting/unmounting
 * cannot shift layout.
 */
const TechBall = ({ technology, index, webgl }) => {
  const [ref, inView] = useInView({ rootMargin: "250px", lingerMs: 800 });

  return (
    <div
      ref={ref}
      className={`w-24 h-24${webgl ? "" : " tech-cell"}`}
      title={technology.name}
      role="img"
      aria-label={technology.name}
    >
      {!webgl ? (
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
  const webgl = useBallMode();

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
            webgl={webgl}
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "tech");
