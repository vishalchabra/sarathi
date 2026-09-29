
export type RemedyPlanet =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu";

export type DailyRemedy = {
  id: string;
  planet: RemedyPlanet;
  lifeAreas: string[];
  relevantHouses: number[];
  title: string;
  instructions: string;
  traditionalRationale: string;
};

export const DAILY_REMEDY_LIBRARY: DailyRemedy[] = [
  // SUN
  {
    id: "sun-morning-water",
    planet: "Sun",
    lifeAreas: ["career", "recognition", "authority"],
    relevantHouses: [1, 9, 10],
    title: "Offer water to the rising Sun",
    instructions:
      "In the morning, offer clean water to the rising Sun as part of your customary worship. Avoid looking directly at the Sun.",
    traditionalRationale:
      "Surya is traditionally associated with authority, confidence, duty and recognition.",
  },
  {
    id: "sun-father-service",
    planet: "Sun",
    lifeAreas: ["family", "relationships"],
    relevantHouses: [9],
    title: "Offer practical support to a father figure",
    instructions:
      "Contact your father or a respected father figure and offer help with a task or responsibility that matters to them.",
    traditionalRationale:
      "The Sun is traditionally associated with the father, authority and responsibility.",
  },
  {
    id: "sun-wheat-charity",
    planet: "Sun",
    lifeAreas: ["money", "career"],
    relevantHouses: [2, 10, 11],
    title: "Donate essential food supplies",
    instructions:
      "Provide wheat or other essential food supplies to a person or family experiencing financial hardship.",
    traditionalRationale:
      "Wheat and charitable giving are traditionally associated with Surya-related practices.",
  },
  {
    id: "sun-mentor-gratitude",
    planet: "Sun",
    lifeAreas: ["career", "education"],
    relevantHouses: [5, 9, 10],
    title: "Express gratitude to a mentor",
    instructions:
      "Thank a teacher, mentor or senior who has contributed to your development. Offer practical assistance if appropriate.",
    traditionalRationale:
      "This practice reflects the Sun's traditional associations with leadership, guidance and respect.",
  },

  // MOON
  {
    id: "moon-food-charity",
    planet: "Moon",
    lifeAreas: ["family", "money"],
    relevantHouses: [2, 4],
    title: "Provide a nourishing meal",
    instructions:
      "Offer a freshly prepared meal or essential groceries to someone who would benefit from food assistance.",
    traditionalRationale:
      "Chandra is traditionally associated with nourishment, care and emotional security.",
  },
  {
    id: "moon-mother-care",
    planet: "Moon",
    lifeAreas: ["family", "relationships"],
    relevantHouses: [4],
    title: "Support your mother or a caregiver",
    instructions:
      "Spend meaningful time with your mother or someone who has cared for you. Offer assistance with something they need.",
    traditionalRationale:
      "The Moon and fourth house are traditionally associated with the mother, home and care.",
  },
  {
    id: "moon-rice-donation",
    planet: "Moon",
    lifeAreas: ["family", "money"],
    relevantHouses: [2, 4, 11],
    title: "Donate rice or groceries",
    instructions:
      "Provide rice or other staple groceries to a local food charity or a household in need.",
    traditionalRationale:
      "Rice and food donations are traditionally associated with Moon-related charitable practices.",
  },
  {
    id: "moon-family-support",
    planet: "Moon",
    lifeAreas: ["family", "relationships"],
    relevantHouses: [4, 7],
    title: "Offer meaningful family support",
    instructions:
      "Identify one practical responsibility you can take off a family member's shoulders today.",
    traditionalRationale:
      "This reflects the Moon's traditional association with domestic stability and emotional care.",
  },

  // MARS
  {
    id: "mars-lentil-donation",
    planet: "Mars",
    lifeAreas: ["money", "family"],
    relevantHouses: [2, 3, 6],
    title: "Donate red lentils",
    instructions:
      "Donate red lentils or other nutritious groceries through a local charity or directly to a household in need.",
    traditionalRationale:
      "Red lentils are traditionally associated with Mangal-related charitable practices.",
  },
  {
    id: "mars-sibling-support",
    planet: "Mars",
    lifeAreas: ["family", "relationships"],
    relevantHouses: [3],
    title: "Help a sibling with a practical task",
    instructions:
      "Offer assistance to a sibling or someone you regard as a sibling, particularly with a task requiring effort or initiative.",
    traditionalRationale:
      "Mars and the third house are traditionally associated with siblings, courage and initiative.",
  },
  {
    id: "mars-community-service",
    planet: "Mars",
    lifeAreas: ["career", "health"],
    relevantHouses: [6, 10],
    title: "Contribute through physical service",
    instructions:
      "Participate in a safe community volunteering activity that involves practical work, such as organising donated supplies.",
    traditionalRationale:
      "Mars is traditionally associated with physical energy, action and constructive effort.",
  },
  {
    id: "mars-conflict-resolution",
    planet: "Mars",
    lifeAreas: ["relationships", "career"],
    relevantHouses: [3, 6, 7],
    title: "Take a constructive step towards reconciliation",
    instructions:
      "If appropriate and safe, address an outstanding disagreement calmly, listen to the other person's concerns and avoid escalating the conflict.",
    traditionalRationale:
      "This practice channels Mars's traditional associations with courage and assertiveness towards constructive action.",
  },
  
  // MERCURY
  {
    id: "mercury-stationery-donation",
    planet: "Mercury",
    lifeAreas: ["education", "money", "career"],
    relevantHouses: [2, 4, 5, 10],
    title: "Provide educational materials",
    instructions:
      "Donate notebooks, pens or other useful learning materials to a student or an educational charity. Choose items the recipient actually needs.",
    traditionalRationale:
      "Budha is traditionally associated with learning, writing, communication and commerce.",
  },
  {
    id: "mercury-student-mentoring",
    planet: "Mercury",
    lifeAreas: ["education", "career"],
    relevantHouses: [3, 5, 9],
    title: "Help someone develop a skill",
    instructions:
      "Offer a student or junior colleague practical help with a subject, language or professional skill you know well.",
    traditionalRationale:
      "This reflects Mercury's traditional associations with intellect, learning and the exchange of knowledge.",
  },
  {
    id: "mercury-business-assistance",
    planet: "Mercury",
    lifeAreas: ["career", "money"],
    relevantHouses: [3, 7, 10, 11],
    title: "Support a small business",
    instructions:
      "Help a small business owner with a useful task such as organising records, understanding a document or improving communication with customers.",
    traditionalRationale:
      "Mercury is traditionally associated with trade, calculation, business and communication.",
  },
  {
    id: "mercury-green-moong-donation",
    planet: "Mercury",
    lifeAreas: ["money", "family"],
    relevantHouses: [2, 6, 11],
    title: "Donate green moong",
    instructions:
      "Provide green moong or other nutritious groceries to a local food charity or a household in need.",
    traditionalRationale:
      "Green moong is traditionally associated with Budha-related charitable practices.",
  },

  // JUPITER
  {
    id: "jupiter-education-sponsorship",
    planet: "Jupiter",
    lifeAreas: ["education", "money", "family"],
    relevantHouses: [2, 5, 9, 11],
    title: "Support a child's education",
    instructions:
      "Contribute towards educational materials, school supplies or a verified educational assistance programme for a child in need.",
    traditionalRationale:
      "Guru is traditionally associated with wisdom, education, children and generosity.",
  },
  {
    id: "jupiter-teacher-support",
    planet: "Jupiter",
    lifeAreas: ["education", "career"],
    relevantHouses: [5, 9, 10],
    title: "Offer support to a teacher",
    instructions:
      "Help a teacher or educational organisation with a genuine need, such as obtaining classroom supplies or organising learning resources.",
    traditionalRationale:
      "Jupiter is traditionally associated with teachers, mentors and the transmission of knowledge.",
  },
  {
    id: "jupiter-book-donation",
    planet: "Jupiter",
    lifeAreas: ["education", "family"],
    relevantHouses: [4, 5, 9],
    title: "Donate useful books",
    instructions:
      "Give suitable books to a school, community library or educational charity. Confirm which subjects and reading levels are needed first.",
    traditionalRationale:
      "Sharing knowledge reflects Guru's traditional associations with learning, wisdom and guidance.",
  },
  {
    id: "jupiter-food-charity",
    planet: "Jupiter",
    lifeAreas: ["money", "family"],
    relevantHouses: [2, 5, 9, 11],
    title: "Provide food to someone in need",
    instructions:
      "Arrange a nutritious meal or essential groceries for a family, student or community food programme.",
    traditionalRationale:
      "Charity, nourishment and generosity are traditionally associated with Guru-related practices.",
  },

  // VENUS
  {
    id: "venus-clothing-donation",
    planet: "Venus",
    lifeAreas: ["relationships", "money", "family"],
    relevantHouses: [2, 4, 7, 11],
    title: "Donate clothing with dignity",
    instructions:
      "Provide clean, good-quality clothing to a person or charity that has identified a genuine need. Avoid donating damaged or unsuitable items.",
    traditionalRationale:
      "Shukra is traditionally associated with clothing, comfort, beauty and material well-being.",
  },
  {
    id: "venus-womens-welfare",
    planet: "Venus",
    lifeAreas: ["relationships", "family", "money"],
    relevantHouses: [4, 7, 8, 11],
    title: "Support women's welfare",
    instructions:
      "Contribute essential hygiene supplies, educational materials or practical assistance through a reputable women's welfare organisation.",
    traditionalRationale:
      "Supporting women's welfare is one of the charitable practices traditionally associated with Shukra.",
  },
  {
    id: "venus-partner-support",
    planet: "Venus",
    lifeAreas: ["relationships", "family"],
    relevantHouses: [4, 7],
    title: "Offer thoughtful support to your partner",
    instructions:
      "Ask your spouse or partner what would genuinely make their day easier, then take responsibility for one practical task without expecting anything in return.",
    traditionalRationale:
      "Venus is traditionally associated with partnership, affection, harmony and mutual care.",
  },
  {
    id: "venus-creative-support",
    planet: "Venus",
    lifeAreas: ["education", "career", "relationships"],
    relevantHouses: [3, 5, 7, 10],
    title: "Support someone's creative development",
    instructions:
      "Help an aspiring artist, musician or creative student access materials, learning opportunities or constructive mentorship.",
    traditionalRationale:
      "Shukra is traditionally associated with artistic expression, creativity and the fine arts.",
  },
  
  // SATURN
  {
    id: "saturn-elderly-service",
    planet: "Saturn",
    lifeAreas: ["family", "relationships", "health"],
    relevantHouses: [4, 6, 8, 12],
    title: "Offer practical assistance to an elderly person",
    instructions:
      "Help an elderly family member or someone in your community with groceries, transport or an essential household task. Ask what assistance they actually need.",
    traditionalRationale:
      "Shani is traditionally associated with old age, duty, patience and service.",
  },
  {
    id: "saturn-worker-support",
    planet: "Saturn",
    lifeAreas: ["career", "money"],
    relevantHouses: [6, 10, 11],
    title: "Support someone who works with their hands",
    instructions:
      "Provide a meal, essential supplies or practical assistance to a worker experiencing hardship. Treat the recipient with dignity and respect.",
    traditionalRationale:
      "Saturn is traditionally associated with labour, perseverance, service and responsibility.",
  },
  {
    id: "saturn-blanket-donation",
    planet: "Saturn",
    lifeAreas: ["family", "money"],
    relevantHouses: [2, 6, 8, 12],
    title: "Donate essential supplies",
    instructions:
      "Provide blankets, suitable clothing or other essential supplies through a reputable charity. Check what recipients need and what is appropriate for the local climate.",
    traditionalRationale:
      "Providing necessities to people facing hardship is a traditional Shani-related charitable practice.",
  },
  {
    id: "saturn-community-service",
    planet: "Saturn",
    lifeAreas: ["career", "family"],
    relevantHouses: [4, 6, 10, 11],
    title: "Contribute to community upkeep",
    instructions:
      "Join a safe, organised community cleaning or maintenance activity, or help maintain a shared space with the appropriate permission.",
    traditionalRationale:
      "Saturn's traditional associations include sustained effort, humble service and responsibility towards the community.",
  },

  // RAHU
  {
    id: "rahu-migrant-worker-support",
    planet: "Rahu",
    lifeAreas: ["career", "money"],
    relevantHouses: [6, 10, 11, 12],
    title: "Support migrant workers",
    instructions:
      "Contribute food, essential supplies or practical assistance through a reputable organisation supporting migrant workers.",
    traditionalRationale:
      "In some Vedic remedial traditions, Rahu-related charity emphasises service to people experiencing displacement or social exclusion.",
  },
  {
    id: "rahu-newcomer-assistance",
    planet: "Rahu",
    lifeAreas: ["career", "education", "relationships"],
    relevantHouses: [3, 7, 9, 12],
    title: "Help someone navigating an unfamiliar environment",
    instructions:
      "Assist a newcomer with a practical task such as understanding local procedures, finding reliable information or accessing community resources.",
    traditionalRationale:
      "This practice draws on Rahu's traditional associations with foreign places, unfamiliar circumstances and unconventional paths.",
  },
  {
    id: "rahu-anonymous-charity",
    planet: "Rahu",
    lifeAreas: ["money", "relationships"],
    relevantHouses: [2, 8, 11, 12],
    title: "Perform an anonymous act of charity",
    instructions:
      "Make a modest donation or provide essential assistance without seeking public recognition. Choose a genuine need and a trustworthy recipient.",
    traditionalRationale:
      "Anonymous service is used in some remedial traditions as a practice of humility and detachment from recognition.",
  },
  {
    id: "rahu-community-welfare",
    planet: "Rahu",
    lifeAreas: ["family", "career", "money"],
    relevantHouses: [4, 6, 10, 11],
    title: "Support an underserved community",
    instructions:
      "Contribute to a reputable community initiative providing food, education or essential assistance to people who have limited access to support.",
    traditionalRationale:
      "This practice reflects remedial traditions that associate Rahu with people outside established social structures.",
  },

  // KETU
  {
    id: "ketu-animal-shelter",
    planet: "Ketu",
    lifeAreas: ["family", "relationships"],
    relevantHouses: [4, 6, 12],
    title: "Support an animal rescue organisation",
    instructions:
      "Donate suitable food or supplies to an animal shelter, or support its work through an approved volunteering programme. Check the shelter's actual needs first.",
    traditionalRationale:
      "Care for dogs and other animals is associated with Ketu in several popular Vedic remedial traditions.",
  },
  {
    id: "ketu-stray-dog-care",
    planet: "Ketu",
    lifeAreas: ["family", "health"],
    relevantHouses: [4, 6, 12],
    title: "Support the welfare of stray dogs",
    instructions:
      "Where legally permitted and safe, support a recognised stray-animal feeding or care programme. Avoid approaching unfamiliar or distressed animals directly.",
    traditionalRationale:
      "Feeding and caring for dogs is a traditional practice associated with Ketu.",
  },
  {
    id: "ketu-belongings-donation",
    planet: "Ketu",
    lifeAreas: ["money", "family"],
    relevantHouses: [2, 4, 8, 12],
    title: "Donate useful belongings",
    instructions:
      "Select clean, serviceable items you no longer need and give them to a charity or someone who can genuinely use them.",
    traditionalRationale:
      "This practice reflects Ketu's traditional associations with simplicity, detachment and reduced attachment to possessions.",
  },
  {
    id: "ketu-selfless-service",
    planet: "Ketu",
    lifeAreas: ["career", "relationships", "family"],
    relevantHouses: [6, 9, 12],
    title: "Perform an act of selfless service",
    instructions:
      "Offer practical help to someone without expecting payment, praise or a favour in return. Choose an action that respects their needs and boundaries.",
    traditionalRationale:
      "Selfless service reflects Ketu's traditional associations with detachment, introspection and spiritual discipline.",
  },
];