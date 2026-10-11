import { motion } from "framer-motion";

import { staggerContainer } from "../utils/motion";

const SectionWrapper = (Component, idName) =>
  function HOC() {
    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        className="padding w-full relative z-0 flex flex-col items-center justify-center"
      >
        <span className="hash-span" id={idName}>
          &nbsp;
        </span>

        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center">
          <Component />
        </div>
      </motion.section>
    );
  };

export default SectionWrapper;
