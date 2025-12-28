import { PROJECT_IMAGE_URIS } from "./projectImages";

export const SITE = {
  companyName: "King Electric & Home Renovation LLC",
  tagline: "Residential & Commercial",
  phoneDisplay: "703-859-4790",
  phoneTel: "tel:7038594790",
  toEmail: "you@yourcompany.com",
  locationLabel: "Virginia, USA",
  mapsEmbedUrl: "https://www.google.com/maps?q=Alexandria,+VA&output=embed"
} as const;

export const NAV = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" }
] as const;

export const HERO = {
  headline: "Tesla & EV Charger Specialists You Can Trust",
  subheadline:
    "We create sleek, dependable Tesla and EV charger installs that keep your driveway ready for every drive, backed by the same attention to detail we bring to every electrical project.",
  primaryCta: "Book a Charger Install",
  secondaryCta: "Call Now"
} as const;

export const ABOUT = {
  title: "About Us",
  body:
    "We are a VA DPOR licensed and insured Electrical contractor that was founded in 2011. Over the years we have grown into the successful company that we are today. We specialize in Tesla and EV charger installations while providing superior electrical services for residential spaces and commercial businesses."
} as const;

export const SERVICES = {
  title: "Our Services",
  items: [
    "Tesla & EV Charger Installations",
    "Panel Upgrades & Repairs",
    "Indoor Lighting Design & Installation",
    "Outdoor & Landscape Lighting",
    "Fan Installs & Repair",
    "Ground Wire Install",
    "Jacuzzi / Hot Tub Wiring",
    "Repairing Light Fixtures",
    "Outlets and Switches (New or Relocated)",
    "Drywall repairs",
    "And MORE."
  ]
} as const;

export const VALUES = {
  title: "We pride ourselves on the core values that drive our business:",
  items: [
    {
      title: "Safety",
      emoji: "🛡️",
      body:
        "Ensuring the safety of our clients and team members is our top priority. We adhere to the highest industry standards and use state-of-the-art equipment to deliver safe, reliable services."
    },
    {
      title: "Quality",
      emoji: "🏆",
      body:
        "We are dedicated to providing top-notch electrical work, using only the best materials and practices. Our team of licensed and skilled electricians guarantees that every project is completed with precision and care."
    },
    {
      title: "Integrity",
      emoji: "🤝",
      body:
        "We believe in maintaining open and honest communication with our clients, ensuring transparency and trust throughout every stage of our projects."
    },
    {
      title: "Customer Satisfaction",
      emoji: "😊",
      body:
        "We strive to exceed our clients’ expectations by delivering exceptional service and tailored solutions that cater to their unique needs."
    }
  ]
} as const;

export const TEAM = {
  title: "Our Team",
  body:
    "Our team of electricians is the backbone of King Electric & Home Renovation LLC. Each member is licensed, insured, and carefully selected for their expertise and commitment to excellence. With ongoing training and development, our team stays up to date with the latest industry advancements and techniques, ensuring that we provide the best possible service to our clients."
} as const;

export const REVIEWS = {
  title: "Hear what our satisfied clients have to say about their experience with us",
  items: [
    {
      quote:
        "Olvin and his guys’ outstanding work. They installed Tesla wall charger in my garage. I am very happy and pleased with the work. They also were very CLEAN. They covered everything and cleaned up everything also. We will certainly use King Electric & Home Renovation LLC in the future and can’t recommend them enough to anyone else.",
      author: "K.D",
      source: "Google review"
    },
    {
      quote:
        "I was very happy with the work King Electric & Home Renovation LLC did. Very professional. They had to run a new line through the attic to my master bathroom and despite some challenges, were able to put the plug exactly where I needed it without excessive holes in the drywall. They really went the extra mile to do the job right and the price was very reasonable for the work done. I also noted they cleaned up everything and were careful on a wet day to be sure they did not track mud in the house. I will use them again for sure.",
      author: "C.S",
      source: "Google review"
    },
    {
      quote:
        "Excellent service, came out to do an electrical panel replacement & meter upgrade. Great job, completed the project in 1 day and passed code inspection with no issues. I highly recommend it. Have been using King Electric & Home Renovation LLC for all of my electrical needs.",
      author: "B.L",
      source: "Google review"
    }
  ]
} as const;

export const PROJECTS = {
  title: "Our Projects",
  cards: [
    { title: "Tesla & EV Charger Installs", img: PROJECT_IMAGE_URIS.tesla_charger },
    { title: "Indoor Lighting Upgrades", img: PROJECT_IMAGE_URIS.interior_lighting },
    { title: "Panel Upgrades", img: PROJECT_IMAGE_URIS.panel_upgrade },
    { title: "Outdoor & Landscape Lighting", img: PROJECT_IMAGE_URIS.landscape_lighting },
    { title: "Commercial Buildouts", img: PROJECT_IMAGE_URIS.commercial_buildout }
  ]
} as const;

export const CONTACT = {
  title: "We’re Here to Help!",
  subtitle:
    "Ready to discuss your project or schedule a service? Contact us today using the information below, or fill out our online inquiry form for a prompt response.",
  businessHours: [
    "Monday: 7AM - 6 PM",
    "Tuesday: 7AM - 6 PM",
    "Wednesday: 7AM - 6 PM",
    "Thursday: 7AM - 6 PM",
    "Friday: 7AM - 6 PM",
    "Saturday: 7AM - 6 PM",
    "Sunday: Close"
  ]
} as const;
