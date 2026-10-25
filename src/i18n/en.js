import {
  web,
  backend,
  creator,
  figma,
  bsindcare,
  dflorarte,
  education,
  herobg,
  projectBsindcare,
  projectDflorarte,
  projectBrzstore,
  projectIcarus,
  projectIcarusFleet,
} from "../assets";

const en = {
  meta: {
    title: "BrtzDesigns | Full-Stack Developer & UI/UX Designer - Perth, Australia",
    description:
      "BrtzDesigns - Brandon Brumertz, full-stack developer and UI/UX designer in Perth, Australia. C#, .NET, Python, JavaScript, Node.js, SQL and MongoDB. Live client work: bsindcare.com, dflorarte.com.",
  },

  nav: {
    about: "About",
    work: "Experience",
    tech: "Tech",
    services: "Services",
    projects: "Projects",
    contact: "Contact",
    hireMe: "Hire me",
    language: "Language",
  },

  hero: {
    greeting: "Hi, I'm",
    name: "Brandon",
    subtitle: ["Full-Stack Developer", "& UI/UX Designer."],
    scrollHint: "Scroll to explore",
  },

  about: {
    sectionSub: "Introduction",
    sectionHead: "Overview.",
    paragraph:
      "I hold a Diploma of Information Technology in Advanced Programming (ICT50220) and work as a full-stack developer and UI/UX designer based in Perth, Australia. I build with C#, .NET, Python, JavaScript, Node.js and HTML/CSS, backed by SQL and MongoDB databases, turning ideas into fast, accessible, well designed products.",
    credentials: ["ICT50220", "Diploma of IT · Advanced Programming", "Perth, Australia"],
    services: [
      { title: "Full-Stack Developer", icon: web },
      { title: "UI/UX Designer", icon: figma },
      { title: "Backend & APIs", icon: backend },
      { title: "Database Engineering", icon: creator },
    ],
  },

  experience: {
    sectionSub: "What I have done so far",
    sectionHead: "Work Experience.",
    items: [
      {
        title: "Founder & Full-Stack / UI-UX Developer",
        company_name: "BrtzDesigns",
        icon: creator,
        iconBg: "#4a2b99",
        date: "Jan 2025 - Present",
        points: [
          "Founded BrtzDesigns, a Perth based studio delivering end to end web design and development for small businesses.",
          "Designed and shipped two live client sites bsindcare.com and dflorarte.com, from brand discovery through deployment.",
          "Built this interactive 3D portfolio with React, Three.js and Tailwind CSS, code split for a fast first paint.",
          "Own the full client lifecycle: scoping, UI design, development, automated testing and handover.",
        ],
      },
      {
        title: "Web Developer · Client Project",
        company_name: "BS IND CARE",
        icon: bsindcare,
        iconBg: "#3B176B",
        date: "2025 - 2026",
        points: [
          "Delivered the official landing page for a premium cosmetics brand as a zero build single page application.",
          "Built a hand rolled design system, brand tokens, glassmorphism and keyframe animations, on semantic HTML5 with ARIA.",
          "Implemented gallery carousel, mobile menu, real time form validation, honeypot spam protection and toast notifications in vanilla JavaScript.",
          "Shipped with a 78/78 automated test suite covering DOM integrity, media assets, internal links and SEO.",
        ],
      },
      {
        title: "Web Developer · Client Project",
        company_name: "D'Florarte",
        icon: dflorarte,
        iconBg: "#5A5243",
        date: "2025 - 2026",
        points: [
          "Built the official single page site for a wedding planner and floral art studio with 20+ years of trajectory.",
          "Developed a 3D coverflow gallery with Swiper 11, a filterable portfolio grid and a keyboard accessible lightbox.",
          "Added direct conversion funnels: floating WhatsApp button and pre-filled enquiry messages per service.",
          "Delivered a 32/32 automated test suite plus HTTP integration checks for status codes and MIME types.",
        ],
      },
      {
        title: "Diploma of Information Technology",
        company_name: "Advanced Programming · ICT50220",
        icon: education,
        iconBg: "#8a6a1f",
        date: "2024 - 2025",
        points: [
          "Completed an advanced programming diploma covering object oriented development, data structures and algorithms.",
          "Worked across C#, .NET, Java, Python, SQL and web technologies on assessed, production style projects.",
          "Practised agile development, version control and technical documentation on team projects.",
        ],
      },
    ],
  },

  tech: {
    sectionSub: "My technical toolbox",
    sectionHead: "Technologies.",
  },

  services: {
    sectionSub: "What I can do for you",
    sectionHead: "Services.",
    intro:
      "Whether you need a brand new site, a redesign, or a custom application, I handle the whole build  design, code, testing and launch, so you deal with one person instead of an agency.",
    items: [
      {
        title: "Web Design",
        description:
          "Conversion focused landing pages and brand systems that look as good as they perform, built on a documented design language.",
        highlight: "Design systems",
      },
      {
        title: "Web Development",
        description:
          "Fast, responsive, accessible custom builds with clean semantic markup, no page builder bloat, no template lock in.",
        highlight: "Performance",
      },
      {
        title: "UI/UX Design",
        description:
          "Wireframes, flows and polished interfaces designed in Figma, then handed to code without losing a single detail.",
        highlight: "Figma → code",
      },
      {
        title: "Integrations & Databases",
        description:
          "Contact forms, WhatsApp funnels, SQL and MongoDB data layers, REST APIs and thirdparty services wired in properly.",
        highlight: "Backend",
      },
    ],
    cta: {
      title: "Have a project in mind?",
      text: "Tell me what you need and I'll reply within one business day.",
      whatsapp: "Chat on WhatsApp",
      email: "Email me",
    },
  },

  projects: {
    sectionSub: "My work",
    sectionHead: "Projects.",
    intro:
      "A selection of live client work and open source projects. Each card links to the live site and the source repository, with the stack I used to build it.",
    liveDemo: "Visit live site",
    sourceCode: "Source code",
    items: [
      {
        name: "BS IND CARE",
        description:
          "Official landing page for a premium cosmetics brand: immersive product storytelling, interactive gallery carousel, WhatsApp checkout funnel and real-time validated contact form. Zero-build SPA shipped with a 78/78 automated test suite.",
        tags: [
          { name: "html5", color: "blue-text-gradient" },
          { name: "tailwind", color: "green-text-gradient" },
          { name: "javascript", color: "pink-text-gradient" },
          { name: "seo", color: "orange-text-gradient" },
        ],
        image: projectBsindcare,
        source_code_link: "https://github.com/Brumertz/bs_ind_care",
        live_link: "https://bsindcare.com",
      },
      {
        name: "D'Florarte",
        description:
          "Single-page site for a wedding planning and floral art studio: 3D coverflow gallery, filterable portfolio with lightbox, service catalogue and pre-filled WhatsApp enquiry funnels. 32/32 automated tests passing.",
        tags: [
          { name: "javascript", color: "blue-text-gradient" },
          { name: "swiper", color: "green-text-gradient" },
          { name: "css3", color: "pink-text-gradient" },
          { name: "spa", color: "orange-text-gradient" },
        ],
        image: projectDflorarte,
        source_code_link: "https://github.com/Brumertz/Dflorarte",
        live_link: "https://dflorarte.com",
      },
      {
        name: "BrtzDesigns 3D Portfolio",
        description:
          "This site. React + Vite portfolio with interactive Three.js scenes, framer-motion animation, code-split lazy loading, bilingual EN/ES content and an EmailJS contact form with validation.",
        tags: [
          { name: "react", color: "blue-text-gradient" },
          { name: "threejs", color: "green-text-gradient" },
          { name: "vite", color: "pink-text-gradient" },
          { name: "tailwind", color: "orange-text-gradient" },
        ],
        image: herobg,
        source_code_link: "https://github.com/Brumertz/brandon-portfolio",
        live_link: "https://brtzdesigns.com",
      },
      {
        name: "BrzStore",
        description:
          "Full-stack store built on ASP.NET Core: REST API alongside a Razor web client, with structured data access and a layered application architecture.",
        tags: [
          { name: "c#", color: "blue-text-gradient" },
          { name: "asp.net", color: "green-text-gradient" },
          { name: "sql", color: "pink-text-gradient" },
        ],
        image: projectBrzstore,
        source_code_link: "https://github.com/Brumertz/BrzStore-Project",
      },
      {
        name: "Icarus Drone Service App",
        description:
          "Desktop application for logging regular and express drone services, built around queue-based scheduling and job dispatch.",
        tags: [
          { name: "javascript", color: "blue-text-gradient" },
          { name: "desktop", color: "green-text-gradient" },
          { name: "queues", color: "pink-text-gradient" },
        ],
        image: projectIcarus,
        source_code_link: "https://github.com/Brumertz/Icarus_Drone_Service_App",
      },
      {
        name: "Icarus Fleet",
        description:
          "Service queue API & web dashboard for drone maintenance built with ASP.NET Core: Regular and Express FIFO queues, atomic surcharge calculation, sequential service tags, and Swagger UI.",
        tags: [
          { name: "c#", color: "blue-text-gradient" },
          { name: ".net", color: "green-text-gradient" },
          { name: "minimal-api", color: "pink-text-gradient" },
        ],
        image: projectIcarusFleet,
        source_code_link: "https://github.com/Brumertz/Icarus-Fleet",
      },
    ],
  },

  contact: {
    sectionSub: "Get in touch",
    sectionHead: "Contact.",
    cardTitle: ["Let's build something ", "extraordinary"],
    cardText: "Have a project in mind? Send me a message and I'll get back to you promptly.",
    infoTitle: "Direct contact",
    info: [
      { key: "email", label: "Email", value: "brtz.designs@gmail.com" },
      { key: "phone", label: "Phone", value: "+61 406 771 491" },
      { key: "location", label: "Location", value: "Perth, Australia" },
    ],
    whatsapp: "Chat on WhatsApp",
    labels: { name: "Your Name", email: "Your Email", message: "Your Message" },
    placeholders: {
      name: "e.g. Alex Johnson",
      email: "e.g. alex@example.com",
      message: "Tell me about your project, goals, or timeline...",
    },
    submit: "Send Message",
    sending: "Sending...",
    success: "Thank you! Your message has been sent successfully.",
    errorFallback: "Something went wrong. Please try again later.",
    validation: {
      name: "Please enter your name.",
      email: "Please enter your email.",
      emailInvalid: "Please enter a valid email address.",
      message: "Please enter your message.",
    },
    earthLabel: "Based in Perth, Australia - working with clients worldwide.",
  },

  footer: {
    email: "Email",
    phone: "Phone",
    location: "Location",
    rights: "All rights reserved.",
    backToTop: "Back to top",
  },
};

export default en;
