
export type NarrativePolarity =
  | "supportive"
  | "challenging"
  | "mixed"
  | "neutral";

export type DailyNarrativeVariant = {
  prediction: string;
  action: string;
  avoid: string;
  summary?: string;
  // Optional. Used only when relevant pada evidence exists.
  nakshatra?: string;
  pada?: 1 | 2 | 3 | 4;
};

type NarrativeLibrary = Record<
  string,
  Partial<
    Record<NarrativePolarity, DailyNarrativeVariant[]>
  >
>;

export const DAILY_NARRATIVE_VARIANTS: NarrativeLibrary = {

  relationship_commitment: {
    supportive: [
      {
        summary:
          "Shared intentions within an important relationship may become clearer today.",
        prediction:
          "An important relationship may offer an opportunity to discuss commitment, expectations or future plans constructively. Greater mutual understanding could help clarify the direction of the connection.",
        action:
          "Discuss an important shared expectation or future priority with openness.",
        avoid:
          "Avoid assuming that a positive conversation means every practical detail has been agreed.",
      },
      {
        summary:
          "A constructive approach to commitment may strengthen understanding in an important relationship.",
        prediction:
          "Questions about the future direction of an important relationship may develop positively today. There may be room to establish greater clarity about shared intentions or responsibilities.",
        action:
          "Identify an expectation or commitment that would benefit from a clear discussion.",
        avoid:
          "Don't make promises before considering what you can realistically maintain.",
      },
      {
        summary:
          "An important relationship may benefit from greater clarity about shared expectations.",
        prediction:
          "Commitment or longer-term intentions may become more relevant in an existing relationship today. Supportive conditions could help both sides explore what they want from the connection.",
        action:
          "Make time to understand each other's priorities and discuss a practical next step.",
        avoid:
          "Avoid rushing a decision simply because the conversation feels encouraging.",
      },
    ],

    challenging: [
      {
        summary:
          "Commitment and expectations within an important relationship may require closer examination today.",
        prediction:
          "Questions about commitment or the future direction of a relationship may feel more demanding today. Differences in expectations could require careful discussion before either person makes a decision.",
        action:
          "Clarify the expectations that are creating uncertainty or pressure.",
        avoid:
          "Avoid making commitments merely to end an uncomfortable conversation.",
      },
      {
        summary:
          "Differences in shared intentions may require patience and clear communication.",
        prediction:
          "An important relationship may bring questions about responsibilities, commitment or future plans into focus. Both sides may need more time to understand where their expectations differ.",
        action:
          "Discuss the specific expectations that need clarification without demanding an immediate answer.",
        avoid:
          "Don't interpret uncertainty as proof of the other person's intentions.",
      },
      {
        summary:
          "A relationship commitment may need realistic expectations and thoughtful consideration.",
        prediction:
          "An existing commitment or proposed future arrangement may require closer attention today. Practical concerns or differing priorities could make an immediate agreement difficult.",
        action:
          "Review the responsibilities involved and identify which questions remain unresolved.",
        avoid:
          "Avoid promising more than you can realistically deliver.",
      },
    ],

    mixed: [
      {
        summary:
          "An important relationship may move toward greater clarity while some expectations remain unresolved.",
        prediction:
          "Commitment or shared intentions may become more relevant today. There may be constructive opportunities to discuss the future, although practical questions could still require attention.",
        action:
          "Explore shared priorities while identifying the details that need further discussion.",
        avoid:
          "Avoid treating an encouraging conversation as a final agreement.",
      },
      {
        summary:
          "Questions about commitment may bring constructive discussion alongside a need for adjustment.",
        prediction:
          "An important relationship may offer an opportunity to clarify longer-term expectations today. Differences in timing, priorities or responsibilities could influence the next steps.",
        action:
          "Discuss what each person is ready to commit to and where more clarity is needed.",
        avoid:
          "Don't overlook important differences simply because there is agreement on the broader direction.",
      },
      {
        summary:
          "Balancing shared intentions with practical expectations may be important today.",
        prediction:
          "The future direction of an important relationship may come into focus. There may be room for progress, although both sides could need additional time to align their expectations.",
        action:
          "Identify one shared priority and agree on a realistic next step.",
        avoid:
          "Avoid pressuring yourself or the other person to settle every question immediately.",
      },
    ],
  },
  relationship_tension: {
    supportive: [
      {
        summary:
          "A sensitive relationship matter may offer an opportunity to improve understanding today.",
        prediction:
          "Some tension may surface in an important relationship today, but there may be room to address the concern constructively. A patient exchange could help both sides understand what needs attention.",
        action:
          "Address the immediate concern calmly and listen to the other person's perspective.",
        avoid:
          "Avoid assuming that a constructive conversation requires immediate agreement.",
      },
      {
        summary:
          "Thoughtful handling of relationship tension may help restore cooperation.",
        prediction:
          "An important interaction may involve some sensitivity today. A willingness to acknowledge different perspectives could help prevent the concern from becoming a larger disagreement.",
        action:
          "Identify the specific issue and look for a practical area of agreement.",
        avoid:
          "Don't dismiss a concern simply because the overall interaction seems manageable.",
      },
      {
        summary:
          "Patience may help turn a sensitive interaction into an opportunity for greater clarity.",
        prediction:
          "An existing relationship concern may become more noticeable today. Supportive conditions could make it easier to discuss the issue without allowing temporary frustration to dominate the interaction.",
        action:
          "Choose an appropriate moment to discuss the concern and remain open to clarification.",
        avoid:
          "Avoid bringing unrelated past disagreements into the conversation.",
      },
    ],

    challenging: [
      {
        summary:
          "Relationship tension may require additional patience and emotional restraint today.",
        prediction:
          "An important relationship may feel more sensitive today. Differences in expectations or reactions could increase friction, particularly if an existing concern remains unresolved.",
        action:
          "Give yourself time to understand the concern before responding.",
        avoid:
          "Avoid reacting impulsively or escalating a disagreement over an immediate frustration.",
      },
      {
        summary:
          "An existing relationship concern may become more demanding today.",
        prediction:
          "Tension within an important connection may require closer attention. Communication could become difficult if either person feels misunderstood or pressured.",
        action:
          "Focus on the immediate issue and clarify what each person is trying to communicate.",
        avoid:
          "Don't insist on resolving the disagreement while emotions are running high.",
      },
      {
        summary:
          "A sensitive interaction may benefit from clear boundaries and a measured response.",
        prediction:
          "An important relationship may involve disagreement or heightened sensitivity today. Trying to force an immediate resolution could make the interaction more difficult.",
        action:
          "Maintain a calm approach and establish when the issue can be discussed constructively.",
        avoid:
          "Avoid making threats, ultimatums or commitments in the heat of the moment.",
      },
    ],

    mixed: [
      {
        summary:
          "A sensitive relationship matter may bring both friction and an opportunity for understanding.",
        prediction:
          "Some tension may arise within an important relationship today. Although the interaction could feel uncomfortable, it may also reveal an expectation or concern that needs clarification.",
        action:
          "Acknowledge the disagreement and look for one issue both sides can address.",
        avoid:
          "Avoid assuming that identifying the problem means it has already been resolved.",
      },
      {
        summary:
          "Managing relationship tension may require balancing openness with patience.",
        prediction:
          "An important connection may feel more sensitive today. There may be an opportunity to improve understanding, although differences in perspective could require further discussion.",
        action:
          "Express your concern clearly while allowing the other person space to respond.",
        avoid:
          "Don't overlook your own needs merely to bring an uncomfortable conversation to an end.",
      },
      {
        summary:
          "A measured response may help prevent temporary relationship tension from becoming a larger issue.",
        prediction:
          "An interaction with someone important may involve both cooperation and moments of friction today. How the concern is addressed could influence whether the conversation becomes more constructive.",
        action:
          "Separate the immediate disagreement from the broader relationship and focus on a practical next step.",
        avoid:
          "Avoid interpreting one difficult interaction as a judgement on the entire relationship.",
      },
    ],
  },
  relationship_discussion: {
    supportive: [
      {
        summary:
          "An important conversation may bring greater clarity to a relationship today.",
        prediction:
          "A meaningful discussion with someone important may develop constructively today. Supportive conditions could help both sides express their views and understand each other's expectations.",
        action:
          "Make time for a conversation that could improve mutual understanding.",
        avoid:
          "Avoid assuming you already know what the other person wants to say.",
      },
      {
        summary:
          "Open communication may help strengthen understanding in an important relationship.",
        prediction:
          "An important relationship conversation may offer an opportunity to clarify feelings, expectations or a shared concern. A thoughtful exchange could help establish common ground.",
        action:
          "Express your perspective clearly and invite the other person to share theirs.",
        avoid:
          "Don't rush toward a conclusion before both perspectives have been heard.",
      },
      {
        summary:
          "A constructive discussion may help an important relationship move forward.",
        prediction:
          "Communication within an important relationship may be more productive today. A conversation that requires attention could benefit from openness and a willingness to listen.",
        action:
          "Address a relevant topic directly while remaining receptive to another perspective.",
        avoid:
          "Avoid turning a useful conversation into a debate about who is right.",
      },
    ],

    challenging: [
      {
        summary:
          "An important relationship conversation may require additional sensitivity today.",
        prediction:
          "A significant discussion may arise in an important relationship, but differing expectations or emotional sensitivity could make communication more demanding.",
        action:
          "Choose your words carefully and clarify the issue before responding.",
        avoid:
          "Avoid reacting immediately to a statement that may need further explanation.",
      },
      {
        summary:
          "Careful communication may help you navigate a sensitive relationship matter.",
        prediction:
          "A conversation about an important relationship issue may require patience today. Differences in perspective could make it harder to reach an immediate understanding.",
        action:
          "Focus on the specific concern and allow enough time for both sides to explain their views.",
        avoid:
          "Don't introduce unrelated disagreements into an already sensitive discussion.",
      },
      {
        summary:
          "A difficult conversation may benefit from patience and clearer expectations.",
        prediction:
          "Communication within an important relationship may feel more complicated today. An existing concern or differing expectations could require a measured discussion.",
        action:
          "Clarify what needs to be discussed and identify a practical next step.",
        avoid:
          "Avoid pressing for an immediate resolution when either person needs more time.",
      },
    ],

    mixed: [
      {
        summary:
          "An important conversation may bring useful clarity alongside some differences in perspective.",
        prediction:
          "A relationship discussion may offer an opportunity for greater understanding today, although differing expectations could require additional explanation or compromise.",
        action:
          "Communicate your perspective openly and identify the points that still need clarification.",
        avoid:
          "Avoid treating partial agreement as complete resolution.",
      },
      {
        summary:
          "Thoughtful communication may help an important relationship discussion develop constructively.",
        prediction:
          "A significant conversation may help clarify a relationship matter today. There may be areas of agreement alongside concerns that require further attention.",
        action:
          "Build on the points you agree about while discussing unresolved expectations.",
        avoid:
          "Don't overlook an important concern simply because part of the conversation goes well.",
      },
      {
        summary:
          "A relationship conversation may create progress while leaving some questions open.",
        prediction:
          "Communication with someone important may become more significant today. An open exchange could improve understanding, although complete clarity may require more than one discussion.",
        action:
          "Focus on understanding the immediate issue and agree on any necessary follow-up.",
        avoid:
          "Avoid expecting every relationship question to be settled in a single conversation.",
      },
    ],
  },
  relationship_harmony: {
    supportive: [
      {
        summary:
          "A warmer and more cooperative atmosphere may strengthen an important relationship today.",
        prediction:
          "An important relationship may feel more harmonious today. Greater openness and cooperation could help you enjoy the connection or make progress on a shared matter.",
        action:
          "Make time for a positive interaction and express appreciation where it feels appropriate.",
        avoid:
          "Avoid taking the other person's cooperation or support for granted.",
      },
      {
        summary:
          "Mutual understanding may create a positive atmosphere in an important relationship.",
        prediction:
          "Supportive relationship dynamics may make it easier to connect with someone important today. A willingness to listen and cooperate could strengthen an existing bond.",
        action:
          "Build on an area of agreement or do something thoughtful for the relationship.",
        avoid:
          "Don't allow routine distractions to overshadow an opportunity for connection.",
      },
      {
        summary:
          "Cooperation and thoughtful communication may bring greater harmony to a relationship.",
        prediction:
          "An important connection may benefit from a more cooperative tone today. Shared interests or a constructive interaction could help reinforce mutual understanding.",
        action:
          "Use the supportive atmosphere to strengthen an existing connection.",
        avoid:
          "Avoid assuming that harmony will maintain itself without continued attention.",
      },
    ],

    challenging: [
      {
        summary:
          "Greater harmony may be possible, although an existing concern could need attention first.",
        prediction:
          "An important relationship may offer an opportunity for improved understanding today, but unresolved tension or differing expectations could make cooperation more difficult.",
        action:
          "Acknowledge the immediate concern and look for an area where both sides can agree.",
        avoid:
          "Avoid pretending that an unresolved issue has disappeared simply to maintain peace.",
      },
      {
        summary:
          "Restoring cooperation in an important relationship may require patience today.",
        prediction:
          "A relationship may move toward greater harmony, although sensitivity around an existing matter could affect how easily both people communicate.",
        action:
          "Approach the interaction calmly and clarify the concern that is affecting cooperation.",
        avoid:
          "Don't pressure the other person to agree before their perspective has been heard.",
      },
      {
        summary:
          "An important relationship may benefit from a careful approach to rebuilding understanding.",
        prediction:
          "There may be room to improve the atmosphere in an important relationship today, but differences in expectations could require additional attention.",
        action:
          "Focus on one practical step that could improve cooperation.",
        avoid:
          "Avoid making concessions you cannot sustain merely to end an uncomfortable interaction.",
      },
    ],

    mixed: [
      {
        summary:
          "An important relationship may move toward greater harmony with some mutual adjustment.",
        prediction:
          "A relationship may offer opportunities for connection today, although differing needs or expectations could require flexibility from both sides.",
        action:
          "Build on areas of agreement while making space for the differences that remain.",
        avoid:
          "Avoid assuming that a pleasant interaction resolves every outstanding concern.",
      },
      {
        summary:
          "Cooperation may improve when both sides balance connection with realistic expectations.",
        prediction:
          "An important relationship may become more cooperative today. Some matters could develop positively, while others may still require patience or compromise.",
        action:
          "Identify a shared priority and discuss a practical way to move forward.",
        avoid:
          "Don't sacrifice an important personal boundary simply to preserve harmony.",
      },
      {
        summary:
          "A constructive interaction may strengthen harmony while revealing areas that need further understanding.",
        prediction:
          "There may be an opportunity to improve the atmosphere in a relationship today, although maintaining that progress could depend on how both people handle differing perspectives.",
        action:
          "Encourage an open exchange and recognise the areas where cooperation is already working.",
        avoid:
          "Avoid expecting complete agreement before appreciating the progress that has been made.",
      },
    ],
  },
  relationship_attention: {
    supportive: [
      {
        summary:
          "Giving an important relationship more attention may strengthen your connection today.",
        prediction:
          "An important relationship may benefit from your time and presence today. Supportive conditions could make it easier to understand what the other person needs or strengthen an existing connection.",
        action:
          "Make time for a meaningful interaction and listen to what matters to the other person.",
        avoid:
          "Avoid assuming that regular contact automatically means the relationship is receiving enough attention.",
      },
      {
        summary:
          "A thoughtful interaction may help you better understand an important relationship.",
        prediction:
          "Someone important in your life may benefit from greater attention today. A conversation or considerate gesture could help you understand the current needs of the relationship.",
        action:
          "Check in with someone important and give the interaction your full attention.",
        avoid:
          "Don't let routine distractions prevent you from recognising what the connection needs.",
      },
      {
        summary:
          "Being more present in an important relationship may create an opportunity for connection.",
        prediction:
          "An existing one-to-one connection may become more prominent today. Giving it thoughtful attention could encourage greater openness or mutual understanding.",
        action:
          "Create space for an interaction that has been receiving less attention than it deserves.",
        avoid:
          "Avoid approaching the interaction with a predetermined idea of what the other person needs.",
      },
    ],

    challenging: [
      {
        summary:
          "An important relationship may need additional attention and patience today.",
        prediction:
          "An existing relationship may require more of your attention, particularly if expectations or responses have become difficult to understand. Taking time to clarify the situation may help.",
        action:
          "Ask what needs attention and listen before deciding how to respond.",
        avoid:
          "Avoid interpreting a delayed or unexpected response as evidence of the other person's intentions.",
      },
      {
        summary:
          "Unaddressed expectations may make an important relationship more demanding today.",
        prediction:
          "A one-to-one connection may need closer attention today. Differences in availability, expectations or communication could make the interaction more sensitive.",
        action:
          "Clarify what each person reasonably expects from the interaction.",
        avoid:
          "Don't respond to pressure by making commitments you cannot maintain.",
      },
      {
        summary:
          "A sensitive relationship matter may benefit from careful attention today.",
        prediction:
          "Someone important may need more attention, or you may become more aware of an unmet expectation within the relationship. A patient approach could help clarify the underlying concern.",
        action:
          "Address the immediate concern without making assumptions about the wider relationship.",
        avoid:
          "Avoid allowing frustration over one interaction to define the entire connection.",
      },
    ],

    mixed: [
      {
        summary:
          "An important relationship may benefit from attention while requiring some adjustment.",
        prediction:
          "A one-to-one relationship may become more active today, offering an opportunity for greater understanding alongside expectations that still need clarification.",
        action:
          "Make time for the relationship while discussing what each person can realistically offer.",
        avoid:
          "Avoid assuming that giving more attention will immediately resolve every concern.",
      },
      {
        summary:
          "Giving a relationship thoughtful attention may reveal both opportunities and unresolved needs.",
        prediction:
          "An important connection may benefit from greater involvement today, although differing priorities or expectations could influence how the interaction develops.",
        action:
          "Listen to the other person's perspective and explain your own availability clearly.",
        avoid:
          "Don't neglect your own practical responsibilities while trying to meet every expectation.",
      },
      {
        summary:
          "An important interaction may help clarify what a relationship currently needs.",
        prediction:
          "A relationship may draw more of your attention today. The interaction could strengthen understanding while also highlighting an issue that requires further discussion.",
        action:
          "Focus on one meaningful interaction and identify anything that needs a follow-up conversation.",
        avoid:
          "Avoid treating an encouraging interaction as proof that all outstanding concerns are settled.",
      },
    ],
  },
  relationships_general: {
    supportive: [
      {
        summary:
          "An important relationship may benefit from greater understanding and connection today.",
        prediction:
          "Your interactions with someone important may carry a more cooperative tone today. There may be an opportunity to strengthen mutual understanding through a thoughtful conversation or gesture.",
        action:
          "Give an important relationship your attention and make room for meaningful interaction.",
        avoid:
          "Avoid assuming that the other person already knows what you appreciate or need.",
      },
      {
        summary:
          "A constructive approach to an important connection may strengthen mutual understanding.",
        prediction:
          "Relationships are highlighted in a supportive way today. An existing connection may benefit from greater openness, cooperation or a willingness to understand another perspective.",
        action:
          "Initiate a useful conversation or express appreciation where it feels appropriate.",
        avoid:
          "Don't overlook the importance of listening while expressing your own views.",
      },
      {
        summary:
          "Supportive relationship dynamics may create room for a meaningful interaction today.",
        prediction:
          "An important one-to-one connection may offer an opportunity for cooperation or greater clarity. Small, thoughtful actions could help strengthen the interaction.",
        action:
          "Make time for a person or conversation that deserves your attention.",
        avoid:
          "Avoid allowing routine distractions to take priority over an important interaction.",
      },
    ],

    challenging: [
      {
        summary:
          "An important relationship may require patience and thoughtful communication today.",
        prediction:
          "An interaction with someone important may feel more demanding today. Differences in expectations or communication could require additional care before the situation becomes clearer.",
        action:
          "Listen carefully and clarify expectations before deciding how to respond.",
        avoid:
          "Avoid reacting to an assumption about the other person's intentions.",
      },
      {
        summary:
          "Greater sensitivity in relationships may call for a measured approach.",
        prediction:
          "A one-to-one relationship may require closer attention today, particularly where existing concerns or differing priorities make communication less straightforward.",
        action:
          "Address the immediate concern calmly and focus on what can be clarified.",
        avoid:
          "Don't bring unrelated past disagreements into the current interaction.",
      },
      {
        summary:
          "Careful handling of an important interaction may help prevent unnecessary friction.",
        prediction:
          "Relationships may feel more sensitive today. A conversation or response could require patience, especially if both people are approaching the situation from different perspectives.",
        action:
          "Give the interaction enough time and ask questions before drawing conclusions.",
        avoid:
          "Avoid forcing immediate agreement when the situation needs further understanding.",
      },
    ],

    mixed: [
      {
        summary:
          "An important relationship may offer an opportunity for understanding alongside some practical differences.",
        prediction:
          "Your interactions with someone important may bring both cooperation and matters that require clarification. A balanced approach could help you make constructive use of the conversation.",
        action:
          "Build on areas of agreement while addressing unresolved expectations.",
        avoid:
          "Avoid overlooking genuine differences simply to maintain temporary harmony.",
      },
      {
        summary:
          "Relationship matters may benefit from balancing openness with realistic expectations.",
        prediction:
          "An important connection may become more active today. There may be room for greater understanding, although different needs or priorities could require some adjustment.",
        action:
          "Communicate your perspective clearly while remaining receptive to the other person's needs.",
        avoid:
          "Don't assume that a constructive interaction resolves every outstanding concern.",
      },
      {
        summary:
          "A thoughtful approach may help an important relationship develop constructively today.",
        prediction:
          "A relationship may offer opportunities for connection alongside questions that still need attention. Progress may depend on balancing your own expectations with those of the other person.",
        action:
          "Identify one issue where greater clarity or cooperation would be useful.",
        avoid:
          "Avoid making commitments merely to avoid an uncomfortable conversation.",
      },
    ],
  },
workload_service: {
  supportive: [
    {
      summary:
        "A productive approach to your workload may help you make steady progress today.",
      prediction:
        "Your daily work and practical responsibilities are highlighted today. Supportive conditions may help you clear pending tasks and make progress on existing commitments.",
      action:
        "Identify the most important pending task and give it focused attention.",
      avoid:
        "Avoid taking on unnecessary work simply because your current tasks are progressing well.",
    },
    {
      summary:
        "Organising your work effectively may create room for meaningful progress.",
      prediction:
        "An active workday may provide an opportunity to improve efficiency, resolve outstanding tasks or bring greater order to your responsibilities.",
      action:
        "Organise your workload and address an outstanding matter that can realistically be completed.",
      avoid:
        "Don't allow minor interruptions to distract you from important priorities.",
    },
    {
      summary:
        "Practical progress may come through consistent attention to your daily responsibilities.",
      prediction:
        "Your workload may be more active today, with constructive conditions for handling tasks and meeting existing obligations.",
      action:
        "Use the available momentum to move an important task toward completion.",
      avoid:
        "Avoid rushing through details in an effort to finish everything at once.",
    },
  ],

  challenging: [
    {
      summary:
        "A demanding workload may require clearer priorities and careful time management.",
      prediction:
        "Work tasks and practical obligations may place greater demands on your time today. Competing priorities could make it important to distinguish urgent matters from those that can wait.",
      action:
        "Rank your tasks by urgency and importance before committing your time.",
      avoid:
        "Avoid treating every request as equally urgent.",
    },
    {
      summary:
        "Managing competing work demands may require additional discipline today.",
      prediction:
        "Your workload may feel heavier or less predictable today. Interruptions, unfinished tasks or additional requests could affect your usual pace.",
      action:
        "Set realistic priorities and communicate any constraints that affect delivery.",
      avoid:
        "Don't promise unrealistic completion times simply to accommodate additional requests.",
    },
    {
      summary:
        "A measured approach may help you navigate increased practical demands.",
      prediction:
        "An existing work responsibility may require more time or effort than expected. Concentrating on manageable steps could help you maintain progress.",
      action:
        "Break the most demanding task into practical steps and address them systematically.",
      avoid:
        "Avoid allowing frustration over delays to disrupt the rest of your workload.",
    },
  ],

  mixed: [
    {
      summary:
        "Your workload may bring opportunities for progress alongside competing demands.",
      prediction:
        "Daily work responsibilities may be active today. You could make useful progress on existing tasks, although interruptions or additional demands may require some adjustment.",
      action:
        "Protect time for an important task while leaving room for necessary changes.",
      avoid:
        "Avoid filling your entire schedule without allowing for unexpected responsibilities.",
    },
    {
      summary:
        "Balancing productivity with realistic expectations may be important today.",
      prediction:
        "There may be constructive momentum around your workload, but managing several responsibilities at once could require careful planning.",
      action:
        "Choose the tasks that will make the greatest practical difference and organise your time accordingly.",
      avoid:
        "Don't mistake being busy for making meaningful progress.",
    },
    {
      summary:
        "Steady progress may depend on how effectively you manage today's practical demands.",
      prediction:
        "Your daily responsibilities may offer opportunities to resolve pending work, although competing priorities could affect the pace of completion.",
      action:
        "Focus on completing one meaningful priority before moving to less urgent tasks.",
      avoid:
        "Avoid allowing smaller requests to repeatedly interrupt important work.",
    },
  ],
},
career_responsibility: {
  supportive: [
    {
      summary:
        "Taking ownership of an important responsibility may support professional progress today.",
      prediction:
        "Your professional responsibilities are highlighted today. An opportunity to demonstrate reliability or take greater ownership of an existing priority may emerge.",
      action:
        "Take responsibility for an important task and establish a clear next step.",
      avoid:
        "Avoid accepting additional commitments without checking your capacity.",
    },
    {
      summary:
        "Your approach to professional responsibilities may strengthen confidence in your work.",
      prediction:
        "An important responsibility may give you an opportunity to demonstrate sound judgement and dependable execution today.",
      action:
        "Clarify expectations and deliver on a priority within your control.",
      avoid:
        "Don't assume that taking ownership means handling everything alone.",
    },
    {
      summary:
        "Greater responsibility may provide an opportunity to demonstrate leadership today.",
      prediction:
        "Professional expectations may increase in a constructive way. How you organise and handle your responsibilities could become particularly relevant.",
      action:
        "Prioritise the responsibility where your involvement can make the greatest difference.",
      avoid:
        "Avoid overpromising simply because conditions appear supportive.",
    },
  ],

  challenging: [
    {
      summary:
        "Increased professional demands may require careful prioritisation today.",
      prediction:
        "Work responsibilities may feel heavier today, particularly where expectations are increasing or several matters require your involvement.",
      action:
        "Clarify which responsibilities are most urgent and address them systematically.",
      avoid:
        "Avoid taking on every demand without reviewing its priority.",
    },
    {
      summary:
        "Professional accountability may bring additional pressure today.",
      prediction:
        "An existing responsibility may require closer attention, with increased expectations or practical complications making the situation more demanding.",
      action:
        "Review the outstanding requirements and communicate any constraints clearly.",
      avoid:
        "Don't respond defensively when expectations or responsibilities are questioned.",
    },
    {
      summary:
        "Managing professional expectations may require a measured approach.",
      prediction:
        "Your responsibilities may involve competing demands today. A practical response will be more useful than trying to satisfy every expectation immediately.",
      action:
        "Agree on realistic priorities and establish clear timelines where possible.",
      avoid:
        "Avoid making commitments purely to relieve immediate pressure.",
    },
  ],

  mixed: [
    {
      summary:
        "Greater professional responsibility may bring opportunity alongside additional demands.",
      prediction:
        "Your responsibilities may become more prominent today, offering an opportunity to demonstrate ownership while requiring careful management of expectations.",
      action:
        "Take ownership of the priority you can realistically advance.",
      avoid:
        "Avoid allowing increased responsibility to overwhelm your existing commitments.",
    },
    {
      summary:
        "Professional expectations may require a balance of initiative and practicality.",
      prediction:
        "An important work responsibility may present constructive possibilities, although additional demands or competing priorities could require adjustment.",
      action:
        "Clarify expectations and organise the resources needed to deliver.",
      avoid:
        "Don't confuse accepting more responsibility with making greater progress.",
    },
    {
      summary:
        "Handling an important responsibility thoughtfully may support steady progress.",
      prediction:
        "Your professional role may call for greater involvement today. There may be room to demonstrate reliability, provided you remain realistic about the demands involved.",
      action:
        "Identify the most valuable contribution you can make and communicate your approach.",
      avoid:
        "Avoid overlooking practical limitations while responding to increased expectations.",
    },
  ],
},
career_change: {
  supportive: [
    {
      summary:
        "A change in your professional direction may begin to take shape today.",
      prediction:
        "An existing professional situation may present an opportunity for change. Pay attention to developments that could open a different direction or way of working.",
      action:
        "Explore the practical implications of an emerging professional opportunity.",
      avoid:
        "Avoid assuming an encouraging development is already a confirmed change.",
    },
    {
      summary:
        "Professional change may offer an opportunity to explore a new direction.",
      prediction:
        "Your work situation may be moving toward a different arrangement, responsibility or direction. Today's developments could help clarify the possibilities.",
      action:
        "Gather the information needed to evaluate the potential change.",
      avoid:
        "Don't commit to a new direction before understanding its requirements.",
    },
    {
      summary:
        "Constructive movement may help clarify a possible professional transition.",
      prediction:
        "A potential change in your professional circumstances may become more relevant today. Consider how an emerging opportunity fits your longer-term priorities.",
      action:
        "Review the next practical step in a possible professional transition.",
      avoid:
        "Avoid making decisions based solely on the excitement of something new.",
    },
  ],

  challenging: [
    {
      summary:
        "Professional change may require patience and careful adjustment today.",
      prediction:
        "A change in your work situation may involve uncertainty or resistance. Give yourself time to understand the practical implications before deciding how to respond.",
      action:
        "Identify the main obstacle affecting the potential change.",
      avoid:
        "Avoid making an abrupt professional decision under temporary pressure.",
    },
    {
      summary:
        "An evolving work situation may require greater flexibility.",
      prediction:
        "Professional circumstances may be shifting, but the direction could remain unsettled. Additional information may be needed before the next step becomes clear.",
      action:
        "Clarify outstanding questions about the developing situation.",
      avoid:
        "Don't treat uncertainty as a reason to rush into a decision.",
    },
    {
      summary:
        "Careful planning may help you navigate an unsettled professional situation.",
      prediction:
        "A potential professional transition may bring additional demands or complications today. Focus on understanding what can realistically be changed.",
      action:
        "Review your options and the practical consequences of each.",
      avoid:
        "Avoid overlooking existing commitments while considering a change.",
    },
  ],

  mixed: [
    {
      summary:
        "A possible professional change may bring opportunity alongside uncertainty.",
      prediction:
        "Your professional direction may be evolving, with encouraging possibilities as well as practical questions that still need answers.",
      action:
        "Explore the opportunity while clarifying the unresolved details.",
      avoid:
        "Avoid treating an emerging possibility as a settled outcome.",
    },
    {
      summary:
        "Professional developments may call for both initiative and patience.",
      prediction:
        "A change in your work situation may offer a useful opening, although the timing or practical arrangements could require adjustment.",
      action:
        "Take a measured step toward understanding the potential transition.",
      avoid:
        "Don't overlook important conditions in the desire to move forward.",
    },
    {
      summary:
        "An evolving professional situation may require a balanced approach.",
      prediction:
        "A possible change in your professional circumstances may become clearer today, but competing considerations could influence your next steps.",
      action:
        "Compare the available options against your existing priorities.",
      avoid:
        "Avoid making a final commitment while important details remain unresolved.",
    },
  ],
},
  career_general: {
    supportive: [
      {
        prediction:
          "Your professional priorities are active today, with supportive conditions for making practical progress. Focus on the work that already needs your attention.",
        action:
          "Choose one important professional priority and move it forward.",
        avoid:
          "Avoid spreading your attention across too many work matters.",
        summary:
          "Your existing professional priorities offer an opportunity for practical progress today.",

      },
      {
        prediction:
          "Today offers an opportunity to bring greater direction to your work. A measured approach to existing responsibilities may help you make constructive progress.",
        action:
          "Identify the task or conversation that would make the greatest practical difference.",
        avoid:
          "Don't create unnecessary urgency around matters that can develop steadily.",

summary:
  "A measured approach to your responsibilities may help bring greater direction to your work today.",
      },
      {
        prediction:
          "Professional matters deserve your attention today. You may find it useful to take initiative on an existing priority rather than waiting for every detail to become clear.",
        action:
          "Take a practical step on a work matter within your control.",
        avoid:
          "Avoid making commitments before reviewing your available time and resources.",

summary:
  "Taking initiative on an existing work priority may help you make constructive progress today.",
      },
    ],

challenging: [
  {
    summary:
      "Professional demands may require a more measured approach today.",
    prediction:
      "Work responsibilities may demand additional attention today. Focus on resolving the most immediate issue rather than trying to address every concern at once.",
    action:
      "Identify the most pressing professional responsibility and establish a practical next step.",
    avoid:
      "Avoid allowing competing demands to dictate your entire day.",
  },
  {
    summary:
      "A work-related challenge may call for patience and clearer priorities.",
    prediction:
      "Your professional situation may involve competing expectations or practical obstacles today. Clarifying what needs attention first could help you manage the pressure.",
    action:
      "Review your priorities and communicate any constraints clearly.",
    avoid:
      "Avoid making commitments simply to relieve immediate pressure.",
  },
  {
    summary:
      "Careful handling of professional responsibilities may help you navigate today's pressure.",
    prediction:
      "An existing work matter may require additional effort or adjustment today. A measured response could be more useful than trying to force immediate progress.",
    action:
      "Address the practical obstacle within your control.",
    avoid:
      "Avoid reacting impulsively to delays or increased expectations.",
  },
],

mixed: [
  {
    summary:
      "Professional matters may bring both progress and additional demands today.",
    prediction:
      "Your work priorities may offer opportunities for progress alongside responsibilities that require adjustment. Focus on what can realistically move forward.",
    action:
      "Separate the opportunities you can act on from matters that still need clarification.",
    avoid:
      "Avoid overlooking practical constraints while pursuing progress.",
  },
  {
    summary:
      "Balancing opportunity with existing responsibilities may be important today.",
    prediction:
      "Your professional situation may show constructive movement, although competing expectations could require some flexibility in your approach.",
    action:
      "Advance one important priority while keeping other commitments in view.",
    avoid:
      "Avoid taking on additional responsibilities without reviewing your capacity.",
  },
  {
    summary:
      "Steady progress at work may depend on managing competing priorities.",
    prediction:
      "There may be room to move a professional matter forward today, but the pace or direction could require adjustment as other demands emerge.",
    action:
      "Choose a realistic next step and adjust your schedule where necessary.",
    avoid:
      "Avoid treating every new demand as equally urgent.",
  },
],
  },

  career_movement: {
    supportive: [
      {
        prediction:
          "A professional conversation or development may help move an existing work matter forward today. Stay attentive to opportunities that are already taking shape.",
        action:
          "Follow up on a relevant conversation or pending professional matter.",
        avoid:
          "Avoid overlooking a useful opening because it appears small.",
      },
      {
        prediction:
          "Your professional situation may gain momentum through communication, coordination or progress on an existing priority.",
        action:
          "Identify the work matter where a timely follow-up could make a difference.",
        avoid:
          "Don't assume that progress will happen without your involvement.",
      },
      {
        prediction:
          "There may be constructive movement around an important professional priority today, even if the longer-term outcome is not yet settled.",
        action:
          "Take one practical step to advance the professional matter already in motion.",
        avoid:
          "Avoid treating an encouraging development as a confirmed outcome.",
      },
    ],
    challenging: [
      {
        prediction:
          "A professional matter may require extra effort to move forward today. Resistance or competing expectations could make progress less straightforward.",
        action:
          "Clarify what is holding up the matter and address the most practical obstacle.",
        avoid:
          "Avoid forcing a decision before the relevant concerns are understood.",
      },
      {
        prediction:
          "Movement in your professional situation may come with additional pressure or an unexpected adjustment.",
        action:
          "Review your approach and identify where greater flexibility may help.",
        avoid:
          "Don't react defensively to a delay or change in direction.",
      },
      {
        prediction:
          "An active work matter may need careful handling today, particularly where progress depends on other people's decisions.",
        action:
          "Follow up constructively and confirm the next agreed step.",
        avoid:
          "Avoid interpreting a slow response as a final decision.",
      },
    ],
    mixed: [
      {
        prediction:
          "A professional matter may show movement today, although some details or expectations could still require adjustment.",
        action:
          "Build on the progress available while clarifying what remains unresolved.",
        avoid:
          "Avoid committing to a direction before understanding the practical implications.",
      },
      {
        prediction:
          "There may be an opening to advance an existing work priority, alongside conditions that call for patience.",
        action:
          "Use the opportunity to move the discussion forward without rushing the outcome.",
        avoid:
          "Don't overlook outstanding concerns simply because momentum is improving.",
      },
      {
        prediction:
          "Your professional situation may develop through a combination of useful progress and additional demands today.",
        action:
          "Separate what can move forward now from what still needs clarification.",
        avoid:
          "Avoid allowing temporary uncertainty to disrupt an otherwise constructive step.",
      },
    ],
  },

  career_recognition: {
    supportive: [
      {
        prediction:
          "Your contribution may receive greater attention today. An existing achievement or effort could become more visible to the people who matter professionally.",
        action:
          "Communicate a relevant accomplishment clearly and factually.",
        avoid:
          "Avoid assuming others already know the extent of your contribution.",
      },
      {
        prediction:
          "Professional visibility may improve today, creating an opportunity for your work to be acknowledged.",
        action:
          "Present your progress or completed work where it is relevant.",
        avoid:
          "Don't exaggerate results or promise more than you can deliver.",
      },
      {
        prediction:
          "An important piece of work may attract constructive attention today, making your professional contribution more noticeable.",
        action:
          "Be prepared to explain the results and value of your work.",
        avoid:
          "Avoid letting an opportunity for visibility pass without preparation.",
      },
    ],
    challenging: [
      {
        prediction:
          "Your professional contribution may come under closer examination today. Greater visibility could bring questions or increased expectations.",
        action:
          "Prepare the facts behind your work and respond to feedback constructively.",
        avoid:
          "Avoid treating every question as criticism.",
      },
      {
        prediction:
          "Attention around your work may increase, but acknowledgement could be accompanied by scrutiny.",
        action:
          "Communicate your contribution accurately and address any gaps directly.",
        avoid:
          "Don't make commitments merely to satisfy immediate expectations.",
      },
      {
        prediction:
          "Professional visibility may feel demanding today, particularly if your results or decisions need additional explanation.",
        action:
          "Focus on evidence, clarity and a measured professional response.",
        avoid:
          "Avoid reacting impulsively to feedback or comparison.",
      },
    ],
    mixed: [
      {
        prediction:
          "Your work may receive greater attention today, bringing an opportunity for acknowledgement alongside additional expectations.",
        action:
          "Highlight your contribution while remaining prepared for questions.",
        avoid:
          "Avoid confusing increased visibility with a confirmed reward.",
      },
      {
        prediction:
          "Professional recognition may be an active theme, although the attention could also reveal areas requiring further work.",
        action:
          "Present your achievements clearly and remain open to constructive feedback.",
        avoid:
          "Don't let either praise or criticism distract from your priorities.",
      },
      {
        prediction:
          "An existing professional contribution may become more visible today. How you handle the resulting expectations may be as important as the attention itself.",
        action:
          "Use the opportunity to demonstrate reliability and communicate progress.",
        avoid:
          "Avoid making assumptions about what increased attention will lead to.",
      },
    ],
  },

  money_inflow: {
    supportive: [
      {
        prediction:
          "A pending payment or financial opportunity may show encouraging movement today. Keep an eye on developments that could strengthen your available resources.",
        action:
          "Follow up on an outstanding payment or financial opportunity.",
        avoid:
          "Avoid making spending commitments before funds are confirmed.",
      },
      {
        prediction:
          "Money-related matters may move in a constructive direction. An existing financial opportunity could progress or become clearer.",
        action:
          "Review incoming financial developments and confirm the details.",
        avoid:
          "Don't assume that promising developments guarantee immediate payment.",
      },
      {
        prediction:
          "There may be an opportunity to improve your financial position today, particularly through a payment, reimbursement or existing financial matter.",
        action:
          "Check the status of pending receipts and organise your next steps.",
        avoid:
          "Avoid allocating money that hasn't yet reached you.",
      },
    ],

    challenging: [
      {
        prediction:
          "An expected payment or financial opportunity may require additional attention today. Delays or conditions could affect how quickly matters progress.",
        action:
          "Check outstanding payments and clarify any pending requirements.",
        avoid:
          "Avoid relying on an expected receipt to meet an immediate commitment.",
      },
      {
        prediction:
          "Incoming financial matters may involve extra follow-up. Review the practical details before making plans around a possible receipt.",
        action:
          "Contact the relevant person or organisation about pending funds.",
        avoid:
          "Don't overlook conditions, deductions or unresolved obligations.",
      },
      {
        prediction:
          "Progress on an incoming payment may be slower or less straightforward than expected. A careful approach will help you manage the situation.",
        action:
          "Review the timeline and documentation for an outstanding payment.",
        avoid:
          "Avoid making financial assumptions before receiving confirmation.",
      },
    ],

    mixed: [
      {
        prediction:
          "An incoming financial matter may show movement today, although the final amount, timing or conditions could still require clarification.",
        action:
          "Follow up on pending receipts and check the practical details.",
        avoid:
          "Avoid treating partial progress as a completed financial outcome.",
      },
      {
        prediction:
          "A financial opportunity may develop gradually today. There could be encouraging signs alongside details that still need attention.",
        action:
          "Review the opportunity and identify what remains unresolved.",
        avoid:
          "Don't commit additional resources before understanding the full picture.",
      },
      {
        prediction:
          "Money-related developments may bring both opportunity and practical considerations today. Allow the situation to become clearer before making larger plans.",
        action:
          "Confirm the status of expected payments and review your priorities.",
        avoid:
          "Avoid making decisions based on an estimated or unconfirmed receipt.",
      },
    ],
  },
};

export function selectDailyNarrativeVariant(params: {
  manifestationId: string | null;
  polarity: NarrativePolarity;
  selectedDateISO: string;
  profileKey: string;
  nakshatra?: string | null;
  pada?: number | null;
}): DailyNarrativeVariant | null {
  const {
    manifestationId,
    polarity,
    selectedDateISO,
    profileKey,
    nakshatra,
    pada,
  } = params;

  if (!manifestationId) return null;

  const variants =
    DAILY_NARRATIVE_VARIANTS[manifestationId]?.[polarity] ??
    (polarity === "neutral"
      ? DAILY_NARRATIVE_VARIANTS[manifestationId]?.mixed
      : undefined);

  if (!variants?.length) return null;

  const matchingPadaVariants = variants.filter(
    (variant) =>
      variant.nakshatra &&
      variant.pada === pada &&
      variant.nakshatra.toLowerCase() ===
        nakshatra?.toLowerCase()
  );

  const generalVariants = variants.filter(
    (variant) => !variant.nakshatra && !variant.pada
  );

  const eligibleVariants =
    matchingPadaVariants.length > 0
      ? matchingPadaVariants
      : generalVariants;

  if (!eligibleVariants.length) return null;

  // Stable selection: same profile, date and theme
  // always produce the same narrative.

  // Keep the variation order stable for this profile,
  // manifestation, polarity and relevant pada.
  const key = [
    profileKey,
    manifestationId,
    polarity,
    nakshatra ?? "",
    pada ?? "",
  ].join("|");

  let hash = 2166136261;

  for (let index = 0; index < key.length; index++) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  // Rotate through the available variants by calendar day.
  // This prevents consecutive repetition while the same
  // manifestation, polarity and pada context remain active.
  const dayNumber = Math.floor(
    Date.parse(`${selectedDateISO}T00:00:00Z`) /
      86_400_000
  );

  if (!Number.isFinite(dayNumber)) {
    return eligibleVariants[
      (hash >>> 0) % eligibleVariants.length
    ];
  }

  const index =
    ((hash >>> 0) + dayNumber) %
    eligibleVariants.length;

  return eligibleVariants[index];
}