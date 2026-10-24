
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
          "A conversation about where an important relationship is heading may open the door to clearer plans or a more definite commitment today. It may involve an existing expectation about time, shared responsibilities or the next stage of a connection, rather than a completely new development. This may clarify what is genuinely possible now while leaving some details of a longer-term commitment open.",
        action:
          "Discuss an important shared expectation or future priority with openness.",
        avoid:
          "Avoid assuming that a positive conversation means every practical detail has been agreed.",
      },
      {
        summary:
          "A constructive approach to commitment may strengthen understanding in an important relationship.",
        prediction:
          "Someone important may show greater willingness to discuss a shared future, including what each of you is prepared to take on. The exchange could bring into focus a decision that has been discussed before but not yet translated into practical arrangements. The significance lies in whether intentions are becoming more concrete, not in assuming that every promise is final.",
        action:
          "Identify an expectation or commitment that would benefit from a clear discussion.",
        avoid:
          "Don't make promises before considering what you can realistically maintain.",
      },
      {
        summary:
          "An important relationship may benefit from greater clarity about shared expectations.",
        prediction:
          "A relationship could reach a useful turning point as shared intentions, responsibilities or longer-term plans are discussed more openly. Even a small change in how someone expresses their intentions could make the direction of the relationship easier to understand. You may leave with a better sense of the direction of the connection, even if an agreement takes more time.",
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
          "A discussion about commitment may reveal that you and someone important are not yet ready for the same next step. It may involve an existing expectation about time, shared responsibilities or the next stage of a connection, rather than a completely new development. This may clarify what is genuinely possible now while leaving some details of a longer-term commitment open.",
        action:
          "Clarify the expectations that are creating uncertainty or pressure.",
        avoid:
          "Avoid making commitments merely to end an uncomfortable conversation.",
      },
      {
        summary:
          "Differences in shared intentions may require patience and clear communication.",
        prediction:
          "An existing relationship may face a difficult conversation about timing, responsibilities or what each person expects for the future. The exchange could bring into focus a decision that has been discussed before but not yet translated into practical arrangements. The significance lies in whether intentions are becoming more concrete, not in assuming that every promise is final.",
        action:
          "Discuss the specific expectations that need clarification without demanding an immediate answer.",
        avoid:
          "Don't interpret uncertainty as proof of the other person's intentions.",
      },
      {
        summary:
          "A relationship commitment may need realistic expectations and thoughtful consideration.",
        prediction:
          "A proposed commitment or shared arrangement may meet practical objections, making agreement harder to reach today. Even a small change in how someone expresses their intentions could make the direction of the relationship easier to understand. You may leave with a better sense of the direction of the connection, even if an agreement takes more time.",
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
          "A conversation about commitment could move forward, though a difference over timing or responsibilities may remain unresolved. It may involve an existing expectation about time, shared responsibilities or the next stage of a connection, rather than a completely new development. This may clarify what is genuinely possible now while leaving some details of a longer-term commitment open.",
        action:
          "Explore shared priorities while identifying the details that need further discussion.",
        avoid:
          "Avoid treating an encouraging conversation as a final agreement.",
      },
      {
        summary:
          "Questions about commitment may bring constructive discussion alongside a need for adjustment.",
        prediction:
          "Someone important may be open to discussing the future, but the details of what each person can promise could still need work. The exchange could bring into focus a decision that has been discussed before but not yet translated into practical arrangements. The significance lies in whether intentions are becoming more concrete, not in assuming that every promise is final.",
        action:
          "Discuss what each person is ready to commit to and where more clarity is needed.",
        avoid:
          "Don't overlook important differences simply because there is agreement on the broader direction.",
      },
      {
        summary:
          "Balancing shared intentions with practical expectations may be important today.",
        prediction:
          "A relationship may take a step toward a clearer direction without reaching a final agreement on shared expectations. Even a small change in how someone expresses their intentions could make the direction of the relationship easier to understand. You may leave with a better sense of the direction of the connection, even if an agreement takes more time.",
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
          "A disagreement or sensitive remark may arise in an important relationship, but the exchange could also clear up an existing misunderstanding. The immediate issue may be relatively small, while the reaction reflects expectations or feelings that have been building for some time. The exchange may help identify the real source of friction, although understanding it is not the same as resolving it.",
        action:
          "Address the immediate concern calmly and listen to the other person's perspective.",
        avoid:
          "Avoid assuming that a constructive conversation requires immediate agreement.",
      },
      {
        summary:
          "Thoughtful handling of relationship tension may help restore cooperation.",
        prediction:
          "A moment of friction with someone close may ease when an overlooked concern is acknowledged. What matters may be less the first remark and more the concern that becomes visible as the exchange continues. This could be a temporary strain rather than a reliable indication of the relationship’s longer-term direction.",
        action:
          "Identify the specific issue and look for a practical area of agreement.",
        avoid:
          "Don't dismiss a concern simply because the overall interaction seems manageable.",
      },
      {
        summary:
          "Patience may help turn a sensitive interaction into an opportunity for greater clarity.",
        prediction:
          "An unresolved relationship issue may resurface, offering a chance to discuss it more calmly than before. The situation could reveal a difference in how each person understood an earlier conversation or commitment. The outcome may depend on whether the underlying concern becomes clearer, not on who has the final word.",
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
          "A difference in expectations may trigger a tense exchange with someone important, especially around an issue that has been left unsettled. The immediate issue may be relatively small, while the reaction reflects expectations or feelings that have been building for some time. The exchange may help identify the real source of friction, although understanding it is not the same as resolving it.",
        action:
          "Give yourself time to understand the concern before responding.",
        avoid:
          "Avoid reacting impulsively or escalating a disagreement over an immediate frustration.",
      },
      {
        summary:
          "An existing relationship concern may become more demanding today.",
        prediction:
          "A conversation with someone close could become strained if either person feels unheard or pressured to respond. What matters may be less the first remark and more the concern that becomes visible as the exchange continues. This could be a temporary strain rather than a reliable indication of the relationship’s longer-term direction.",
        action:
          "Focus on the immediate issue and clarify what each person is trying to communicate.",
        avoid:
          "Don't insist on resolving the disagreement while emotions are running high.",
      },
      {
        summary:
          "A sensitive interaction may benefit from clear boundaries and a measured response.",
        prediction:
          "An ordinary interaction may escalate into disagreement if frustration from an earlier issue enters the conversation. The situation could reveal a difference in how each person understood an earlier conversation or commitment. The outcome may depend on whether the underlying concern becomes clearer, not on who has the final word.",
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
          "A sensitive exchange may begin with friction but reveal what has been troubling one or both people. The immediate issue may be relatively small, while the reaction reflects expectations or feelings that have been building for some time. The exchange may help identify the real source of friction, although understanding it is not the same as resolving it.",
        action:
          "Acknowledge the disagreement and look for one issue both sides can address.",
        avoid:
          "Avoid assuming that identifying the problem means it has already been resolved.",
      },
      {
        summary:
          "Managing relationship tension may require balancing openness with patience.",
        prediction:
          "Someone important may raise a concern that leads to both useful honesty and temporary discomfort. What matters may be less the first remark and more the concern that becomes visible as the exchange continues. This could be a temporary strain rather than a reliable indication of the relationship’s longer-term direction.",
        action:
          "Express your concern clearly while allowing the other person space to respond.",
        avoid:
          "Don't overlook your own needs merely to bring an uncomfortable conversation to an end.",
      },
      {
        summary:
          "A measured response may help prevent temporary relationship tension from becoming a larger issue.",
        prediction:
          "A relationship conversation could alternate between cooperation and disagreement before the immediate issue becomes clearer. The situation could reveal a difference in how each person understood an earlier conversation or commitment. The outcome may depend on whether the underlying concern becomes clearer, not on who has the final word.",
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
          "A conversation with someone important may bring a useful answer or clarify a shared decision today. The exchange may concern a question that has been waiting for a clear response, especially where expectations have not been stated openly. The value of the exchange may be greater clarity about where each person stands, even if a final answer is not reached.",
        action:
          "Make time for a conversation that could improve mutual understanding.",
        avoid:
          "Avoid assuming you already know what the other person wants to say.",
      },
      {
        summary:
          "Open communication may help strengthen understanding in an important relationship.",
        prediction:
          "Someone close may be more willing to discuss feelings, expectations or a matter that has been difficult to raise. A message or face-to-face conversation could add context that was missing from an earlier interaction. It could narrow an existing uncertainty without settling every expectation connected to the relationship.",
        action:
          "Express your perspective clearly and invite the other person to share theirs.",
        avoid:
          "Don't rush toward a conclusion before both perspectives have been heard.",
      },
      {
        summary:
          "A constructive discussion may help an important relationship move forward.",
        prediction:
          "A pending relationship conversation could move forward, helping both people understand where they stand. What initially sounds straightforward may carry a second question about timing, availability or what happens next. The conversation may change your understanding of the situation more than it changes the situation itself.",
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
          "An important relationship discussion may be harder than expected if both sides approach the issue with different assumptions. The exchange may concern a question that has been waiting for a clear response, especially where expectations have not been stated openly. The value of the exchange may be greater clarity about where each person stands, even if a final answer is not reached.",
        action:
          "Choose your words carefully and clarify the issue before responding.",
        avoid:
          "Avoid reacting immediately to a statement that may need further explanation.",
      },
      {
        summary:
          "Careful communication may help you navigate a sensitive relationship matter.",
        prediction:
          "A conversation about an unresolved concern could stall when emotions or competing expectations enter the exchange. A message or face-to-face conversation could add context that was missing from an earlier interaction. It could narrow an existing uncertainty without settling every expectation connected to the relationship.",
        action:
          "Focus on the specific concern and allow enough time for both sides to explain their views.",
        avoid:
          "Don't introduce unrelated disagreements into an already sensitive discussion.",
      },
      {
        summary:
          "A difficult conversation may benefit from patience and clearer expectations.",
        prediction:
          "A message or discussion with someone important may need clarification before either person can reach a decision. What initially sounds straightforward may carry a second question about timing, availability or what happens next. The conversation may change your understanding of the situation more than it changes the situation itself.",
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
          "A meaningful conversation may settle one relationship question while leaving another open. The exchange may concern a question that has been waiting for a clear response, especially where expectations have not been stated openly. The value of the exchange may be greater clarity about where each person stands, even if a final answer is not reached.",
        action:
          "Communicate your perspective openly and identify the points that still need clarification.",
        avoid:
          "Avoid treating partial agreement as complete resolution.",
      },
      {
        summary:
          "Thoughtful communication may help an important relationship discussion develop constructively.",
        prediction:
          "An exchange with someone close could reveal useful common ground alongside a difference that needs further discussion. A message or face-to-face conversation could add context that was missing from an earlier interaction. It could narrow an existing uncertainty without settling every expectation connected to the relationship.",
        action:
          "Build on the points you agree about while discussing unresolved expectations.",
        avoid:
          "Don't overlook an important concern simply because part of the conversation goes well.",
      },
      {
        summary:
          "A relationship conversation may create progress while leaving some questions open.",
        prediction:
          "A pending relationship discussion may move forward, though the final understanding could take another conversation. What initially sounds straightforward may carry a second question about timing, availability or what happens next. The conversation may change your understanding of the situation more than it changes the situation itself.",
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
          "A warmer exchange or thoughtful gesture may improve the atmosphere in an important relationship today. The change may show itself through a warmer response, an easier conversation or willingness to cooperate on something ordinary. This could make the connection feel more settled for the day without implying that every older concern has disappeared.",
        action:
          "Make time for a positive interaction and express appreciation where it feels appropriate.",
        avoid:
          "Avoid taking the other person's cooperation or support for granted.",
      },
      {
        summary:
          "Mutual understanding may create a positive atmosphere in an important relationship.",
        prediction:
          "Someone close may respond more openly than expected, making it easier to reconnect or enjoy time together. A small gesture or shared moment could shift the tone of an interaction that has recently felt distant or routine. The positive shift may be modest but meaningful because it changes the atmosphere around an existing connection.",
        action:
          "Build on an area of agreement or do something thoughtful for the relationship.",
        avoid:
          "Don't allow routine distractions to overshadow an opportunity for connection.",
      },
      {
        summary:
          "Cooperation and thoughtful communication may bring greater harmony to a relationship.",
        prediction:
          "A shared activity or constructive conversation could restore a sense of cooperation with someone important. The improvement may be noticeable in how comfortably you communicate, even if no major relationship decision is involved. What stands out may be renewed ease and cooperation rather than a dramatic relationship milestone.",
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
          "An attempt to restore harmony may run into an unresolved concern that cannot be ignored today. The change may show itself through a warmer response, an easier conversation or willingness to cooperate on something ordinary. This could make the connection feel more settled for the day without implying that every older concern has disappeared.",
        action:
          "Acknowledge the immediate concern and look for an area where both sides can agree.",
        avoid:
          "Avoid pretending that an unresolved issue has disappeared simply to maintain peace.",
      },
      {
        summary:
          "Restoring cooperation in an important relationship may require patience today.",
        prediction:
          "A relationship may feel calmer on the surface while a difference in expectations still affects an important interaction. A small gesture or shared moment could shift the tone of an interaction that has recently felt distant or routine. The positive shift may be modest but meaningful because it changes the atmosphere around an existing connection.",
        action:
          "Approach the interaction calmly and clarify the concern that is affecting cooperation.",
        avoid:
          "Don't pressure the other person to agree before their perspective has been heard.",
      },
      {
        summary:
          "An important relationship may benefit from a careful approach to rebuilding understanding.",
        prediction:
          "Someone close may welcome a more peaceful exchange but remain hesitant about a matter that caused earlier tension. The improvement may be noticeable in how comfortably you communicate, even if no major relationship decision is involved. What stands out may be renewed ease and cooperation rather than a dramatic relationship milestone.",
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
          "A pleasant interaction may bring you closer to someone important, even if one unresolved issue remains. The change may show itself through a warmer response, an easier conversation or willingness to cooperate on something ordinary. This could make the connection feel more settled for the day without implying that every older concern has disappeared.",
        action:
          "Build on areas of agreement while making space for the differences that remain.",
        avoid:
          "Avoid assuming that a pleasant interaction resolves every outstanding concern.",
      },
      {
        summary:
          "Cooperation may improve when both sides balance connection with realistic expectations.",
        prediction:
          "Cooperation with someone close could improve, though different needs may require a small compromise. A small gesture or shared moment could shift the tone of an interaction that has recently felt distant or routine. The positive shift may be modest but meaningful because it changes the atmosphere around an existing connection.",
        action:
          "Identify a shared priority and discuss a practical way to move forward.",
        avoid:
          "Don't sacrifice an important personal boundary simply to preserve harmony.",
      },
      {
        summary:
          "A constructive interaction may strengthen harmony while revealing areas that need further understanding.",
        prediction:
          "A relationship may feel easier today after a constructive exchange, without every outstanding concern being settled. The improvement may be noticeable in how comfortably you communicate, even if no major relationship decision is involved. What stands out may be renewed ease and cooperation rather than a dramatic relationship milestone.",
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
          "Someone important may reach out, seek your time or become more involved in your day, creating an opportunity to reconnect. This could come through a request for time, an unexpected message or a conversation that brings an existing connection into focus. The interaction may show which part of the relationship currently needs recognition, without defining its entire future.",
        action:
          "Make time for a meaningful interaction and listen to what matters to the other person.",
        avoid:
          "Avoid assuming that regular contact automatically means the relationship is receiving enough attention.",
      },
      {
        summary:
          "A thoughtful interaction may help you better understand an important relationship.",
        prediction:
          "A conversation or gesture from someone close may reveal a need that has not been expressed clearly before. The person involved may be responding to something already happening between you, rather than introducing an entirely new issue. The significance may lie in understanding the other person’s immediate expectations rather than reaching a major conclusion.",
        action:
          "Check in with someone important and give the interaction your full attention.",
        avoid:
          "Don't let routine distractions prevent you from recognising what the connection needs.",
      },
      {
        summary:
          "Being more present in an important relationship may create an opportunity for connection.",
        prediction:
          "An important connection may come to the foreground through a message, meeting or request for your attention. A seemingly routine interaction could reveal that someone needs more clarity, availability or acknowledgement than usual. This could make an existing need more visible, even if the interaction itself remains relatively ordinary.",
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
          "Someone close may feel overlooked or ask for more of your time when other responsibilities are competing for attention. This could come through a request for time, an unexpected message or a conversation that brings an existing connection into focus. The interaction may show which part of the relationship currently needs recognition, without defining its entire future.",
        action:
          "Ask what needs attention and listen before deciding how to respond.",
        avoid:
          "Avoid interpreting a delayed or unexpected response as evidence of the other person's intentions.",
      },
      {
        summary:
          "Unaddressed expectations may make an important relationship more demanding today.",
        prediction:
          "A delayed response or mismatch in availability could create sensitivity in an important relationship. The person involved may be responding to something already happening between you, rather than introducing an entirely new issue. The significance may lie in understanding the other person’s immediate expectations rather than reaching a major conclusion.",
        action:
          "Clarify what each person reasonably expects from the interaction.",
        avoid:
          "Don't respond to pressure by making commitments you cannot maintain.",
      },
      {
        summary:
          "A sensitive relationship matter may benefit from careful attention today.",
        prediction:
          "An unmet expectation may become visible when someone important seeks support or reassurance. A seemingly routine interaction could reveal that someone needs more clarity, availability or acknowledgement than usual. This could make an existing need more visible, even if the interaction itself remains relatively ordinary.",
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
          "Someone important may seek more contact today, although finding time or agreeing on expectations could take adjustment. This could come through a request for time, an unexpected message or a conversation that brings an existing connection into focus. The interaction may show which part of the relationship currently needs recognition, without defining its entire future.",
        action:
          "Make time for the relationship while discussing what each person can realistically offer.",
        avoid:
          "Avoid assuming that giving more attention will immediately resolve every concern.",
      },
      {
        summary:
          "Giving a relationship thoughtful attention may reveal both opportunities and unresolved needs.",
        prediction:
          "A meaningful interaction may bring you closer to someone while revealing a need that still requires attention. The person involved may be responding to something already happening between you, rather than introducing an entirely new issue. The significance may lie in understanding the other person’s immediate expectations rather than reaching a major conclusion.",
        action:
          "Listen to the other person's perspective and explain your own availability clearly.",
        avoid:
          "Don't neglect your own practical responsibilities while trying to meet every expectation.",
      },
      {
        summary:
          "An important interaction may help clarify what a relationship currently needs.",
        prediction:
          "A relationship could become more prominent through a conversation or request, with both connection and practical demands involved. A seemingly routine interaction could reveal that someone needs more clarity, availability or acknowledgement than usual. This could make an existing need more visible, even if the interaction itself remains relatively ordinary.",
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
          "A conversation or thoughtful gesture may improve understanding with someone important today. The interaction may involve a familiar person and an issue that has already been present in the background. The exchange may offer a clearer picture of the connection while leaving its broader direction unchanged.",
        action:
          "Give an important relationship your attention and make room for meaningful interaction.",
        avoid:
          "Avoid assuming that the other person already knows what you appreciate or need.",
      },
      {
        summary:
          "A constructive approach to an important connection may strengthen mutual understanding.",
        prediction:
          "An existing connection could become more cooperative after a useful exchange or shared decision. A message, practical request or informal conversation could make the current state of a connection more apparent. The importance of the moment may be in what becomes understood, rather than in a major event or commitment.",
        action:
          "Initiate a useful conversation or express appreciation where it feels appropriate.",
        avoid:
          "Don't overlook the importance of listening while expressing your own views.",
      },
      {
        summary:
          "Supportive relationship dynamics may create room for a meaningful interaction today.",
        prediction:
          "Someone important may offer support or respond positively to an effort to reconnect. Even without a major turning point, the way someone responds may offer useful insight into the relationship. This could bring a modest shift in understanding without settling every issue connected to the relationship.",
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
          "A conversation with someone important may expose a difference in expectations that needs careful handling. The interaction may involve a familiar person and an issue that has already been present in the background. The exchange may offer a clearer picture of the connection while leaving its broader direction unchanged.",
        action:
          "Listen carefully and clarify expectations before deciding how to respond.",
        avoid:
          "Avoid reacting to an assumption about the other person's intentions.",
      },
      {
        summary:
          "Greater sensitivity in relationships may call for a measured approach.",
        prediction:
          "An existing relationship could feel strained by a delayed response, competing priorities or an unresolved concern. A message, practical request or informal conversation could make the current state of a connection more apparent. The importance of the moment may be in what becomes understood, rather than in a major event or commitment.",
        action:
          "Address the immediate concern calmly and focus on what can be clarified.",
        avoid:
          "Don't bring unrelated past disagreements into the current interaction.",
      },
      {
        summary:
          "Careful handling of an important interaction may help prevent unnecessary friction.",
        prediction:
          "A sensitive exchange may require clarification before a misunderstanding affects an important connection. Even without a major turning point, the way someone responds may offer useful insight into the relationship. This could bring a modest shift in understanding without settling every issue connected to the relationship.",
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
          "An important interaction may bring both a helpful exchange and a difference that still needs attention. The interaction may involve a familiar person and an issue that has already been present in the background. The exchange may offer a clearer picture of the connection while leaving its broader direction unchanged.",
        action:
          "Build on areas of agreement while addressing unresolved expectations.",
        avoid:
          "Avoid overlooking genuine differences simply to maintain temporary harmony.",
      },
      {
        summary:
          "Relationship matters may benefit from balancing openness with realistic expectations.",
        prediction:
          "Someone close may be receptive to discussion, although expectations or availability could remain out of step. A message, practical request or informal conversation could make the current state of a connection more apparent. The importance of the moment may be in what becomes understood, rather than in a major event or commitment.",
        action:
          "Communicate your perspective clearly while remaining receptive to the other person's needs.",
        avoid:
          "Don't assume that a constructive interaction resolves every outstanding concern.",
      },
      {
        summary:
          "A thoughtful approach may help an important relationship develop constructively today.",
        prediction:
          "A relationship matter could move toward greater understanding without resolving every practical concern today. Even without a major turning point, the way someone responds may offer useful insight into the relationship. This could bring a modest shift in understanding without settling every issue connected to the relationship.",
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
        "A pending task may move toward completion today, particularly if it has been waiting for your attention or a final detail. The development may involve an existing assignment, an incoming request or a practical detail that affects the day schedule. The day may bring measurable progress on one responsibility while another remains dependent on timing or coordination.",
      action:
        "Identify the most important pending task and give it focused attention.",
      avoid:
        "Avoid taking on unnecessary work simply because your current tasks are progressing well.",
    },
    {
      summary:
        "Organising your work effectively may create room for meaningful progress.",
      prediction:
        "An opportunity to clear an outstanding work item or improve a routine process may arise during the day. A task that seemed settled could depend on another individual’s response, an additional check or a change in priority. The main effect could be a shift in workload pressure rather than the completion of everything currently pending.",
      action:
        "Organise your workload and address an outstanding matter that can realistically be completed.",
      avoid:
        "Don't allow minor interruptions to distract you from important priorities.",
    },
    {
      summary:
        "Practical progress may come through consistent attention to your daily responsibilities.",
      prediction:
        "A practical responsibility may progress more smoothly than expected, freeing time for another existing commitment. The pace of the day may be shaped by how routine responsibilities interact with one matter that needs closer attention. This may clarify which work item is genuinely moving and which still depends on factors outside your control.",
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
        "An unexpected request or competing deadline may interrupt your planned workload today. The development may involve an existing assignment, an incoming request or a practical detail that affects the day schedule. The day may bring measurable progress on one responsibility while another remains dependent on timing or coordination.",
      action:
        "Rank your tasks by urgency and importance before committing your time.",
      avoid:
        "Avoid treating every request as equally urgent.",
    },
    {
      summary:
        "Managing competing work demands may require additional discipline today.",
      prediction:
        "Unfinished tasks or new demands could make your working day heavier than anticipated. A task that seemed settled could depend on another individual’s response, an additional check or a change in priority. The main effect could be a shift in workload pressure rather than the completion of everything currently pending.",
      action:
        "Set realistic priorities and communicate any constraints that affect delivery.",
      avoid:
        "Don't promise unrealistic completion times simply to accommodate additional requests.",
    },
    {
      summary:
        "A measured approach may help you navigate increased practical demands.",
      prediction:
        "A responsibility that appeared straightforward may require additional time, coordination or corrections. The pace of the day may be shaped by how routine responsibilities interact with one matter that needs closer attention. This may clarify which work item is genuinely moving and which still depends on factors outside your control.",
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
        "A pending task may progress, but interruptions or another request could slow its completion. The development may involve an existing assignment, an incoming request or a practical detail that affects the day schedule. The day may bring measurable progress on one responsibility while another remains dependent on timing or coordination.",
      action:
        "Protect time for an important task while leaving room for necessary changes.",
      avoid:
        "Avoid filling your entire schedule without allowing for unexpected responsibilities.",
    },
    {
      summary:
        "Balancing productivity with realistic expectations may be important today.",
      prediction:
        "You may clear part of your workload while discovering that another responsibility needs attention. A task that seemed settled could depend on another individual’s response, an additional check or a change in priority. The main effect could be a shift in workload pressure rather than the completion of everything currently pending.",
      action:
        "Choose the tasks that will make the greatest practical difference and organise your time accordingly.",
      avoid:
        "Don't mistake being busy for making meaningful progress.",
    },
    {
      summary:
        "Steady progress may depend on how effectively you manage today's practical demands.",
      prediction:
        "An existing task could move closer to completion, although competing priorities may change the day's pace. The pace of the day may be shaped by how routine responsibilities interact with one matter that needs closer attention. This may clarify which work item is genuinely moving and which still depends on factors outside your control.",
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
        "You may be asked to take ownership of an important task or make a decision that brings your judgement into view. The situation may involve expectations from a colleague, manager or client rather than a formal change in position. The moment may increase the visibility of your role without necessarily signalling a promotion or lasting change in authority.",
      action:
        "Take responsibility for an important task and establish a clear next step.",
      avoid:
        "Avoid accepting additional commitments without checking your capacity.",
    },
    {
      summary:
        "Your approach to professional responsibilities may strengthen confidence in your work.",
      prediction:
        "A manager, colleague or client may rely on you to handle a responsibility that requires dependable follow-through. A familiar workstream could suddenly require clearer ownership, coordination or a decision about who handles the next step. The development could clarify what others expect from you while leaving the scope of the responsibility open.",
      action:
        "Clarify expectations and deliver on a priority within your control.",
      avoid:
        "Don't assume that taking ownership means handling everything alone.",
    },
    {
      summary:
        "Greater responsibility may provide an opportunity to demonstrate leadership today.",
      prediction:
        "An opportunity to lead or coordinate an existing work priority may arise, giving your contribution greater visibility. The responsibility may be visible through an ordinary discussion or deliverable, even without any immediate change in title. This may be a test of professional judgement in an existing situation rather than a completely new opportunity.",
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
        "An additional responsibility may be placed on you before the resources or expectations are fully clear. The situation may involve expectations from a colleague, manager or client rather than a formal change in position. The moment may increase the visibility of your role without necessarily signalling a promotion or lasting change in authority.",
      action:
        "Clarify which responsibilities are most urgent and address them systematically.",
      avoid:
        "Avoid taking on every demand without reviewing its priority.",
    },
    {
      summary:
        "Professional accountability may bring additional pressure today.",
      prediction:
        "A work decision or deliverable may attract closer scrutiny, increasing the pressure around an existing commitment. A familiar workstream could suddenly require clearer ownership, coordination or a decision about who handles the next step. The development could clarify what others expect from you while leaving the scope of the responsibility open.",
      action:
        "Review the outstanding requirements and communicate any constraints clearly.",
      avoid:
        "Don't respond defensively when expectations or responsibilities are questioned.",
    },
    {
      summary:
        "Managing professional expectations may require a measured approach.",
      prediction:
        "Competing requests from others could leave you responsible for more than can reasonably be completed at once. The responsibility may be visible through an ordinary discussion or deliverable, even without any immediate change in title. This may be a test of professional judgement in an existing situation rather than a completely new opportunity.",
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
        "A new or expanded responsibility may create an opportunity to demonstrate reliability while adding pressure to your schedule. The situation may involve expectations from a colleague, manager or client rather than a formal change in position. The moment may increase the visibility of your role without necessarily signalling a promotion or lasting change in authority.",
      action:
        "Take ownership of the priority you can realistically advance.",
      avoid:
        "Avoid allowing increased responsibility to overwhelm your existing commitments.",
    },
    {
      summary:
        "Professional expectations may require a balance of initiative and practicality.",
      prediction:
        "You may be trusted with an important task, although its scope or deadline could require negotiation. A familiar workstream could suddenly require clearer ownership, coordination or a decision about who handles the next step. The development could clarify what others expect from you while leaving the scope of the responsibility open.",
      action:
        "Clarify expectations and organise the resources needed to deliver.",
      avoid:
        "Don't confuse accepting more responsibility with making greater progress.",
    },
    {
      summary:
        "Handling an important responsibility thoughtfully may support steady progress.",
      prediction:
        "An existing responsibility could gain visibility today, bringing both recognition of your role and higher expectations. The responsibility may be visible through an ordinary discussion or deliverable, even without any immediate change in title. This may be a test of professional judgement in an existing situation rather than a completely new opportunity.",
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
        "A conversation, message or development may open up a possible change in your role, responsibilities or working arrangement. This may emerge through a conversation, revised expectation or update about an option that has already been considered. The information may help define the next stage of a possible transition without making the outcome certain.",
      action:
        "Explore the practical implications of an emerging professional opportunity.",
      avoid:
        "Avoid assuming an encouraging development is already a confirmed change.",
    },
    {
      summary:
        "Professional change may offer an opportunity to explore a new direction.",
      prediction:
        "You may hear about an alternative professional direction or receive information that makes a transition more realistic. The development could relate to the practical terms of a possible transition rather than an immediate decision to move. The development could shift how realistic an option appears, while leaving a formal decision for another time.",
      action:
        "Gather the information needed to evaluate the potential change.",
      avoid:
        "Don't commit to a new direction before understanding its requirements.",
    },
    {
      summary:
        "Constructive movement may help clarify a possible professional transition.",
      prediction:
        "An existing opportunity for a role or work change could move a step closer through a useful discussion or update. An existing professional possibility may become easier to evaluate as another detail about timing or responsibilities emerges. This may be an intermediate step in a longer process rather than an immediate change in employment or role.",
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
        "A planned professional change may face a delay, objection or requirement that was not previously clear. This may emerge through a conversation, revised expectation or update about an option that has already been considered. The information may help define the next stage of a possible transition without making the outcome certain.",
      action:
        "Identify the main obstacle affecting the potential change.",
      avoid:
        "Avoid making an abrupt professional decision under temporary pressure.",
    },
    {
      summary:
        "An evolving work situation may require greater flexibility.",
      prediction:
        "News about a possible role or workplace change could be less definite than expected, leaving the next step uncertain. The development could relate to the practical terms of a possible transition rather than an immediate decision to move. The development could shift how realistic an option appears, while leaving a formal decision for another time.",
      action:
        "Clarify outstanding questions about the developing situation.",
      avoid:
        "Don't treat uncertainty as a reason to rush into a decision.",
    },
    {
      summary:
        "Careful planning may help you navigate an unsettled professional situation.",
      prediction:
        "A proposed transition may become more complicated when practical conditions or existing commitments come into view. An existing professional possibility may become easier to evaluate as another detail about timing or responsibilities emerges. This may be an intermediate step in a longer process rather than an immediate change in employment or role.",
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
        "A possible role or work change may show progress today, though timing or terms could still be unsettled. This may emerge through a conversation, revised expectation or update about an option that has already been considered. The information may help define the next stage of a possible transition without making the outcome certain.",
      action:
        "Explore the opportunity while clarifying the unresolved details.",
      avoid:
        "Avoid treating an emerging possibility as a settled outcome.",
    },
    {
      summary:
        "Professional developments may call for both initiative and patience.",
      prediction:
        "An encouraging professional conversation may open a door while leaving important conditions to be negotiated. The development could relate to the practical terms of a possible transition rather than an immediate decision to move. The development could shift how realistic an option appears, while leaving a formal decision for another time.",
      action:
        "Take a measured step toward understanding the potential transition.",
      avoid:
        "Don't overlook important conditions in the desire to move forward.",
    },
    {
      summary:
        "An evolving professional situation may require a balanced approach.",
      prediction:
        "You may receive a useful update about a career transition, but a final decision or arrangement may take longer. An existing professional possibility may become easier to evaluate as another detail about timing or responsibilities emerges. This may be an intermediate step in a longer process rather than an immediate change in employment or role.",
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
          "A pending work matter may move forward through a timely conversation, decision or completed task today. The matter may be one already on your desk, with progress depending on a response, decision or completed piece of work. The significance may be clearer direction on an existing priority, rather than a major professional breakthrough.",
        action:
          "Choose one important professional priority and move it forward.",
        avoid:
          "Avoid spreading your attention across too many work matters.",
        summary:
          "Your existing professional priorities offer an opportunity for practical progress today.",

      },
      {
        prediction:
          "You may receive a useful response on an existing professional priority, making the next step clearer. A familiar responsibility could become more prominent through a meeting, request or update from someone involved. This could help distinguish what is moving forward from what still requires another decision or response.",
        action:
          "Identify the task or conversation that would make the greatest practical difference.",
        avoid:
          "Don't create unnecessary urgency around matters that can develop steadily.",

summary:
  "A measured approach to your responsibilities may help bring greater direction to your work today.",
      },
      {
        prediction:
          "A routine work issue could present an opening to make progress or take initiative on something already underway. What changes today may be the clarity of the next step rather than the overall direction of your work. The outcome may be incremental but still useful because it makes the next phase of work easier to understand.",
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
      "A work matter may be delayed by competing expectations, an unanswered question or a practical obstacle. The matter may be one already on your desk, with progress depending on a response, decision or completed piece of work. The significance may be clearer direction on an existing priority, rather than a major professional breakthrough.",
    action:
      "Identify the most pressing professional responsibility and establish a practical next step.",
    avoid:
      "Avoid allowing competing demands to dictate your entire day.",
  },
  {
    summary:
      "A work-related challenge may call for patience and clearer priorities.",
    prediction:
      "An unexpected request or disagreement over priorities could make an existing professional task harder to complete. A familiar responsibility could become more prominent through a meeting, request or update from someone involved. This could help distinguish what is moving forward from what still requires another decision or response.",
    action:
      "Review your priorities and communicate any constraints clearly.",
    avoid:
      "Avoid making commitments simply to relieve immediate pressure.",
  },
  {
    summary:
      "Careful handling of professional responsibilities may help you navigate today's pressure.",
    prediction:
      "Progress on a work commitment may slow today while another person reviews or questions the next step. What changes today may be the clarity of the next step rather than the overall direction of your work. The outcome may be incremental but still useful because it makes the next phase of work easier to understand.",
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
      "A professional matter may show encouraging movement, though an additional request or condition could slow completion. The matter may be one already on your desk, with progress depending on a response, decision or completed piece of work. The significance may be clearer direction on an existing priority, rather than a major professional breakthrough.",
    action:
      "Separate the opportunities you can act on from matters that still need clarification.",
    avoid:
      "Avoid overlooking practical constraints while pursuing progress.",
  },
  {
    summary:
      "Balancing opportunity with existing responsibilities may be important today.",
    prediction:
      "A useful discussion at work may clarify part of a pending issue while leaving a practical detail unresolved. A familiar responsibility could become more prominent through a meeting, request or update from someone involved. This could help distinguish what is moving forward from what still requires another decision or response.",
    action:
      "Advance one important priority while keeping other commitments in view.",
    avoid:
      "Avoid taking on additional responsibilities without reviewing your capacity.",
  },
  {
    summary:
      "Steady progress at work may depend on managing competing priorities.",
    prediction:
      "You may advance an existing work priority today, but changing demands could affect how far it progresses. What changes today may be the clarity of the next step rather than the overall direction of your work. The outcome may be incremental but still useful because it makes the next phase of work easier to understand.",
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
          "A pending professional conversation or decision may receive a useful response today, moving an existing matter forward. The development could arrive through a follow-up, meeting or response from someone already involved in the matter. The progress may be genuine but partial, with a final outcome still dependent on another step or decision.",
        action:
          "Follow up on a relevant conversation or pending professional matter.",
        avoid:
          "Avoid overlooking a useful opening because it appears small.",
      },
      {
        prediction:
          "A colleague, manager or external contact may provide an update that creates momentum around a work priority. An existing professional discussion may become more concrete as another requirement or next step comes into view. This could improve the visibility of a professional opportunity without confirming its ultimate result.",
        action:
          "Identify the work matter where a timely follow-up could make a difference.",
        avoid:
          "Don't assume that progress will happen without your involvement.",
      },
      {
        prediction:
          "An important professional matter could advance through a meeting, follow-up or confirmation of the next step. The movement may be visible in communication or coordination before it becomes a completed result. The change may be in momentum and clarity rather than in a completed agreement or decision.",
        action:
          "Take one practical step to advance the professional matter already in motion.",
        avoid:
          "Avoid treating an encouraging development as a confirmed outcome.",
      },
    ],
    challenging: [
      {
        prediction:
          "An anticipated professional response may be delayed or come with an objection that requires further work. The development could arrive through a follow-up, meeting or response from someone already involved in the matter. The progress may be genuine but partial, with a final outcome still dependent on another step or decision.",
        action:
          "Clarify what is holding up the matter and address the most practical obstacle.",
        avoid:
          "Avoid forcing a decision before the relevant concerns are understood.",
      },
      {
        prediction:
          "Progress on a work matter could stall while someone else considers the decision or requests more information. An existing professional discussion may become more concrete as another requirement or next step comes into view. This could improve the visibility of a professional opportunity without confirming its ultimate result.",
        action:
          "Review your approach and identify where greater flexibility may help.",
        avoid:
          "Don't react defensively to a delay or change in direction.",
      },
      {
        prediction:
          "A developing professional opportunity may encounter a change in timing or expectations before it can advance. The movement may be visible in communication or coordination before it becomes a completed result. The change may be in momentum and clarity rather than in a completed agreement or decision.",
        action:
          "Follow up constructively and confirm the next agreed step.",
        avoid:
          "Avoid interpreting a slow response as a final decision.",
      },
    ],
    mixed: [
      {
        prediction:
          "A work-related conversation may bring progress, although another condition or approval could still be pending. The development could arrive through a follow-up, meeting or response from someone already involved in the matter. The progress may be genuine but partial, with a final outcome still dependent on another step or decision.",
        action:
          "Build on the progress available while clarifying what remains unresolved.",
        avoid:
          "Avoid committing to a direction before understanding the practical implications.",
      },
      {
        prediction:
          "An encouraging professional update may arrive alongside a request for further clarification or adjustment. An existing professional discussion may become more concrete as another requirement or next step comes into view. This could improve the visibility of a professional opportunity without confirming its ultimate result.",
        action:
          "Use the opportunity to move the discussion forward without rushing the outcome.",
        avoid:
          "Don't overlook outstanding concerns simply because momentum is improving.",
      },
      {
        prediction:
          "An existing work matter could move forward in stages today rather than reaching its final outcome. The movement may be visible in communication or coordination before it becomes a completed result. The change may be in momentum and clarity rather than in a completed agreement or decision.",
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
          "Someone at work may acknowledge a recent contribution or give your completed work greater visibility today. The attention may centre on a recent result, a decision you helped shape or work that others are now reviewing. The attention could influence how your work is understood, but it should not be equated with a confirmed reward.",
        action:
          "Communicate a relevant accomplishment clearly and factually.",
        avoid:
          "Avoid assuming others already know the extent of your contribution.",
      },
      {
        prediction:
          "A result, presentation or professional contribution may attract positive attention from someone whose opinion matters. Feedback could come through a meeting, a direct comment or a request to explain how a result was achieved. This may bring greater visibility alongside expectations that are still taking shape.",
        action:
          "Present your progress or completed work where it is relevant.",
        avoid:
          "Don't exaggerate results or promise more than you can deliver.",
      },
      {
        prediction:
          "You may receive encouraging feedback or an opportunity to demonstrate the value of work already completed. The situation may reveal how your contribution is being perceived, even if no formal reward or decision follows today. The moment may say more about the reception of your work than about any immediate change in position.",
        action:
          "Be prepared to explain the results and value of your work.",
        avoid:
          "Avoid letting an opportunity for visibility pass without preparation.",
      },
    ],
    challenging: [
      {
        prediction:
          "Your work may attract questions or scrutiny today, particularly around a result or decision that needs explanation. The attention may centre on a recent result, a decision you helped shape or work that others are now reviewing. The attention could influence how your work is understood, but it should not be equated with a confirmed reward.",
        action:
          "Prepare the facts behind your work and respond to feedback constructively.",
        avoid:
          "Avoid treating every question as criticism.",
      },
      {
        prediction:
          "A professional contribution could be reviewed more closely than expected, with feedback that feels demanding. Feedback could come through a meeting, a direct comment or a request to explain how a result was achieved. This may bring greater visibility alongside expectations that are still taking shape.",
        action:
          "Communicate your contribution accurately and address any gaps directly.",
        avoid:
          "Don't make commitments merely to satisfy immediate expectations.",
      },
      {
        prediction:
          "Increased attention from colleagues or management may bring pressure to justify a result or address a gap. The situation may reveal how your contribution is being perceived, even if no formal reward or decision follows today. The moment may say more about the reception of your work than about any immediate change in position.",
        action:
          "Focus on evidence, clarity and a measured professional response.",
        avoid:
          "Avoid reacting impulsively to feedback or comparison.",
      },
    ],
    mixed: [
      {
        prediction:
          "Your contribution may receive positive attention today, although it could also lead to new expectations. The attention may centre on a recent result, a decision you helped shape or work that others are now reviewing. The attention could influence how your work is understood, but it should not be equated with a confirmed reward.",
        action:
          "Highlight your contribution while remaining prepared for questions.",
        avoid:
          "Avoid confusing increased visibility with a confirmed reward.",
      },
      {
        prediction:
          "Feedback on your work may include appreciation alongside questions about what remains unfinished. Feedback could come through a meeting, a direct comment or a request to explain how a result was achieved. This may bring greater visibility alongside expectations that are still taking shape.",
        action:
          "Present your achievements clearly and remain open to constructive feedback.",
        avoid:
          "Don't let either praise or criticism distract from your priorities.",
      },
      {
        prediction:
          "An achievement may become more visible, but recognition could be accompanied by requests for further results. The situation may reveal how your contribution is being perceived, even if no formal reward or decision follows today. The moment may say more about the reception of your work than about any immediate change in position.",
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
          "A pending payment, reimbursement or expected receipt may show encouraging movement today. You could receive a response, confirmation of a next step or an indication that the matter is progressing. This points to forward movement rather than a guarantee that the funds will arrive immediately.",
        action:
          "Follow up on an outstanding payment or financial opportunity.",
        avoid:
          "Avoid making spending commitments before funds are confirmed.",
      },
      {
        prediction:
          "You may receive a useful update about money owed to you or an existing financial opportunity. A conversation, message or status change could make the next step clearer, particularly if you have been waiting for a response. The update may be encouraging, but the amount and timing should still be verified.",
        action:
          "Review incoming financial developments and confirm the details.",
        avoid:
          "Don't assume that promising developments guarantee immediate payment.",
      },
      {
        prediction:
          "An expected financial receipt or opportunity could move closer to confirmation, improving clarity about available funds. You may learn more about when a payment can be expected or what remains to be completed. This could help you plan more confidently, even if the money has not yet reached your account.",
        action:
          "Check the status of pending receipts and organise your next steps.",
        avoid:
          "Avoid allocating money that hasn't yet reached you.",
      },
    ],

    challenging: [
      {
        prediction:
          "An expected payment may be delayed or require an additional document, approval or follow-up. A response could reveal a missing step or a longer timeline than anticipated. The important distinction today may be between a payment that is still progressing and one that is actually ready to be received.",
        action:
          "Check outstanding payments and clarify any pending requirements.",
        avoid:
          "Avoid relying on an expected receipt to meet an immediate commitment.",
      },
      {
        prediction:
          "A financial receipt you were counting on could take longer than anticipated or arrive with conditions. You may need to clarify a timeline, deduction or requirement before treating the amount as available. This does not necessarily mean the opportunity is lost, but it may affect what you can safely plan around today.",
        action:
          "Contact the relevant person or organisation about pending funds.",
        avoid:
          "Don't overlook conditions, deductions or unresolved obligations.",
      },
      {
        prediction:
          "An update about incoming money may reveal a timing issue, deduction or requirement that needs attention. A payment you expected to be straightforward could involve another confirmation or follow-up. You may gain useful clarity about the obstacle today, even if resolving it takes longer.",
        action:
          "Review the timeline and documentation for an outstanding payment.",
        avoid:
          "Avoid making financial assumptions before receiving confirmation.",
      },
    ],

    mixed: [
  {
    prediction:
      "An expected payment may move forward today, although its timing or final amount could still need confirmation. A message, follow-up or change in status could show that the matter is progressing. Treat this as a useful step toward clarity rather than proof that the full amount is ready to use.",
    action:
      "Check the status of pending payments and clarify any outstanding details.",
    avoid:
      "Don't count on funds being available until the receipt is confirmed.",
  },
  {
    prediction:
      "A financial opportunity may show encouraging signs, but an outstanding condition could delay the outcome. You may hear something positive about a pending receipt or financial arrangement while also learning that a further step is needed. The day may therefore bring progress in understanding the opportunity without completing it.",
    action:
      "Identify what's still pending and take one concrete step to move the matter forward.",
    avoid:
      "Avoid committing additional money or resources before the terms are clear.",
  },
  {
    prediction:
      "You may receive a useful update about incoming funds without the receipt itself being fully settled. A response, status change or follow-up could clarify whether an expected payment is moving forward and what remains outstanding. This looks more like progress toward certainty than a completed receipt, so any financial decision should reflect what has actually been confirmed.",
    action:
      "Review expected receipts, confirm what is actually available and prioritise your next financial decision.",
    avoid:
      "Don't make commitments based on estimated income or an unconfirmed payment.",
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