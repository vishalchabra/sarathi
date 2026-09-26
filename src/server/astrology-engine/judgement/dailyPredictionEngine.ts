import type {
  DailyPriority,
  DailyPriorityResult,
} from "./dailyPriorityEngine";

export type DailyPredictionTheme = {
  area: DailyPriority["area"];
  polarity: DailyPriority["polarity"];

  manifestationId: string | null;
  manifestationLabel: string | null;
  manifestationDescription: string | null;
  prediction: string;
action: string;
avoid: string;
  priorityScore: number;
  manifestationScore: number;

  role:
    | "primary"
    | "secondary";
};

export type DailyPersonalizedPrediction = {
      overallTone: string;
  primaryTheme:
    | DailyPredictionTheme
    | null;

  secondaryThemes:
    DailyPredictionTheme[];

  suppressedAreas:
    DailyPriority["area"][];
};
function buildManifestationPrediction(
  priority: DailyPriority
): string | null {
  const manifestation =
    priority.bestManifestation;

  if (!manifestation) {
    return null;
  }

  const supportive =
    priority.polarity === "supportive";

  const challenging =
    priority.polarity === "challenging";

  const mixed =
    priority.polarity === "mixed";

  switch (manifestation.id) {
    // CAREER
    case "career_movement":
      return supportive
        ? "Your professional situation shows constructive movement today. A conversation, development or opportunity may help move work matters forward."
        : challenging
          ? "Your professional situation is active today, but movement may come with pressure, resistance or a need to adjust your approach."
          : "Your professional situation shows signs of movement today, although progress may involve some adjustment before the direction becomes clearer.";

    case "career_responsibility":
      return supportive
        ? "Professional responsibilities are highlighted today, with an opportunity to demonstrate reliability, ownership or greater authority."
        : challenging
          ? "Professional responsibilities may feel heavier today, with increased expectations or demands requiring a measured response."
          : "Responsibilities and expectations at work are more prominent today, bringing both opportunity and additional demands.";

    case "career_recognition":
      return supportive
        ? "Your work or contribution may receive greater visibility or acknowledgement today, making this a constructive time to let your efforts be seen."
        : challenging
          ? "Your professional visibility is heightened today, but recognition may come with scrutiny or increased expectations."
          : "Your work may attract more attention today, although visibility could bring both acknowledgement and additional expectations.";

    case "career_change":
      return supportive
        ? "A change in your professional situation may begin to take shape today, potentially opening a different direction, role or way of working."
        : challenging
          ? "Professional change is more strongly activated today, but the process may feel unsettled or require adjustment before the direction becomes clear."
          : "Your professional situation may be entering a period of adjustment or change, with the final direction still developing.";

    case "workload_service":
      return supportive
        ? "Work activity is elevated today, but the conditions support productive handling of tasks, responsibilities and practical demands."
        : challenging
          ? "Workload and practical responsibilities may feel heavier today, making prioritisation especially important."
          : "There may be more work, tasks or practical responsibilities to manage today, requiring some adjustment in priorities.";

    // MIND / HEALTH
    case "mental_pressure":
      return "Mental pressure may be more noticeable today, with thoughts, responsibilities or emotions competing for attention. Give yourself time before reaching important conclusions.";

    case "emotional_stability":
      return supportive
        ? "Your emotional space has a more supportive tone today, making it easier to regain perspective, steadiness or inner balance."
        : mixed
          ? "Emotional balance is available today, although changing thoughts or circumstances may occasionally disturb your sense of steadiness."
          : "Your emotional state deserves some care today, particularly where outside pressure makes it harder to maintain perspective.";

    case "health_attention":
      return supportive
        ? "Health, routine and physical wellbeing are highlighted today in a constructive way, making this a useful time to pay closer attention to what supports your energy."
        : challenging
          ? "Your body, energy or routine may require greater attention today. Take physical signals seriously without assuming they point to anything more than the engine can establish."
          : "Health and routine deserve closer attention today, particularly changes in energy, pace or physical comfort.";

    // MONEY
    case "money_inflow":
  return supportive
    ? "Watch for developments involving incoming payments, reimbursements or other financial opportunities. Review the details before deciding how to use any additional funds."
    : challenging
      ? "An expected payment or financial opportunity may require follow-up. Check for delays, conditions or competing obligations before making plans around it."
      : "Keep an eye on pending payments and other incoming financial matters. The situation may develop gradually, so avoid assuming the outcome too early.";

    case "money_outflow":
      return supportive
        ? "Financial outflow is highlighted today, but spending or payments may serve a useful or necessary purpose when handled deliberately."
        : challenging
          ? "Expenses, payments or financial obligations may require more attention today, making it important to distinguish necessary outflow from avoidable spending."
          : "Money may move outward through expenses, payments or commitments today, so keeping the larger financial picture in view will be useful.";

    case "money_planning":
      return supportive
        ? "Financial planning is well supported today, making this a useful time to organise resources, review commitments or clarify upcoming priorities."
        : challenging
          ? "Financial decisions may require more careful planning today, particularly where pressure or competing commitments make the picture less straightforward."
          : "Money planning is highlighted today, although you may need to balance more than one financial priority before the best approach becomes clear.";

    case "money_accumulation":
      return supportive
        ? "The financial emphasis favours preservation and gradual strengthening of resources today, supporting savings or longer-term security."
        : challenging
          ? "Protecting financial resources may require greater discipline today, particularly where expenses or competing priorities challenge longer-term plans."
          : "Building or preserving resources is highlighted today, although short-term needs may need to be balanced against longer-term financial security.";

    case "money_settlement":
      return supportive
        ? "A pending financial matter may move toward resolution today, including dues, repayments, reimbursements or another outstanding obligation."
        : challenging
          ? "An unresolved financial matter may demand attention today, with settlement potentially requiring patience, follow-up or adjustment."
          : "Pending dues, repayments or another unresolved financial matter may become more active today, although complete resolution may still require some adjustment.";

    // SPIRITUALITY
    case "spiritual_practice":
      return supportive
        ? "You may feel more naturally drawn toward prayer, meditation, ritual or another spiritual practice today, with supportive conditions for deeper inner connection."
        : challenging
          ? "You may feel drawn toward spiritual practice today, although restlessness or outside demands could make it harder to settle inwardly."
          : "You may feel more naturally drawn toward prayer, meditation or another spiritual practice today, although other demands may compete for your attention.";

    case "spiritual_learning":
      return supportive
        ? "Spiritual or philosophical learning is well supported today, and an idea, teaching or subject may deepen your understanding."
        : challenging
          ? "Spiritual questions or learning may occupy more of your attention today, although clarity may require patience rather than immediate answers."
          : "A spiritual or philosophical subject may draw your interest today, with understanding developing gradually through reflection.";

    case "spiritual_guidance":
      return supportive
        ? "Useful spiritual or philosophical guidance may become more accessible today through a teacher, mentor, tradition or meaningful conversation."
        : challenging
          ? "You may seek guidance today, but it will be important to distinguish useful insight from advice that does not genuinely fit your circumstances."
          : "Guidance from a teacher, mentor, tradition or trusted source may be relevant today, although reflection is still needed before applying it.";

    case "spiritual_introspection":
      return "Your attention may turn inward today, encouraging deeper reflection on your emotions, beliefs or the meaning behind recent experiences.";

    case "spiritual_detachment":
      return supportive
        ? "You may find it easier to step back from something that has consumed unnecessary energy, creating more inner space and perspective."
        : challenging
          ? "A sense of withdrawal or detachment may be stronger today. Give yourself space without making permanent decisions from a temporary feeling of disconnection."
          : "You may feel a greater need for distance, quiet or detachment today, helping you reconsider where your energy genuinely belongs.";

    // RELATIONSHIPS
    case "relationship_attention":
      return supportive
        ? "An important relationship may draw more of your attention today, with supportive conditions for understanding what the connection currently needs."
        : challenging
          ? "An important relationship may require more attention today, particularly where expectations or responses are creating pressure."
          : "A one-to-one relationship is more active today, and the interaction may reveal something worth paying closer attention to.";

    case "relationship_harmony":
      return supportive
        ? "Relationships carry a warmer and more cooperative tone today, supporting understanding, connection or mutual support."
        : challenging
          ? "There is potential for greater harmony in an important relationship today, although existing tension may need to be handled first."
          : "A relationship may move toward greater understanding today, although cooperation may require some adjustment from both sides.";

    case "relationship_discussion":
      return supportive
        ? "An important relationship conversation may develop constructively today, helping clarify feelings, expectations or a shared issue."
        : challenging
          ? "A significant conversation may arise in a relationship today, but sensitivity or disagreement could make careful communication important."
          : "A relationship may require an important conversation today, with the outcome depending partly on how clearly both sides communicate.";

    case "relationship_tension":
      return "Some tension or sensitivity may surface in an important relationship today. The situation is more likely to benefit from patience than from immediate reaction.";

    case "relationship_commitment":
      return supportive
        ? "Questions of commitment, expectations or shared intentions may move in a constructive direction within an important relationship today."
        : challenging
          ? "Commitment or expectations within a relationship may require closer examination today, particularly where the two sides are not yet aligned."
          : "Commitment, expectations or the future direction of an important relationship may become more relevant today, although complete clarity may still take time.";

    // CHILDREN
    case "children_attention":
      return "Matters involving children may require more of your attention today, with the specific need becoming clearer through observation and interaction.";

    case "children_progress":
      return supportive
        ? "There may be encouraging movement around a child-related matter today, including progress, learning or a positive development."
        : "A child-related matter may show signs of progress today, although continued attention or support may still be needed.";

    case "children_responsibility":
      return "Responsibilities involving children may be more prominent today, requiring practical involvement, guidance or support.";

    case "children_concern":
      return "A matter involving children may create some concern or require closer attention today. Focus on what is actually happening rather than assuming a larger problem.";

    case "children_milestone":
      return supportive
        ? "A meaningful development involving a child may become more noticeable today, highlighting progress, achievement or an important stage."
        : "A meaningful child-related development may be taking shape today, although its significance may become clearer with time.";

    // HOME
    case "home_change":
      return supportive
        ? "A practical change or adjustment within the home environment may move forward constructively today."
        : challenging
          ? "A domestic change or adjustment may require attention today, with some disruption or resistance possible before matters settle."
          : "A change or adjustment around home may become more relevant today, although the practical direction may still need refinement.";

    case "home_attention":
      return "A domestic matter may require more focused attention today, particularly something practical within your immediate living environment.";

    case "home_stability":
      return supportive
        ? "The home environment carries a more settled tone today, supporting comfort, organisation and greater domestic stability."
        : "Domestic stability is highlighted today, although maintaining it may require some practical adjustment.";

    // FAMILY
    case "family_responsibility":
      return "A family responsibility may require more of your involvement today, particularly where others are relying on you for a practical response.";

    case "family_support":
      return supportive
        ? "Family interactions carry greater potential for cooperation or support today, making it easier to help one another constructively."
        : "Support within the family may be available today, although expectations and responsibilities may need to be balanced carefully.";

    case "family_discussion":
      return supportive
        ? "An important family conversation may help clarify a practical issue or improve mutual understanding today."
        : challenging
          ? "A family discussion may require care today, particularly if emotions or differing expectations make the issue sensitive."
          : "A family matter may need discussion today, with clarity depending on how calmly the practical issue is addressed.";

    case "family_tension":
      return "Family dynamics may carry more tension today. Avoid allowing a temporary disagreement to pull older or unrelated issues into the situation.";

    // TRAVEL
    case "travel_planning":
      return supportive
        ? "Travel planning is well supported today, making it useful for organising arrangements, timings or practical logistics."
        : "Travel arrangements may require closer planning today, particularly where timings or practical details need adjustment.";

    case "travel_movement":
      return supportive
        ? "Travel or movement is more active today, with generally supportive conditions for getting where you need to go."
        : challenging
          ? "Travel or movement may require extra patience today, particularly around timing, pace or practical arrangements."
          : "Travel or movement is highlighted today, although some flexibility around timing or arrangements may be useful.";

    case "travel_disruption":
      return "Travel plans may be more vulnerable to changes, delays or practical complications today, so flexibility will be useful.";

    // EDUCATION
    case "education_focus":
      return supportive
        ? "Your ability to focus on study or learning is supported today, making this a useful time to give sustained attention to an important subject."
        : challenging
          ? "Study or learning may require greater concentration today, particularly where distractions or difficulty make progress slower."
          : "Education and learning require greater focus today, with progress depending on how well you manage competing priorities.";

    case "education_progress":
      return supportive
        ? "Learning or an educational matter may move forward constructively today, supporting greater understanding or measurable progress."
        : "There may be progress in study or learning today, although continued effort may still be needed before the result feels secure.";

    case "education_challenge":
      return "A study or learning matter may feel more demanding today, requiring patience with material, expectations or a task that takes longer than expected.";

    // COMMUNICATION
    case "communication_activity":
      return "Communication activity is elevated today, with more conversations, messages or information exchanges likely to require your attention.";

    case "communication_clarity":
      return supportive
        ? "Communication is well supported today, making it easier to explain an important point or reach clearer mutual understanding."
        : "There is potential for greater clarity in communication today, although important details may still need to be confirmed.";

    case "communication_friction":
      return "Communication may be more sensitive today, with greater potential for misunderstanding, sharp responses or disagreement if messages are rushed.";

    // PUBLIC IMAGE
    case "public_image_visibility":
      return supportive
        ? "Your visibility is heightened today, creating constructive opportunities for your actions, work or presence to be noticed."
        : challenging
          ? "You may be more visible to others today, making it important to handle scrutiny or attention thoughtfully."
          : "Your visibility is elevated today, bringing greater attention to how your actions or communication are perceived.";

    case "public_image_recognition":
      return supportive
        ? "Recognition or positive attention may be more available today, particularly around a contribution, achievement or visible effort."
        : "Your contribution may attract more recognition today, although increased attention could also bring additional expectations.";

    case "public_image_pressure":
      return "Visibility may come with greater pressure or scrutiny today, making measured responses more useful than reacting to how others perceive you.";

    // HIDDEN MATTERS
    case "hidden_matters_revelation":
      return supportive
        ? "Something previously unclear may become easier to understand today as useful information, insight or context comes into view."
        : "Information beneath the surface may begin to emerge today, although it is worth allowing the full picture to develop before drawing conclusions.";

    case "hidden_matters_introspection":
      return "Your attention may turn toward a deeper or less visible issue today, encouraging private reflection before deciding what the situation means.";

    case "hidden_matters_complication":
      return "A matter may prove more complicated beneath the surface than it first appears today, making careful observation more useful than a quick conclusion.";

    // PROPERTY
    case "property_attention":
      return "A property, housing or asset-related matter may require practical attention today, particularly around details that need to be reviewed or handled.";

    case "property_progress":
      return supportive
        ? "A property or housing matter may show constructive movement today, supporting a practical step forward."
        : "There may be progress around a property or housing matter today, although some details may still need to be resolved.";

    case "property_complication":
      return "A property or housing matter may involve delays, obligations or practical complications today, making careful review especially important.";

    default:
      return null;
  }
}
function buildThemePrediction(
  priority: DailyPriority
): string {
  const manifestation =
    priority.bestManifestation;
const addPolarityContext = (
  basePrediction: string
): string => {
  if (priority.polarity === "supportive") {
    return `${basePrediction} Conditions are generally supportive, so steady progress is possible.`;
  }

  if (priority.polarity === "challenging") {
    return `${basePrediction} Some pressure is present, so patience and a measured response will matter.`;
  }

  if (priority.polarity === "mixed") {
    return `${basePrediction} The picture is mixed, so progress may come with some adjustment.`;
  }

  return basePrediction;
};

if (!manifestation) {
  const [first, second] = priority.candidateEvents;

  if (
    first &&
    second &&
    first.manifestationScore - second.manifestationScore < 5
  ) {
    const eventLabels =
      `${first.label.toLowerCase()} or ${second.label.toLowerCase()}`;

    return addPolarityContext(
      `Developments involving ${eventLabels} may come into focus today. ` +
      `The available indications do not clearly distinguish between them, ` +
      `so pay attention to what actually develops before drawing conclusions.`
    );
  }

  switch (priority.area) {
    case "mind":
      return addPolarityContext(
        "Your mental and emotional space is more active today. Different thoughts or feelings may compete for attention, so allow yourself time to process them before deciding what deserves your energy."
      );

    case "children":
      return addPolarityContext(
        "Matters involving children may draw more of your attention today. The exact reason may become clearer as the day develops, so stay observant rather than assuming what needs to happen."
      );

    case "relationships":
      return addPolarityContext(
        "One-to-one relationships are more active today. Something in an important interaction may deserve attention, although the direction of the situation may become clearer through conversation and response."
      );

    case "career":
      return addPolarityContext(
        "Work and professional responsibilities are strongly activated today. Something may require your attention, initiative or practical response, even if the exact direction is not immediately clear."
      );

    case "money":
      return addPolarityContext(
        "Money and resources deserve closer attention today. There may be more than one financial consideration in play, making it useful to understand the practical picture before deciding what matters most."
      );

    case "health":
      return addPolarityContext(
        "Your wellbeing and daily routine deserve greater awareness today. Notice how your energy and body respond to your usual pace rather than pushing through changes without acknowledging them."
      );

    case "family":
      return addPolarityContext(
        "Family matters may require more of your involvement today. The situation may call for attention, support or a practical response, so deal with what actually emerges rather than anticipating problems."
      );

    case "home":
      return addPolarityContext(
        "Home and domestic matters are more active today. There may be something practical to organise, adjust or give attention to, but allow the immediate priority to become clear before making unnecessary changes."
      );

    case "travel":
      return addPolarityContext(
        "Travel, movement or matters connected with distance may need more attention today. Keep practical arrangements in view and leave enough flexibility for the situation to develop."
      );

    case "spirituality":
      return addPolarityContext(
        "Your reflective and spiritual side is more active today. You may benefit from creating some quiet space to reconnect inwardly without feeling that you need to arrive at an immediate answer."
      );

    case "education":
      return addPolarityContext(
        "Learning, study or an educational matter is more active today. Give attention to what genuinely needs progress rather than trying to cover too many priorities at once."
      );

    case "publicImage":
      return addPolarityContext(
        "Visibility and how others perceive you are more active themes today. Be conscious of how you present yourself, while avoiding the need to manage every impression around you."
      );

    case "hiddenMatters":
      return addPolarityContext(
        "Something beneath the surface may deserve closer observation today. More than one interpretation may be possible, so allow information and understanding to develop before drawing conclusions."
      );

    case "communication":
      return addPolarityContext(
        "Conversations, messages and information exchange are more active today. Pay attention not only to what is being said, but also to whether intentions and expectations are being understood clearly."
      );

    case "property":
      return addPolarityContext(
        "Property, housing or asset-related matters may require some practical attention today. Focus first on understanding what actually needs to be handled before making a larger decision."
      );

    default:
      return addPolarityContext(
        `${priority.area} is more active today. Give the area some additional attention while allowing the most relevant development to become clearer.`
      );
  }
}

const manifestationPrediction =
  buildManifestationPrediction(priority);

if (manifestationPrediction) {
  return manifestationPrediction;
}

if (manifestation.confidence === "high") {
  return manifestation.description;
}

if (manifestation.confidence === "moderate") {
  return `There may be developments connected with ${manifestation.label.toLowerCase()} today. ${manifestation.description}`;
}

return `${manifestation.label} is a possible background theme today, although the evidence is not strong enough to make it a central prediction.`;
}
function buildThemeAction(
  priority: DailyPriority
): string {
  switch (
    priority.bestManifestation?.id
  ) {
    case "career_change":
  return "Stay open to developments that could change your role, responsibilities or professional direction.";

    case "career_responsibility":
      return "Take ownership of important responsibilities and show reliability where expectations are increasing.";

    case "career_recognition":
      return "Make your contribution visible and communicate your work clearly.";

    case "career_movement":
      return "Pay attention to conversations or developments that could move your professional situation forward.";

    case "workload_service":
      return "Prioritise pending work and handle practical responsibilities methodically.";

    case "mental_pressure":
      return "Slow the pace of important decisions and give yourself space to process before reacting.";

    case "emotional_stability":
      return "Choose activities and conversations that help you regain emotional steadiness.";

    case "health_attention":
      return "Pay closer attention to routine, rest and physical signals today.";
          case "money_inflow":
  return "Follow up on pending payments and review new financial opportunities.";

    case "money_outflow":
      return "Prioritise necessary payments and keep discretionary spending controlled.";

    case "money_planning":
      return "Review your finances, upcoming commitments and priorities before making new decisions.";

    case "money_accumulation":
      return "Focus on preserving resources and strengthening savings or longer-term financial security.";

    case "money_settlement":
      return "Use the day to address pending dues, repayments, reimbursements or unresolved financial matters.";
        case "spiritual_practice":
      return "Make deliberate space for prayer, meditation, ritual or another practice that helps you feel centred.";

    case "spiritual_learning":
      return "Use the day to study, reflect on or explore a spiritual or philosophical subject that draws your attention.";

    case "spiritual_guidance":
      return "Stay receptive to useful guidance from a teacher, mentor, tradition or trusted source of wisdom.";

    case "spiritual_introspection":
      return "Give yourself some quiet space to reflect on what is happening internally before seeking answers outside.";

    case "spiritual_detachment":
      return "Notice what you may be ready to release and allow some distance from matters that no longer need your energy.";
  case "relationship_attention":
  return "Give the important relationship your attention and stay receptive to what the interaction is showing you.";

case "relationship_harmony":
  return "Use the supportive tone to strengthen understanding, cooperation or connection in an important relationship.";

case "relationship_discussion":
  return "Have the important conversation clearly and listen carefully before deciding how to respond.";

case "relationship_tension":
  return "Handle differences calmly and give the situation space before reacting emotionally.";

case "relationship_commitment":
  return "Use the day to clarify expectations, shared intentions or the level of commitment within the relationship.";
case "home_change":
  return "Focus on the practical adjustment needed at home and handle the change one step at a time.";

case "home_attention":
  return "Give the domestic matter requiring attention some focused time and deal with the most practical priority first.";

case "home_stability":
  return "Use the supportive conditions to improve comfort, organisation or stability in your living environment.";

case "family_responsibility":
  return "Handle the family responsibility practically while being clear about what genuinely requires your involvement.";

case "family_support":
  return "Stay open to cooperation and support within the family, and contribute where your involvement can be useful.";

case "family_discussion":
  return "Have the important family conversation calmly and make sure everyone understands the practical issue clearly.";

case "family_tension":
  return "Give emotionally charged family matters some space and respond only after understanding the underlying concern.";
case "travel_planning":
  return "Use the day to organise travel details, confirm arrangements and resolve practical logistics.";

case "travel_movement":
  return "Keep your schedule organised and allow enough time for travel or movement during the day.";

case "travel_disruption":
  return "Build flexibility into travel plans and double-check timings, routes and important arrangements.";

case "education_focus":
  return "Give focused time to study, learning or the educational matter that requires your attention.";

case "education_progress":
  return "Use the constructive momentum to deepen your understanding or move an important learning goal forward.";

case "education_challenge":
  return "Work through the difficult part patiently and break the learning task into manageable steps.";

case "communication_activity":
  return "Use the increased communication activity to clear pending messages, conversations or information exchanges.";

case "communication_clarity":
  return "Use the opportunity to communicate an important point clearly and confirm mutual understanding.";

case "communication_friction":
  return "Choose your words carefully and clarify misunderstandings before responding to disagreement.";
case "public_image_visibility":
  return "Use the increased visibility thoughtfully and make sure your actions reflect how you want to be perceived.";

case "public_image_recognition":
  return "Make good use of positive attention by presenting your contribution clearly and professionally.";

case "public_image_pressure":
  return "Be deliberate about visible decisions and focus on what you can control rather than reacting to scrutiny.";

case "hidden_matters_revelation":
  return "Pay attention to information or insight that helps you understand something that was previously unclear.";

case "hidden_matters_introspection":
  return "Give yourself some private space to examine the deeper issue before deciding what it means or what to do next.";

case "hidden_matters_complication":
  return "Look carefully at the underlying details before acting on a matter that may be more complicated than it first appears.";

case "property_attention":
  return "Give the property or housing matter practical attention and identify what actually needs to be handled today.";

case "property_progress":
  return "Use the constructive momentum to move the property or housing matter one practical step forward.";

case "property_complication":
  return "Review the practical details carefully and allow extra time for delays or obligations connected with the property matter.";
}

  switch (priority.area) {
  case "mind":
    return "Create some mental space before making important decisions or responding emotionally.";

  case "children":
    return "Stay available and attentive to matters involving children without assuming what they may need.";

  case "relationships":
    return "Give important conversations your full attention and listen before deciding how to respond.";

  case "career":
    return "Focus on the professional matter that currently requires the clearest practical response.";

  case "money":
    return "Review financial decisions carefully and keep your priorities clear.";

  case "health":
    return "Pay closer attention to your routine, energy and physical signals.";

  case "family":
    return "Give necessary family matters your attention while keeping reasonable boundaries.";

  case "home":
    return "Handle the most relevant domestic or practical matter calmly and methodically.";

  case "travel":
    return "Keep plans organised and allow enough flexibility for changes in timing or movement.";

  case "spirituality":
    return "Make some space for reflection, prayer, meditation or whatever helps you reconnect inwardly.";

  case "education":
    return "Give focused time to learning, study or an important educational matter.";

  case "publicImage":
    return "Be deliberate about how you communicate and present yourself to others.";

  case "hiddenMatters":
    return "Observe carefully and allow more information to emerge before reaching conclusions.";

  case "communication":
    return "Communicate clearly and check that important messages are understood as intended.";

  case "property":
    return "Review practical details carefully before making decisions involving property or assets.";

  default:
    return "Use the active area consciously and focus on practical progress.";

}
}

function buildThemeAvoid(
  priority: DailyPriority
): string {
  switch (
    priority.bestManifestation?.id
  ) {
    case "career_change":
      return "Avoid resisting useful change simply because the direction feels unfamiliar.";

    case "career_responsibility":
      return "Avoid reacting defensively to increased expectations or responsibility.";

    case "career_recognition":
      return "Avoid staying invisible when your contribution needs to be communicated.";

    case "career_movement":
      return "Avoid dismissing professional conversations before understanding where they may lead.";

    case "workload_service":
      return "Avoid scattering your effort across too many tasks at once.";

    case "mental_pressure":
      return "Avoid allowing temporary emotional pressure to drive important decisions.";

    case "emotional_stability":
      return "Avoid feeding unnecessary worry or repeatedly revisiting matters that need time to settle.";

    case "health_attention":
      return "Avoid ignoring fatigue, routine or physical signals.";
        case "money_inflow":
  return "Don't count on money before it arrives.";

    case "money_outflow":
      return "Avoid unnecessary purchases or allowing short-term expenses to disrupt larger financial priorities.";

    case "money_planning":
      return "Avoid making financial decisions without reviewing the numbers and existing commitments.";

    case "money_accumulation":
      return "Avoid weakening longer-term financial security for an unnecessary short-term expense.";

    case "money_settlement":
      return "Avoid postponing financial obligations or leaving important payment matters unresolved.";
        case "spiritual_practice":
      return "Avoid turning spiritual practice into another obligation; consistency matters more than intensity today.";

    case "spiritual_learning":
      return "Avoid consuming too many ideas at once without taking time to reflect on what is genuinely useful.";

    case "spiritual_guidance":
      return "Avoid accepting advice automatically; reflect on whether the guidance genuinely fits your circumstances.";

    case "spiritual_introspection":
      return "Avoid allowing useful reflection to become excessive withdrawal or repetitive overthinking.";

    case "spiritual_detachment":
      return "Avoid making abrupt decisions simply because you temporarily feel disconnected or withdrawn.";
  case "relationship_attention":
  return "Avoid making assumptions about the other person's intentions before the situation becomes clearer.";

case "relationship_harmony":
  return "Avoid taking cooperation or emotional support for granted.";

case "relationship_discussion":
  return "Avoid entering an important conversation determined to prove your position rather than understand the other person.";

case "relationship_tension":
  return "Avoid escalating temporary friction through impulsive words, accusations or unnecessary confrontation.";

case "relationship_commitment":
  return "Avoid making promises or commitments before expectations are genuinely understood by both sides.";
case "home_change":
  return "Avoid making unnecessary domestic changes before the practical implications are clear.";

case "home_attention":
  return "Avoid allowing minor household issues to consume more time or energy than they require.";

case "home_stability":
  return "Avoid disturbing a workable domestic situation without a clear reason for change.";

case "family_responsibility":
  return "Avoid taking responsibility for every family issue when some matters belong to others.";

case "family_support":
  return "Avoid assuming support will happen automatically; communicate clearly about what is needed.";

case "family_discussion":
  return "Avoid allowing an important family conversation to become personal, defensive or unnecessarily confrontational.";

case "family_tension":
  return "Avoid escalating family friction through impulsive words, blame or old unresolved issues.";
case "travel_planning":
  return "Avoid leaving important travel arrangements or confirmations until the last moment.";

case "travel_movement":
  return "Avoid unnecessary rushing or creating an overly tight travel schedule.";

case "travel_disruption":
  return "Avoid assuming plans will run exactly as expected without checking practical details.";

case "education_focus":
  return "Avoid scattering your attention across too many learning priorities at once.";

case "education_progress":
  return "Avoid becoming complacent because progress feels easier than usual.";

case "education_challenge":
  return "Avoid frustration or abandoning the task simply because progress requires more effort.";

case "communication_activity":
  return "Avoid responding to every message immediately when some conversations require more thought.";

case "communication_clarity":
  return "Avoid assuming others have understood your intention without confirming the important details.";

case "communication_friction":
  return "Avoid impulsive messages, sharp language or continuing an argument before the facts are clear.";
case "public_image_visibility":
  return "Avoid acting only for attention or becoming overly concerned with how every action is perceived.";

case "public_image_recognition":
  return "Avoid overplaying recognition or allowing positive feedback to create unnecessary expectations.";

case "public_image_pressure":
  return "Avoid impulsive reactions to criticism, scrutiny or concerns about how others may perceive you.";

case "hidden_matters_revelation":
  return "Avoid jumping to conclusions before the information or situation becomes sufficiently clear.";

case "hidden_matters_introspection":
  return "Avoid becoming trapped in excessive analysis or withdrawing more than the situation requires.";

case "hidden_matters_complication":
  return "Avoid ignoring uncomfortable details or acting before you understand what is happening beneath the surface.";

case "property_attention":
  return "Avoid making a property-related decision before checking the relevant practical details.";

case "property_progress":
  return "Avoid treating constructive movement as confirmation that every part of the matter is already settled.";

case "property_complication":
  return "Avoid rushing a property decision simply to overcome a delay or complication.";
}

  switch (priority.area) {
  case "mind":
    return "Avoid letting temporary thoughts or emotions dictate an important decision.";

  case "children":
    return "Avoid reacting too quickly before understanding what actually requires your attention.";

  case "relationships":
    return "Avoid assumptions or unnecessary escalation in important interactions.";

  case "career":
    return "Avoid making professional decisions purely from temporary pressure or frustration.";

  case "money":
    return "Avoid unnecessary financial commitments until the practical details are clear.";

  case "health":
    return "Avoid ignoring changes in energy, routine or physical wellbeing.";

  case "family":
    return "Avoid absorbing every family concern as your personal responsibility.";

  case "home":
    return "Avoid forcing domestic decisions before the practical situation is clear.";

  case "travel":
    return "Avoid relying on rushed plans or leaving important arrangements until the last moment.";

  case "spirituality":
    return "Avoid forcing answers when reflection and patience may be more useful.";

  case "education":
    return "Avoid scattering your attention across too many subjects or priorities.";

  case "publicImage":
    return "Avoid impulsive communication that could create the wrong impression.";

  case "hiddenMatters":
    return "Avoid acting on suspicion or incomplete information.";

  case "communication":
    return "Avoid rushed messages, assumptions or responding before you understand the full context.";

  case "property":
    return "Avoid committing to property or asset decisions before reviewing the practical details.";

  default:
    return "Avoid unnecessary reactions or rushed decisions.";
}
}
function priorityToPredictionTheme(
  priority: DailyPriority
): DailyPredictionTheme {
  const manifestationDescription =
    priority.bestManifestation?.description ??
    null;

  const prediction =
    buildThemePrediction(priority);

  const theme: DailyPredictionTheme = {
    area: priority.area,
    polarity: priority.polarity,

    manifestationId:
      priority.bestManifestation?.id ??
      null,

    manifestationLabel:
      priority.bestManifestation?.label ??
      null,

    manifestationDescription,

    prediction,

    action:
      buildThemeAction(priority),

    avoid:
      buildThemeAvoid(priority),

    priorityScore:
      priority.dailyPriorityScore,

    manifestationScore:
      priority.manifestationScore,

    role:
      priority.role === "primary"
        ? "primary"
        : "secondary",
  };


  return theme;
}

function buildOverallTone(
  priorities: DailyPriorityResult
): string {
  const primary = priorities.primary;

  if (!primary) {
    return "Today is a good day to stay flexible and focus on what needs your attention.";
  }

  const secondary = priorities.secondary[0];

  const primaryLabel =
    primary.bestManifestation?.label.toLowerCase() ??
    primary.area.replace(/([A-Z])/g, " $1").toLowerCase();

  const secondaryLabel =
    secondary?.bestManifestation?.label.toLowerCase() ??
    secondary?.area.replace(/([A-Z])/g, " $1").toLowerCase();

  const focus = capitalizeFirstLetter(primaryLabel);

  if (!secondary) {
    if (primary.polarity === "supportive") {
      return `${focus} takes centre stage today, with room for constructive progress.`;
    }

    if (primary.polarity === "challenging") {
      return `${focus} needs a little extra care today. A measured approach will help you navigate any pressure.`;
    }

    return `${focus} is your main focus today. Stay attentive and allow the situation to develop.`;
  }

  if (primary.polarity === "supportive") {
    return `${focus} takes centre stage today, while ${secondaryLabel} may also deserve your attention.`;
  }

  if (primary.polarity === "challenging") {
    return `${focus} may require extra care today. Keep ${secondaryLabel} in view as you plan your day.`;
  }

  return `${focus} is your main focus today, with ${secondaryLabel} also playing a part.`;
}

function capitalizeFirstLetter(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
export function buildDailyPrediction(
  priorities: DailyPriorityResult
): DailyPersonalizedPrediction {
  const primaryTheme =
    priorities.primary
      ? priorityToPredictionTheme(
          priorities.primary
        )
      : null;

  const secondaryThemes =
    priorities.secondary.map(
      priorityToPredictionTheme
    );

  const suppressedAreas =
    priorities.background.map(
      (priority) => priority.area
    );

 return {
  overallTone:
    buildOverallTone(priorities),

  primaryTheme,
  secondaryThemes,
  suppressedAreas,
};
}