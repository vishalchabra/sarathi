export type NakshatraTone = {
  style: "calming" | "direct" | "strategic" | "supportive" | "analytical";
  message: string;
};

export const nakshatraToneMap: Record<string, NakshatraTone> = {
  ashwini: {
    style: "direct",
    message:
      "You tend to respond best to quick clarity, movement, and decisive action rather than overthinking.",
  },

  bharani: {
    style: "strategic",
    message:
      "You carry intensity deeply, so you do best when decisions are honest, contained, and emotionally mature.",
  },

  krittika: {
    style: "direct",
    message:
      "You naturally want to cut through confusion, so clean truth and sharp priorities help you most.",
  },

  rohini: {
    style: "calming",
    message:
      "You tend to respond best to emotional reassurance, steadiness, and progress that feels secure rather than forced.",
  },

  mrigashira: {
    style: "analytical",
    message:
      "Your mind likes to explore options before settling, so clarity comes when you reduce scattered thinking and choose one path.",
  },

  ardra: {
    style: "analytical",
    message:
      "Your mind works through intensity and analysis before clarity appears, so structure helps more than emotional rushing.",
  },

  punarvasu: {
    style: "supportive",
    message:
      "You tend to recover through perspective and reset, so you do well when you return to what is simple, clean, and true.",
  },

  pushya: {
    style: "supportive",
    message:
      "You naturally stabilize through nourishment, duty, and care, so steady responsibility works better for you than emotional extremes.",
  },

  ashlesha: {
    style: "strategic",
    message:
      "You tend to read situations psychologically before deciding your next move, so subtle strategy suits you better than blunt force.",
  },

  magha: {
    style: "direct",
    message:
      "You instinctively step into leadership when situations require direction, so dignity and self-respect matter in every decision.",
  },

  "purva phalguni": {
    style: "supportive",
    message:
      "You respond best when life includes warmth, beauty, and emotional ease, so a little joy helps you function better than pressure alone.",
  },

  purvaphalguni: {
    style: "supportive",
    message:
      "You respond best when life includes warmth, beauty, and emotional ease, so a little joy helps you function better than pressure alone.",
  },

  "uttara phalguni": {
    style: "direct",
    message:
      "You do best when commitment is clear and mutual, so practical consistency matters more to you than empty charm.",
  },

  uttaraphalguni: {
    style: "direct",
    message:
      "You do best when commitment is clear and mutual, so practical consistency matters more to you than empty charm.",
  },

  hasta: {
    style: "analytical",
    message:
      "You feel stronger when you can shape things with skill and control, so practical hands-on progress suits you best.",
  },

  chitra: {
    style: "strategic",
    message:
      "You tend to seek both beauty and precision, so you do best when action is polished, intentional, and well-timed.",
  },

  swati: {
    style: "supportive",
    message:
      "Independence matters deeply to you, so decisions work best when they feel self-directed rather than pressured.",
  },

  vishakha: {
    style: "direct",
    message:
      "You are naturally goal-oriented once committed, so clear targets and disciplined focus help you more than mixed signals.",
  },

  anuradha: {
    style: "supportive",
    message:
      "You grow through loyalty, discipline, and meaningful bonds, so steady alignment matters more than dramatic intensity.",
  },

  jyeshtha: {
    style: "direct",
    message:
      "Responsibility often falls on you even when you did not ask for it, so you do best when your decisions preserve strength and authority.",
  },

  mula: {
    style: "strategic",
    message:
      "You often need to understand the root of a matter before moving ahead, so truth and deep reset help you more than surface fixes.",
  },

  "purva ashadha": {
    style: "direct",
    message:
      "You move strongly when conviction is clear, so confidence helps you most when it is backed by real substance.",
  },

  purvashadha: {
    style: "direct",
    message:
      "You move strongly when conviction is clear, so confidence helps you most when it is backed by real substance.",
  },

  "uttara ashadha": {
    style: "direct",
    message:
      "You do best when your effort serves something lasting, so disciplined consistency matters more than temporary excitement.",
  },

  uttarashadha: {
    style: "direct",
    message:
      "You do best when your effort serves something lasting, so disciplined consistency matters more than temporary excitement.",
  },

  shravana: {
    style: "analytical",
    message:
      "You absorb a lot through listening and observation, so clarity comes when you pause, notice patterns, and then act.",
  },

  dhanishta: {
    style: "direct",
    message:
      "You respond well to momentum and visible movement, so structured action helps more than waiting in uncertainty.",
  },

  shatabhisha: {
    style: "strategic",
    message:
      "You tend to process things privately and deeply, so space, detachment, and inner honesty help you make better decisions.",
  },

  "purva bhadrapada": {
    style: "strategic",
    message:
      "You can hold powerful inner intensity, so you do best when purpose is clear and extremes are handled consciously.",
  },

  purvabhadrapada: {
    style: "strategic",
    message:
      "You can hold powerful inner intensity, so you do best when purpose is clear and extremes are handled consciously.",
  },

  "uttara bhadrapada": {
    style: "calming",
    message:
      "You tend to carry depth quietly, so patience, emotional maturity, and grounded steadiness support you best.",
  },

  uttarabhadrapada: {
    style: "calming",
    message:
      "You tend to carry depth quietly, so patience, emotional maturity, and grounded steadiness support you best.",
  },

  revati: {
    style: "supportive",
    message:
      "You naturally sense emotional undercurrents and respond best to gentle clarity, kindness, and well-paced movement.",
  },
};