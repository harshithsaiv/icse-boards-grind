// Julius Caesar Acts III, IV, V — Static data for ICSE English Literature

export interface JCScene {
  id: string;
  act: number;
  scene: number;
  title: string;
  summary: string;
  keyEvents: string[];
  videoUrl?: string;
}

export interface JCCharacter {
  id: string;
  name: string;
  role: string;
  traits: string[];
  significance: string;
  keyQuotes: { quote: string; context: string }[];
}

export interface JCFlashcard {
  id: string;
  quote: string;
  speaker: string;
  act: number;
  scene: number;
  context: string;
  significance: string;
}

export interface JCQuote {
  id: string;
  quote: string;
  correctSpeaker: string;
  options: string[];
  act: number;
  scene: number;
}

export interface JCMCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ─── SCENES ────────────────────────────────────────────────

export const JC_SCENES: JCScene[] = [
  {
    id: "3-1",
    act: 3,
    scene: 1,
    title: "The Assassination of Caesar",
    summary:
      "Caesar arrives at the Capitol. The conspirators surround him under the pretense of petitioning for Metellus Cimber's banished brother. When Caesar refuses, they stab him one by one. Brutus delivers the final blow, prompting Caesar's famous words. Antony arrives, feigns allegiance to the conspirators, and secretly plans revenge. He requests permission to speak at Caesar's funeral.",
    keyEvents: [
      "Artemidorus and the Soothsayer try to warn Caesar but fail",
      "Metellus Cimber petitions Caesar as a distraction",
      "Caesar is stabbed by the conspirators — 'Et tu, Brute?'",
      "Brutus allows Antony to speak at the funeral (against Cassius's advice)",
      "Antony's soliloquy reveals his true intent: 'Cry Havoc and let slip the dogs of war'",
    ],
    videoUrl: "/videos/Caesar_s_Assassination_and_Antony_s_Revenge.mp4",
  },
  {
    id: "3-2",
    act: 3,
    scene: 2,
    title: "The Funeral Speeches",
    summary:
      "Brutus addresses the Roman citizens first, explaining that he killed Caesar out of love for Rome, not hatred for Caesar. The crowd is initially persuaded. Then Antony delivers his masterful speech, using irony, rhetoric, and Caesar's will to turn the mob against the conspirators. The citizens riot and seek revenge.",
    keyEvents: [
      "Brutus's logical speech: 'Not that I loved Caesar less, but that I loved Rome more'",
      "The crowd initially supports Brutus and calls him noble",
      "Antony's speech uses irony: 'Brutus is an honourable man'",
      "Antony reveals Caesar's will — 75 drachmas to each citizen and public gardens",
      "The mob turns violent and goes to burn the conspirators' houses",
    ],
    videoUrl: "/videos/Antony_s_Speech_Turns_Mob.mp4",
  },
  {
    id: "3-3",
    act: 3,
    scene: 3,
    title: "The Death of Cinna the Poet",
    summary:
      "An innocent poet named Cinna is mistaken for Cinna the conspirator by the enraged mob. Despite his protests, they attack and kill him. This scene shows the dangerous, irrational nature of mob violence unleashed by Antony's speech.",
    keyEvents: [
      "Cinna the Poet is confronted by angry citizens",
      "He is mistaken for Cinna the conspirator",
      "The mob kills him despite his pleas of innocence",
      "Demonstrates the chaos and blind fury of the mob",
    ],
    videoUrl: "/videos/Cinna_s_Tragic_Death_by_Mob.mp4",
  },
  {
    id: "4-1",
    act: 4,
    scene: 1,
    title: "The Triumvirate's Cold Calculations",
    summary:
      "Antony, Octavius, and Lepidus form the Second Triumvirate. They coldly draw up a list of political enemies to be executed (proscription). Antony reveals his manipulative nature by planning to reduce Lepidus's power, comparing him to a horse that must be trained. They also discuss altering Caesar's will to divert funds.",
    keyEvents: [
      "The triumvirs create a death list — Antony agrees to sacrifice his nephew",
      "Lepidus agrees to his brother's death in exchange",
      "Antony dismisses Lepidus as a 'slight, unmeritable man'",
      "Plans to modify Caesar's will to fund their army",
      "They prepare for war against Brutus and Cassius",
    ],
    videoUrl: "/videos/Triumvirate_Cold_Calculations.mp4",
  },
  {
    id: "4-2",
    act: 4,
    scene: 2,
    title: "Tension Between Brutus and Cassius",
    summary:
      "Brutus waits for Cassius at his camp near Sardis. Cassius arrives and immediately expresses displeasure, saying Brutus has wronged him. Brutus insists they discuss their grievances privately inside his tent, setting up the famous quarrel scene.",
    keyEvents: [
      "Lucilius reports that Cassius's reception was less warm than before",
      "Cassius arrives and accuses Brutus of wronging him",
      "Brutus insists they speak privately — 'Before the eyes of both our armies'",
      "Transition to the quarrel scene inside the tent",
    ],
    videoUrl: "/videos/Brutus_Cassius_Quarrel.mp4",
  },
  {
    id: "4-3",
    act: 4,
    scene: 3,
    title: "The Quarrel and Ghost of Caesar",
    summary:
      "Inside the tent, Brutus accuses Cassius of corruption and taking bribes. Cassius is hurt and offers his dagger to Brutus in a dramatic gesture. They reconcile. Brutus reveals Portia's death (she swallowed fire). They debate military strategy — Brutus insists on marching to Philippi rather than waiting. That night, Caesar's ghost appears to Brutus, warning 'Thou shalt see me at Philippi.'",
    keyEvents: [
      "Brutus accuses Cassius of taking bribes and selling offices",
      "Cassius dramatically offers his bare breast to Brutus's dagger",
      "They reconcile — 'I did not think you could have been so angry'",
      "Brutus reveals Portia has died by swallowing fire",
      "Brutus overrules Cassius — army will march to Philippi",
      "Caesar's ghost appears: 'Thou shalt see me at Philippi'",
    ],
    videoUrl: "/videos/Portia_Death_Caesar_Ghost.mp4",
  },
  {
    id: "5-1",
    act: 5,
    scene: 1,
    title: "The Parley Before Battle",
    summary:
      "On the plains of Philippi, the two sides meet for a parley before battle. Antony and Octavius exchange taunts with Brutus and Cassius. Both sides know this may be the final confrontation. Cassius, normally not superstitious, mentions ominous signs. Brutus and Cassius bid each other a poignant farewell, acknowledging they may never meet again alive.",
    keyEvents: [
      "Octavius and Antony note the enemy has come to them (validating Brutus's strategy failed)",
      "Heated exchange of insults between both sides",
      "Cassius mentions ill omens — eagles replaced by crows and kites",
      "Brutus and Cassius share an emotional potential farewell",
      "Brutus declares he will not be led captive through Rome's streets",
    ],
  },
  {
    id: "5-2",
    act: 5,
    scene: 2,
    title: "Brutus's Attack",
    summary:
      "The battle begins. Brutus sends Messala with orders to attack Octavius's wing, which appears weak. This is a brief transition scene showing the start of active combat.",
    keyEvents: [
      "Brutus orders an attack on Octavius's forces",
      "He believes Octavius's wing is vulnerable",
      "Messala carries the battle orders",
    ],
  },
  {
    id: "5-3",
    act: 5,
    scene: 3,
    title: "The Death of Cassius",
    summary:
      "While Brutus's forces initially succeed against Octavius, Cassius's forces are overwhelmed by Antony. Cassius, seeing his camp on fire and believing his friend Titinius has been captured, falls into despair. He asks his servant Pindarus to kill him with the same sword that killed Caesar. Ironically, Titinius was actually being greeted by friendly forces. Titinius, finding Cassius dead, kills himself too.",
    keyEvents: [
      "Cassius's forces are losing to Antony's army",
      "Pindarus misreports that Titinius has been captured",
      "Cassius asks Pindarus to kill him — 'Caesar, thou art revenged'",
      "Titinius discovers Cassius's body and kills himself with Cassius's sword",
      "Brutus mourns: 'O Julius Caesar, thou art mighty yet!'",
    ],
  },
  {
    id: "5-4",
    act: 5,
    scene: 4,
    title: "Young Cato's Bravery",
    summary:
      "Young Cato (Brutus's brother-in-law) fights bravely, declaring his identity and his father's name. He is killed in battle. Lucilius impersonates Brutus to protect him and is captured by Antony's soldiers. Antony recognizes the deception but treats Lucilius well, valuing his loyalty.",
    keyEvents: [
      "Young Cato fights bravely and is killed",
      "Lucilius pretends to be Brutus and is captured",
      "Antony recognises Lucilius and respects his loyalty",
      "Antony orders Lucilius be treated well as a potential future friend",
    ],
  },
  {
    id: "5-5",
    act: 5,
    scene: 5,
    title: "The Death of Brutus",
    summary:
      "Brutus, knowing the battle is lost, asks his companions one by one to hold his sword so he can run upon it. They all refuse. Finally, his servant Strato agrees to hold the sword. Brutus runs on it with the words 'Caesar, now be still.' Octavius and Antony find his body. Antony delivers the famous eulogy: 'This was the noblest Roman of them all,' acknowledging that Brutus alone acted out of genuine concern for Rome.",
    keyEvents: [
      "Brutus asks Clitus, Dardanius, and Volumnius to help him die — all refuse",
      "Strato holds the sword for Brutus: 'Caesar, now be still'",
      "Caesar's ghost has been fully avenged",
      "Antony's eulogy: 'This was the noblest Roman of them all'",
      "Octavius orders Brutus be buried with full honours",
    ],
  },
];

// ─── CHARACTERS ────────────────────────────────────────────

export const JC_CHARACTERS: JCCharacter[] = [
  {
    id: "brutus",
    name: "Marcus Brutus",
    role: "Leader of the conspirators; Roman senator and idealist",
    traits: ["Honourable", "Idealistic", "Naive", "Stoic", "Patriotic"],
    significance:
      "The tragic hero of the play. Brutus joins the conspiracy purely out of love for Rome, not personal ambition. His nobility becomes his fatal flaw — he trusts Antony, allows him to speak at the funeral, and makes poor military decisions. His internal conflict between friendship and duty drives the play's tragedy.",
    keyQuotes: [
      { quote: "Not that I loved Caesar less, but that I loved Rome more.", context: "Funeral speech (Act III, Sc 2)" },
      { quote: "Et tu, Brute?", context: "Caesar's last words to Brutus (Act III, Sc 1)" },
      { quote: "There is a tide in the affairs of men, which taken at the flood, leads on to fortune.", context: "Arguing for marching to Philippi (Act IV, Sc 3)" },
      { quote: "Caesar, now be still. I killed not thee with half so good a will.", context: "His dying words (Act V, Sc 5)" },
    ],
  },
  {
    id: "cassius",
    name: "Caius Cassius",
    role: "Chief instigator of the conspiracy; skilled manipulator",
    traits: ["Shrewd", "Envious", "Passionate", "Practical", "Loyal to Brutus"],
    significance:
      "Cassius initiates the conspiracy out of personal envy and political fear. He is the practical strategist who correctly advises killing Antony and not letting him speak at the funeral. Despite his flaws, he shows genuine friendship with Brutus in their quarrel and reconciliation. His misjudgement at Philippi leads to his tragic suicide.",
    keyQuotes: [
      { quote: "The fault, dear Brutus, is not in our stars, but in ourselves, that we are underlings.", context: "Persuading Brutus to join the conspiracy (Act I)" },
      { quote: "A friend should bear his friend's infirmities, but Brutus makes mine greater than they are.", context: "Quarrel scene (Act IV, Sc 3)" },
      { quote: "Caesar, thou art revenged, even with the sword that killed thee.", context: "His dying words (Act V, Sc 3)" },
    ],
  },
  {
    id: "antony",
    name: "Mark Antony",
    role: "Caesar's loyal friend; member of the Second Triumvirate",
    traits: ["Eloquent", "Cunning", "Loyal", "Manipulative", "Ruthless"],
    significance:
      "Antony transforms from a seemingly harmless friend of Caesar into a masterful political operator. His funeral speech is a turning point that destroys the conspirators' cause. He uses rhetoric, emotion, and Caesar's will to manipulate the mob. In Act IV, he shows ruthlessness in the proscription scene, revealing a calculating politician beneath the grief.",
    keyQuotes: [
      { quote: "Friends, Romans, countrymen, lend me your ears; I come to bury Caesar, not to praise him.", context: "Beginning of funeral speech (Act III, Sc 2)" },
      { quote: "But Brutus says he was ambitious, and Brutus is an honourable man.", context: "Ironic refrain in funeral speech (Act III, Sc 2)" },
      { quote: "Cry 'Havoc!' and let slip the dogs of war.", context: "Soliloquy over Caesar's body (Act III, Sc 1)" },
      { quote: "This was the noblest Roman of them all.", context: "Eulogy for Brutus (Act V, Sc 5)" },
    ],
  },
  {
    id: "caesar",
    name: "Julius Caesar",
    role: "Dictator of Rome; the assassination target",
    traits: ["Ambitious", "Arrogant", "Superstitious", "Brave", "Proud"],
    significance:
      "Though he dies in Act III Scene 1, Caesar's spirit dominates the rest of the play. His ghost appears to Brutus, and the conspirators are haunted by the consequences of his murder. The question of whether he was truly a tyrant or a great leader remains central.",
    keyQuotes: [
      { quote: "Et tu, Brute? Then fall, Caesar.", context: "His dying words (Act III, Sc 1)" },
      { quote: "Cowards die many times before their deaths; the valiant never taste of death but once.", context: "To Calpurnia (Act II)" },
      { quote: "I am constant as the northern star.", context: "Refusing to pardon Metellus Cimber's brother (Act III, Sc 1)" },
    ],
  },
  {
    id: "portia",
    name: "Portia",
    role: "Wife of Brutus; daughter of Cato",
    traits: ["Devoted", "Brave", "Intelligent", "Anxious", "Loyal"],
    significance:
      "Portia represents the personal cost of political idealism. She senses Brutus's turmoil and proves her strength by wounding herself to show she can bear secrets. Her death by swallowing fire (reported in Act IV, Sc 3) symbolises the devastating toll the conspiracy takes on those closest to Brutus.",
    keyQuotes: [
      { quote: "I have a man's mind but a woman's might.", context: "Expressing anxiety about the plot (Act II)" },
    ],
  },
  {
    id: "calpurnia",
    name: "Calpurnia",
    role: "Wife of Julius Caesar",
    traits: ["Intuitive", "Caring", "Superstitious", "Devoted"],
    significance:
      "Calpurnia's prophetic dream of Caesar's statue spouting blood foreshadows his assassination. She begs Caesar not to go to the Senate, representing the voice of caution and domestic concern that Caesar ultimately ignores. Her fear contrasts with Caesar's public bravado.",
    keyQuotes: [
      { quote: "When beggars die, there are no comets seen; the heavens themselves blaze forth the death of princes.", context: "Begging Caesar to stay home (Act II)" },
    ],
  },
  {
    id: "octavius",
    name: "Octavius Caesar",
    role: "Caesar's adopted heir; member of the Second Triumvirate",
    traits: ["Calculating", "Authoritative", "Cold", "Determined", "Ambitious"],
    significance:
      "Octavius appears in the later acts as a young but assertive political figure. He challenges Antony's authority and insists on making his own decisions in battle. His ordered treatment of Brutus's body with honour hints at the statesmanship that will make him Rome's first Emperor (Augustus).",
    keyQuotes: [
      { quote: "I do not cross you; but I will do so.", context: "Asserting authority against Antony at Philippi (Act V, Sc 1)" },
      { quote: "According to his virtue let us use him, with all respect and rites of burial.", context: "Ordering Brutus's honourable burial (Act V, Sc 5)" },
    ],
  },
];

// ─── FLASHCARDS ────────────────────────────────────────────

export const JC_FLASHCARDS: JCFlashcard[] = [
  {
    id: "fc-1",
    quote: "Et tu, Brute? Then fall, Caesar.",
    speaker: "Julius Caesar",
    act: 3, scene: 1,
    context: "Caesar's last words upon seeing Brutus among his assassins.",
    significance: "Expresses Caesar's shock and betrayal. The Latin phrase has become synonymous with ultimate betrayal by a trusted friend.",
  },
  {
    id: "fc-2",
    quote: "Cry 'Havoc!' and let slip the dogs of war.",
    speaker: "Mark Antony",
    act: 3, scene: 1,
    context: "Antony's soliloquy after the conspirators leave Caesar's body.",
    significance: "Reveals Antony's true intent — he plans to unleash civil war to avenge Caesar. Metaphor of dogs represents uncontrollable violence.",
  },
  {
    id: "fc-3",
    quote: "Not that I loved Caesar less, but that I loved Rome more.",
    speaker: "Brutus",
    act: 3, scene: 2,
    context: "Brutus's funeral speech justifying the assassination.",
    significance: "Encapsulates Brutus's idealism — he frames the murder as a patriotic sacrifice, prioritising the republic over personal loyalty.",
  },
  {
    id: "fc-4",
    quote: "Friends, Romans, countrymen, lend me your ears; I come to bury Caesar, not to praise him.",
    speaker: "Mark Antony",
    act: 3, scene: 2,
    context: "Opening of Antony's funeral speech.",
    significance: "Masterful rhetoric — Antony claims humility while actually planning to praise Caesar and turn the crowd against the conspirators.",
  },
  {
    id: "fc-5",
    quote: "The evil that men do lives after them; the good is oft interred with their bones.",
    speaker: "Mark Antony",
    act: 3, scene: 2,
    context: "Early in Antony's funeral speech.",
    significance: "Ironic — Antony says this while doing the opposite: reviving Caesar's good deeds in the crowd's memory to provoke sympathy.",
  },
  {
    id: "fc-6",
    quote: "But Brutus says he was ambitious, and Brutus is an honourable man.",
    speaker: "Mark Antony",
    act: 3, scene: 2,
    context: "Repeated refrain throughout Antony's speech.",
    significance: "Dramatic irony and rhetorical device — each repetition drips with more sarcasm, gradually undermining Brutus's credibility.",
  },
  {
    id: "fc-7",
    quote: "You all did love him once, not without cause. What cause withholds you then to mourn for him?",
    speaker: "Mark Antony",
    act: 3, scene: 2,
    context: "Antony appeals to the crowd's former love for Caesar.",
    significance: "Emotional manipulation — forces the crowd to confront their own fickleness and guilt.",
  },
  {
    id: "fc-8",
    quote: "If you have tears, prepare to shed them now.",
    speaker: "Mark Antony",
    act: 3, scene: 2,
    context: "Antony displays Caesar's blood-stained cloak to the crowd.",
    significance: "Shifts from logic to raw emotion. Uses the physical evidence of Caesar's murder to provoke grief and rage.",
  },
  {
    id: "fc-9",
    quote: "O, what a fall was there, my countrymen! Then I, and you, and all of us fell down, whilst bloody treason flourished over us.",
    speaker: "Mark Antony",
    act: 3, scene: 2,
    context: "Antony describes the moment of Caesar's death.",
    significance: "Unites himself with the crowd ('all of us fell down') and explicitly labels the assassination as 'treason' for the first time.",
  },
  {
    id: "fc-10",
    quote: "I am no orator, as Brutus is; but as you know me all, a plain blunt man.",
    speaker: "Mark Antony",
    act: 3, scene: 2,
    context: "Antony claims to be a simple, honest speaker.",
    significance: "Supreme irony — Antony is the most skilled orator in the play. This false modesty makes his manipulation even more effective.",
  },
  {
    id: "fc-11",
    quote: "Here was a Caesar! When comes such another?",
    speaker: "Mark Antony",
    act: 3, scene: 2,
    context: "Near the climax of Antony's funeral speech.",
    significance: "Elevates Caesar to legendary status, implying Rome has lost an irreplaceable leader — directly contradicting Brutus's claim.",
  },
  {
    id: "fc-12",
    quote: "Mischief, thou art afoot. Take thou what course thou wilt.",
    speaker: "Mark Antony",
    act: 3, scene: 2,
    context: "Antony's aside after the crowd rushes off to riot.",
    significance: "Reveals Antony's calculated nature — he has deliberately unleashed chaos and is satisfied with the result.",
  },
  {
    id: "fc-13",
    quote: "He shall not live; look, with a spot I damn him.",
    speaker: "Mark Antony",
    act: 4, scene: 1,
    context: "The triumvirs marking names for execution (proscription).",
    significance: "Shows Antony's ruthless political side — casually sentencing people to death, a stark contrast to his emotional funeral speech.",
  },
  {
    id: "fc-14",
    quote: "This is a slight, unmeritable man, meet to be sent on errands.",
    speaker: "Mark Antony",
    act: 4, scene: 1,
    context: "Antony describes Lepidus after he leaves.",
    significance: "Reveals Antony's contempt for his ally Lepidus, showing his Machiavellian nature — he uses people as tools.",
  },
  {
    id: "fc-15",
    quote: "A friend should bear his friend's infirmities, but Brutus makes mine greater than they are.",
    speaker: "Cassius",
    act: 4, scene: 3,
    context: "The quarrel between Brutus and Cassius.",
    significance: "Shows the strain in their friendship. Cassius feels Brutus is being unfairly harsh and self-righteous.",
  },
  {
    id: "fc-16",
    quote: "I did not think you could have been so angry.",
    speaker: "Cassius",
    act: 4, scene: 3,
    context: "During the reconciliation after the quarrel.",
    significance: "Shows Cassius's more vulnerable side and his genuine surprise at Brutus's fury.",
  },
  {
    id: "fc-17",
    quote: "There is a tide in the affairs of men, which taken at the flood, leads on to fortune.",
    speaker: "Brutus",
    act: 4, scene: 3,
    context: "Brutus argues for marching to Philippi immediately.",
    significance: "Famous metaphor about seizing opportunities. Ironically, Brutus's decision to march proves to be a military blunder.",
  },
  {
    id: "fc-18",
    quote: "Thou shalt see me at Philippi.",
    speaker: "Ghost of Caesar",
    act: 4, scene: 3,
    context: "The ghost of Caesar appears to Brutus at night.",
    significance: "Supernatural warning of Brutus's doom. Caesar's spirit will not rest until avenged — the ghost represents Brutus's guilt and fate.",
  },
  {
    id: "fc-19",
    quote: "O Julius Caesar, thou art mighty yet! Thy spirit walks abroad and turns our swords in our own proper entrails.",
    speaker: "Brutus",
    act: 5, scene: 3,
    context: "Brutus upon learning of Cassius's death at Philippi.",
    significance: "Acknowledges that Caesar's influence persists beyond death. The conspirators are being destroyed by the consequences of their own actions.",
  },
  {
    id: "fc-20",
    quote: "The last of all the Romans, fare thee well!",
    speaker: "Brutus",
    act: 5, scene: 3,
    context: "Brutus mourning over Cassius's body.",
    significance: "Brutus honours Cassius as the last true Roman, recognising their shared values even after their quarrel.",
  },
  {
    id: "fc-21",
    quote: "Caesar, thou art revenged, even with the sword that killed thee.",
    speaker: "Cassius",
    act: 5, scene: 3,
    context: "Cassius's dying words as Pindarus kills him.",
    significance: "Poetic justice — Cassius dies by the same sword used to kill Caesar, completing a cycle of violence and retribution.",
  },
  {
    id: "fc-22",
    quote: "Caesar, now be still. I killed not thee with half so good a will.",
    speaker: "Brutus",
    act: 5, scene: 5,
    context: "Brutus's dying words as he runs on his sword.",
    significance: "Brutus finds more willingness in ending his own life than in killing Caesar, showing his enduring guilt and nobility.",
  },
  {
    id: "fc-23",
    quote: "This was the noblest Roman of them all.",
    speaker: "Mark Antony",
    act: 5, scene: 5,
    context: "Antony's eulogy upon finding Brutus's body.",
    significance: "Even Brutus's enemy acknowledges his nobility. Antony recognises that Brutus alone acted from genuine civic virtue, not envy.",
  },
  {
    id: "fc-24",
    quote: "All the conspirators save only he did that they did in envy of great Caesar.",
    speaker: "Mark Antony",
    act: 5, scene: 5,
    context: "Continuation of Antony's eulogy for Brutus.",
    significance: "Distinguishes Brutus from the other conspirators — he acted for the 'general good', making him the play's tragic hero.",
  },
  {
    id: "fc-25",
    quote: "His life was gentle, and the elements so mixed in him that Nature might stand up and say to all the world, 'This was a man!'",
    speaker: "Mark Antony",
    act: 5, scene: 5,
    context: "The final tribute to Brutus.",
    significance: "The play's closing assessment of Brutus — a perfectly balanced human being whose virtue was his undoing. One of Shakespeare's most famous epitaphs.",
  },
  {
    id: "fc-26",
    quote: "I am constant as the northern star, of whose true-fixed and resting quality there is no fellow in the firmament.",
    speaker: "Julius Caesar",
    act: 3, scene: 1,
    context: "Caesar refuses to overturn the banishment of Publius Cimber.",
    significance: "Caesar compares himself to the immovable North Star — ironically, moments before he is 'moved' by daggers. Shows his arrogance and rigidity.",
  },
  {
    id: "fc-27",
    quote: "O, pardon me, thou bleeding piece of earth, that I am meek and gentle with these butchers.",
    speaker: "Mark Antony",
    act: 3, scene: 1,
    context: "Antony addresses Caesar's corpse after the conspirators leave.",
    significance: "Reveals Antony's grief and rage. He apologises to Caesar for appearing friendly to his killers, foreshadowing his revenge.",
  },
  {
    id: "fc-28",
    quote: "Ambition's debt is paid.",
    speaker: "Brutus",
    act: 3, scene: 1,
    context: "Immediately after Caesar's assassination.",
    significance: "Brutus frames the murder as justice — Caesar's ambition has been punished. Reveals Brutus's conviction that the act was righteous.",
  },
  {
    id: "fc-29",
    quote: "Had I as many eyes as thou hast wounds, weeping as fast as they stream forth thy blood, it would become me better than to close in terms of friendship with thine enemies.",
    speaker: "Mark Antony",
    act: 3, scene: 1,
    context: "Antony speaking to Caesar's corpse.",
    significance: "Powerful imagery showing Antony's grief. Suggests he would rather weep blood than befriend the conspirators.",
  },
  {
    id: "fc-30",
    quote: "I do not cross you; but I will do so.",
    speaker: "Octavius",
    act: 5, scene: 1,
    context: "Octavius asserting his authority against Antony before battle.",
    significance: "Shows Octavius's independence and foreshadows his eventual dominance over Antony as future Emperor Augustus.",
  },
  {
    id: "fc-31",
    quote: "If we do meet again, why, we shall smile; if not, why then this parting was well made.",
    speaker: "Brutus",
    act: 5, scene: 1,
    context: "Brutus and Cassius bid farewell before the Battle of Philippi.",
    significance: "A poignant and stoic farewell. Both men sense they may die, showing dignity and mutual respect despite earlier quarrels.",
  },
  {
    id: "fc-32",
    quote: "No, Cassius, no. Think not, thou noble Roman, that ever Brutus will go bound to Rome; he bears too great a mind.",
    speaker: "Brutus",
    act: 5, scene: 1,
    context: "Brutus declares he will never be captured and paraded.",
    significance: "Shows Brutus's Roman pride — he would rather die than suffer the humiliation of being led as a prisoner. Foreshadows his suicide.",
  },
  {
    id: "fc-33",
    quote: "Statilius showed the torchlight, but, my lord, he came not back. He is or ta'en or slain.",
    speaker: "Messala",
    act: 5, scene: 5,
    context: "Reports during the losing battle at Philippi.",
    significance: "Builds the atmosphere of doom and defeat around Brutus in his final moments.",
  },
  {
    id: "fc-34",
    quote: "According to his virtue let us use him, with all respect and rites of burial.",
    speaker: "Octavius",
    act: 5, scene: 5,
    context: "Octavius orders Brutus's honourable burial.",
    significance: "Shows magnanimity in victory. Octavius recognises Brutus's virtue and ensures he receives a dignified end.",
  },
  {
    id: "fc-35",
    quote: "I shall have glory by this losing day, more than Octavius and Mark Antony by this vile conquest shall attain unto.",
    speaker: "Brutus",
    act: 5, scene: 5,
    context: "Brutus speaks before his death, accepting defeat.",
    significance: "Brutus believes moral victory outlasts military victory — his honour in defeat surpasses the conquerors' glory. Proves prophetic given Antony's eulogy.",
  },
];

// ─── QUOTE IDENTIFIER ─────────────────────────────────────

export const JC_QUOTES: JCQuote[] = [
  { id: "q-1", quote: "Et tu, Brute? Then fall, Caesar.", correctSpeaker: "Julius Caesar", options: ["Julius Caesar", "Mark Antony", "Brutus", "Cassius"], act: 3, scene: 1 },
  { id: "q-2", quote: "Cry 'Havoc!' and let slip the dogs of war.", correctSpeaker: "Mark Antony", options: ["Mark Antony", "Brutus", "Cassius", "Octavius"], act: 3, scene: 1 },
  { id: "q-3", quote: "Not that I loved Caesar less, but that I loved Rome more.", correctSpeaker: "Brutus", options: ["Brutus", "Cassius", "Mark Antony", "Octavius"], act: 3, scene: 2 },
  { id: "q-4", quote: "Friends, Romans, countrymen, lend me your ears.", correctSpeaker: "Mark Antony", options: ["Mark Antony", "Brutus", "Julius Caesar", "Cassius"], act: 3, scene: 2 },
  { id: "q-5", quote: "The evil that men do lives after them; the good is oft interred with their bones.", correctSpeaker: "Mark Antony", options: ["Mark Antony", "Brutus", "Cassius", "Julius Caesar"], act: 3, scene: 2 },
  { id: "q-6", quote: "But Brutus says he was ambitious, and Brutus is an honourable man.", correctSpeaker: "Mark Antony", options: ["Mark Antony", "Cassius", "Brutus", "Octavius"], act: 3, scene: 2 },
  { id: "q-7", quote: "If you have tears, prepare to shed them now.", correctSpeaker: "Mark Antony", options: ["Mark Antony", "Brutus", "Cassius", "Julius Caesar"], act: 3, scene: 2 },
  { id: "q-8", quote: "I am no orator, as Brutus is; but as you know me all, a plain blunt man.", correctSpeaker: "Mark Antony", options: ["Mark Antony", "Cassius", "Brutus", "Lepidus"], act: 3, scene: 2 },
  { id: "q-9", quote: "Mischief, thou art afoot. Take thou what course thou wilt.", correctSpeaker: "Mark Antony", options: ["Mark Antony", "Brutus", "Cassius", "Octavius"], act: 3, scene: 2 },
  { id: "q-10", quote: "He shall not live; look, with a spot I damn him.", correctSpeaker: "Mark Antony", options: ["Mark Antony", "Octavius", "Cassius", "Brutus"], act: 4, scene: 1 },
  { id: "q-11", quote: "This is a slight, unmeritable man, meet to be sent on errands.", correctSpeaker: "Mark Antony", options: ["Mark Antony", "Brutus", "Cassius", "Octavius"], act: 4, scene: 1 },
  { id: "q-12", quote: "A friend should bear his friend's infirmities, but Brutus makes mine greater than they are.", correctSpeaker: "Cassius", options: ["Cassius", "Brutus", "Mark Antony", "Lepidus"], act: 4, scene: 3 },
  { id: "q-13", quote: "There is a tide in the affairs of men, which taken at the flood, leads on to fortune.", correctSpeaker: "Brutus", options: ["Brutus", "Cassius", "Mark Antony", "Julius Caesar"], act: 4, scene: 3 },
  { id: "q-14", quote: "Thou shalt see me at Philippi.", correctSpeaker: "Ghost of Caesar", options: ["Ghost of Caesar", "Brutus", "Cassius", "Mark Antony"], act: 4, scene: 3 },
  { id: "q-15", quote: "O Julius Caesar, thou art mighty yet!", correctSpeaker: "Brutus", options: ["Brutus", "Cassius", "Mark Antony", "Octavius"], act: 5, scene: 3 },
  { id: "q-16", quote: "The last of all the Romans, fare thee well!", correctSpeaker: "Brutus", options: ["Brutus", "Mark Antony", "Octavius", "Titinius"], act: 5, scene: 3 },
  { id: "q-17", quote: "Caesar, thou art revenged, even with the sword that killed thee.", correctSpeaker: "Cassius", options: ["Cassius", "Brutus", "Mark Antony", "Pindarus"], act: 5, scene: 3 },
  { id: "q-18", quote: "Caesar, now be still. I killed not thee with half so good a will.", correctSpeaker: "Brutus", options: ["Brutus", "Cassius", "Mark Antony", "Strato"], act: 5, scene: 5 },
  { id: "q-19", quote: "This was the noblest Roman of them all.", correctSpeaker: "Mark Antony", options: ["Mark Antony", "Octavius", "Brutus", "Cassius"], act: 5, scene: 5 },
  { id: "q-20", quote: "I am constant as the northern star.", correctSpeaker: "Julius Caesar", options: ["Julius Caesar", "Brutus", "Cassius", "Mark Antony"], act: 3, scene: 1 },
  { id: "q-21", quote: "O, pardon me, thou bleeding piece of earth, that I am meek and gentle with these butchers.", correctSpeaker: "Mark Antony", options: ["Mark Antony", "Brutus", "Cassius", "Octavius"], act: 3, scene: 1 },
  { id: "q-22", quote: "Ambition's debt is paid.", correctSpeaker: "Brutus", options: ["Brutus", "Cassius", "Mark Antony", "Julius Caesar"], act: 3, scene: 1 },
  { id: "q-23", quote: "I do not cross you; but I will do so.", correctSpeaker: "Octavius", options: ["Octavius", "Mark Antony", "Brutus", "Cassius"], act: 5, scene: 1 },
  { id: "q-24", quote: "If we do meet again, why, we shall smile; if not, why then this parting was well made.", correctSpeaker: "Brutus", options: ["Brutus", "Cassius", "Mark Antony", "Octavius"], act: 5, scene: 1 },
  { id: "q-25", quote: "According to his virtue let us use him, with all respect and rites of burial.", correctSpeaker: "Octavius", options: ["Octavius", "Mark Antony", "Brutus", "Strato"], act: 5, scene: 5 },
];

// ─── MCQ QUIZ ──────────────────────────────────────────────

export const JC_MCQ_QUESTIONS: JCMCQQuestion[] = [
  {
    id: "mcq-1",
    question: "Who speaks the words 'Et tu, Brute?' and what do they signify?",
    options: [
      "Caesar — shock and betrayal at Brutus's participation in the assassination",
      "Antony — grief upon finding Caesar's body",
      "Cassius — anger at Brutus during their quarrel",
      "Brutus — guilt after the assassination",
    ],
    correctIndex: 0,
    explanation: "Caesar utters these famous Latin words ('And you, Brutus?') upon seeing Brutus among his assassins, expressing his ultimate sense of betrayal by his trusted friend.",
  },
  {
    id: "mcq-2",
    question: "What rhetorical device does Antony primarily use in his funeral speech?",
    options: [
      "Irony — repeatedly calling Brutus 'honourable' while undermining him",
      "Metaphor — comparing Caesar to a mighty oak tree",
      "Alliteration — using repeated consonant sounds for emphasis",
      "Hyperbole — exaggerating Caesar's military achievements",
    ],
    correctIndex: 0,
    explanation: "Antony's refrain 'Brutus is an honourable man' is deeply ironic. Each repetition becomes more sarcastic, gradually turning the crowd against Brutus without directly attacking him.",
  },
  {
    id: "mcq-3",
    question: "Why does Brutus allow Antony to speak at Caesar's funeral?",
    options: [
      "He naively trusts Antony and believes showing mercy will prove their cause is just",
      "Antony threatens to expose the conspiracy if not allowed to speak",
      "The Roman Senate orders that Antony must be given speaking time",
      "Cassius convinces Brutus that Antony's speech will help their cause",
    ],
    correctIndex: 0,
    explanation: "Brutus's fatal error stems from his idealism — he believes Antony is harmless and that allowing him to speak shows the conspirators' fairness. Cassius correctly opposed this decision.",
  },
  {
    id: "mcq-4",
    question: "What does Antony reveal to the crowd from Caesar's will?",
    options: [
      "Caesar left 75 drachmas to every citizen and his private gardens as public parks",
      "Caesar named Brutus as his heir to the Roman throne",
      "Caesar wished for the Senate to continue ruling Rome",
      "Caesar left all his wealth to the Roman army",
    ],
    correctIndex: 0,
    explanation: "Antony uses the will as his most powerful weapon — Caesar's generosity to ordinary citizens contradicts Brutus's claim of tyrannical ambition and provokes outrage at his murder.",
  },
  {
    id: "mcq-5",
    question: "What happens to Cinna the Poet in Act III, Scene 3?",
    options: [
      "He is killed by the mob who mistake him for Cinna the conspirator",
      "He writes a poem praising the conspirators and is arrested",
      "He delivers a speech defending Caesar and is exiled",
      "He joins Antony's forces after witnessing the riot",
    ],
    correctIndex: 0,
    explanation: "The innocent poet is killed simply because he shares a name with one of the conspirators. This scene demonstrates the irrational, destructive power of mob violence.",
  },
  {
    id: "mcq-6",
    question: "In Act IV, Scene 1, what does Antony compare Lepidus to?",
    options: [
      "A horse that must be trained, fed, and directed",
      "A loyal dog that follows its master",
      "A weak branch that will break under pressure",
      "A child who needs constant supervision",
    ],
    correctIndex: 0,
    explanation: "Antony dismisses Lepidus as a 'slight, unmeritable man' and compares him to a horse — useful as a beast of burden but not worthy of shared power. This reveals Antony's manipulative nature.",
  },
  {
    id: "mcq-7",
    question: "What is the main cause of the quarrel between Brutus and Cassius in Act IV, Scene 3?",
    options: [
      "Brutus accuses Cassius of taking bribes and selling offices for gold",
      "Cassius blames Brutus for allowing Antony to speak at the funeral",
      "They disagree about whether to ally with Octavius",
      "Brutus discovers that Cassius planned to betray him",
    ],
    correctIndex: 0,
    explanation: "Brutus, the strict idealist, is outraged that Cassius has engaged in corruption — accepting bribes and selling appointments. For Brutus, this undermines the very principles they killed Caesar to protect.",
  },
  {
    id: "mcq-8",
    question: "How does Portia die?",
    options: [
      "She swallows fire (hot coals) while in a state of grief and anxiety",
      "She is killed by Antony's soldiers during a raid",
      "She takes poison upon hearing of Brutus's defeat",
      "She dies of illness during the siege of Sardis",
    ],
    correctIndex: 0,
    explanation: "Brutus reveals in the quarrel scene that Portia 'swallowed fire' — a horrifying method showing the extreme toll the conspiracy took on those closest to the conspirators.",
  },
  {
    id: "mcq-9",
    question: "What military decision does Brutus insist upon against Cassius's advice?",
    options: [
      "Marching to Philippi to meet the enemy rather than waiting at Sardis",
      "Splitting their forces to attack from two sides",
      "Negotiating a peace treaty with Antony and Octavius",
      "Retreating to Greece to gather more troops",
    ],
    correctIndex: 0,
    explanation: "Brutus argues there is 'a tide in the affairs of men' and they must seize the moment. Cassius wanted to wait and let the enemy come to them. Brutus's decision proves strategically flawed.",
  },
  {
    id: "mcq-10",
    question: "What does the Ghost of Caesar say to Brutus?",
    options: [
      "'Thou shalt see me at Philippi' — warning of Brutus's doom",
      "'Beware the Ides of March' — repeating the Soothsayer's warning",
      "'Your cause is lost, surrender now'",
      "'Avenge my death or face eternal torment'",
    ],
    correctIndex: 0,
    explanation: "The ghost's cryptic warning foreshadows Brutus's defeat and death at Philippi. It represents both the supernatural and Brutus's guilty conscience.",
  },
  {
    id: "mcq-11",
    question: "Why does Cassius kill himself at Philippi?",
    options: [
      "He mistakenly believes his friend Titinius has been captured by the enemy",
      "He is surrounded by enemy soldiers with no escape",
      "He receives a fatal wound in battle and asks Pindarus to finish him",
      "He learns that Brutus has already been killed",
    ],
    correctIndex: 0,
    explanation: "Pindarus misreports from a distance that Titinius has been captured. In reality, Titinius was being crowned with a victory garland by friendly forces. Cassius's death is a tragic misunderstanding.",
  },
  {
    id: "mcq-12",
    question: "What is ironic about Cassius's death?",
    options: [
      "He dies with the same sword that killed Caesar, on his birthday",
      "He is killed by Mark Antony, whom he spared",
      "He dies thinking they won the battle when they actually lost",
      "He is betrayed by Brutus, just as they betrayed Caesar",
    ],
    correctIndex: 0,
    explanation: "Cassius dies by the very sword he used to stab Caesar, and it happens to be his birthday — a deeply ironic twist showing the cyclical nature of violence and fate in the play.",
  },
  {
    id: "mcq-13",
    question: "Who holds the sword for Brutus when he dies?",
    options: [
      "Strato — his servant, after others refuse",
      "Cassius — who dies alongside him",
      "Lucilius — his loyal officer",
      "Volumnius — his childhood friend",
    ],
    correctIndex: 0,
    explanation: "Brutus asks Clitus, Dardanius, and Volumnius to help him die, but they all refuse out of love. Only Strato, his servant, agrees to hold the sword while Brutus runs upon it.",
  },
  {
    id: "mcq-14",
    question: "What does Antony mean when he says 'This was the noblest Roman of them all'?",
    options: [
      "Brutus was the only conspirator who acted from genuine civic duty, not envy",
      "Brutus was the strongest warrior in the Roman army",
      "Brutus was the wealthiest and most powerful senator",
      "Brutus showed the most courage in battle at Philippi",
    ],
    correctIndex: 0,
    explanation: "Antony recognises that while other conspirators acted out of personal jealousy, Brutus alone killed Caesar for the 'common good.' This makes him a tragic hero rather than a villain.",
  },
  {
    id: "mcq-15",
    question: "How does Brutus's funeral speech differ from Antony's in style?",
    options: [
      "Brutus uses logical prose; Antony uses emotional verse with rhetorical devices",
      "Brutus speaks in poetry; Antony uses simple everyday language",
      "Brutus appeals to emotions; Antony appeals to logic and reason",
      "Both speeches use identical rhetorical strategies",
    ],
    correctIndex: 0,
    explanation: "Brutus speaks in measured prose, appealing to reason ('Had you rather Caesar were living and die all slaves?'). Antony uses verse, irony, props (cloak, will), and emotional manipulation.",
  },
  {
    id: "mcq-16",
    question: "What does the phrase 'Ambition's debt is paid' mean in context?",
    options: [
      "Caesar has paid the price for his ambition — his death is justice",
      "The conspirators owe a debt to Rome for their ambitions",
      "Antony must now pay for his ambitious plans",
      "The Roman Senate has been compensated for Caesar's power grab",
    ],
    correctIndex: 0,
    explanation: "Brutus speaks these words right after the assassination, framing it as righteous punishment — Caesar's political ambition has been 'paid for' with his life.",
  },
  {
    id: "mcq-17",
    question: "What ominous signs does Cassius observe before the Battle of Philippi?",
    options: [
      "Eagles that followed their army are replaced by ravens, crows, and kites",
      "A violent thunderstorm destroys their camp",
      "The river runs red, symbolising bloodshed",
      "An earthquake shakes the ground beneath their feet",
    ],
    correctIndex: 0,
    explanation: "Cassius, who is normally not superstitious, notes that the eagles (symbols of Roman power) have been replaced by scavenger birds — an omen of death and defeat.",
  },
  {
    id: "mcq-18",
    question: "Why does Lucilius pretend to be Brutus in Act V?",
    options: [
      "To protect the real Brutus by diverting enemy soldiers",
      "To negotiate a surrender with Antony on Brutus's behalf",
      "To spy on Antony's camp and report back",
      "To trick Antony into thinking Brutus is already dead",
    ],
    correctIndex: 0,
    explanation: "Lucilius impersonates Brutus and offers to be killed, showing extraordinary loyalty. Antony recognises the deception but is so impressed he orders Lucilius treated well.",
  },
  {
    id: "mcq-19",
    question: "What is the significance of Caesar declaring himself 'constant as the northern star'?",
    options: [
      "It shows his arrogance and is ironic because he is killed moments later",
      "It demonstrates his wisdom and far-sighted leadership",
      "It reveals his humility in comparing himself to nature",
      "It shows his superstitious belief in astrology",
    ],
    correctIndex: 0,
    explanation: "Caesar's comparison to the immovable North Star demonstrates his hubris. The irony is devastating — the 'constant' Caesar is moved from life to death within moments.",
  },
  {
    id: "mcq-20",
    question: "Why does Cassius dramatically offer his dagger to Brutus during their quarrel?",
    options: [
      "He is emotionally overwhelmed and would rather die than lose Brutus's friendship",
      "He is challenging Brutus to a duel to settle their argument",
      "He wants to prove the dagger is the same one used to kill Caesar",
      "He is testing whether Brutus would actually kill him",
    ],
    correctIndex: 0,
    explanation: "Cassius's gesture is driven by wounded pride and genuine love for Brutus. He bares his chest and says if Brutus hates him so much, he should strike. This leads to their emotional reconciliation.",
  },
  {
    id: "mcq-21",
    question: "Extract: 'O, what a fall was there, my countrymen! Then I, and you, and all of us fell down.' What technique does Antony use here?",
    options: [
      "Inclusive language ('I, and you, and all of us') to unite himself with the crowd against the conspirators",
      "Metaphor comparing Caesar's fall to a natural disaster",
      "Hyperbole to exaggerate the impact of Caesar's death",
      "Alliteration to create a musical, memorable phrase",
    ],
    correctIndex: 0,
    explanation: "By saying 'all of us fell down,' Antony implies that Caesar's death diminished every Roman citizen. This inclusive language makes the crowd feel personally wronged by the assassination.",
  },
  {
    id: "mcq-22",
    question: "What does Antony's aside 'Mischief, thou art afoot' reveal about his character?",
    options: [
      "He deliberately incited the mob and is satisfied with the chaos he created",
      "He regrets that the crowd has become violent and uncontrollable",
      "He fears the mob will turn against him next",
      "He is surprised by the crowd's extreme reaction to his speech",
    ],
    correctIndex: 0,
    explanation: "This aside reveals Antony's true nature — he is not the 'plain blunt man' he claimed to be but a shrewd manipulator who intentionally unleashed mob violence as a political weapon.",
  },
  {
    id: "mcq-23",
    question: "Why is Brutus considered the tragic hero of the play?",
    options: [
      "He has noble intentions but his idealism and poor judgement lead to his downfall",
      "He is the strongest warrior who dies heroically in battle",
      "He is the most popular character who is loved by all Romans",
      "He successfully saves Rome from Caesar's tyranny",
    ],
    correctIndex: 0,
    explanation: "Brutus fits the definition of a tragic hero — a noble character whose fatal flaw (excessive idealism, naivety) causes his downfall. He kills Caesar for Rome but his errors lead to civil war and his own death.",
  },
  {
    id: "mcq-24",
    question: "What is the dramatic significance of Caesar's ghost appearing to Brutus?",
    options: [
      "It symbolises Brutus's guilt and foreshadows his defeat — Caesar's spirit will be avenged",
      "It shows that Caesar has forgiven Brutus for the assassination",
      "It is merely a hallucination caused by Brutus's sleeplessness",
      "It represents the gods warning Brutus to surrender",
    ],
    correctIndex: 0,
    explanation: "The ghost serves multiple purposes: it's a supernatural omen of doom, a manifestation of Brutus's guilty conscience, and a reminder that Caesar's influence extends beyond death.",
  },
  {
    id: "mcq-25",
    question: "How does Octavius assert his independence from Antony?",
    options: [
      "He insists on taking the right side of the battlefield against Antony's orders",
      "He refuses to participate in the proscription",
      "He publicly criticises Antony's funeral speech",
      "He allies with Brutus against Antony",
    ],
    correctIndex: 0,
    explanation: "When Antony orders Octavius to the left, Octavius replies 'I do not cross you; but I will do so' — calmly asserting his authority and hinting at the power struggle to come.",
  },
  {
    id: "mcq-26",
    question: "What is the significance of Titinius's death?",
    options: [
      "He kills himself upon finding Cassius dead — showing the devastating chain of misunderstanding",
      "He is killed in battle, inspiring Brutus to fight harder",
      "He is executed by Antony's forces as a prisoner of war",
      "He dies of grief after hearing about Caesar's assassination",
    ],
    correctIndex: 0,
    explanation: "Titinius's suicide after finding Cassius dead is deeply tragic — Cassius killed himself based on a false report about Titinius. The chain of misunderstanding compounds the tragedy.",
  },
  {
    id: "mcq-27",
    question: "Extract: 'There is a tide in the affairs of men...' What literary device is this?",
    options: [
      "Extended metaphor — comparing human opportunity to ocean tides",
      "Simile — directly comparing men to the sea",
      "Personification — giving human qualities to the tide",
      "Onomatopoeia — using words that sound like water",
    ],
    correctIndex: 0,
    explanation: "Brutus uses an extended metaphor comparing life's opportunities to ocean tides — if you catch the 'flood' (high tide), you succeed; if you miss it, you're 'bound in shallows.'",
  },
  {
    id: "mcq-28",
    question: "Why does Brutus say 'I shall have glory by this losing day'?",
    options: [
      "He believes his moral integrity in defeat is more glorious than the victors' ruthless conquest",
      "He expects to win the battle at the last moment",
      "He thinks his death will inspire future revolutions",
      "He is delirious and not thinking clearly",
    ],
    correctIndex: 0,
    explanation: "Brutus values honour over military victory. He believes that dying for one's principles is more glorious than winning through treachery — and Antony's eulogy ultimately proves him right.",
  },
  {
    id: "mcq-29",
    question: "What does 'the elements so mixed in him' mean in Antony's eulogy for Brutus?",
    options: [
      "Brutus had a perfectly balanced character — the four humours were in harmony",
      "Brutus was confused and conflicted about his decisions",
      "Brutus was made of different elements that fought against each other",
      "Brutus could adapt to any situation like a chameleon",
    ],
    correctIndex: 0,
    explanation: "In Elizabethan thought, personality was governed by four humours (elements). Antony says Brutus's elements were perfectly 'mixed' — he was a balanced, complete human being.",
  },
  {
    id: "mcq-30",
    question: "How does Shakespeare portray the Roman mob in Act III?",
    options: [
      "As fickle and easily manipulated — they shift loyalty from Brutus to Antony within minutes",
      "As intelligent citizens who carefully weigh both speeches",
      "As loyal supporters of the Republic who reject both speakers",
      "As pacifists who refuse to take sides in the political conflict",
    ],
    correctIndex: 0,
    explanation: "The mob's rapid shift from 'Let him be Caesar' (for Brutus) to 'Burn the conspirators!' shows Shakespeare's cynical view of crowd psychology — they are swayed by emotion, not reason.",
  },
  {
    id: "mcq-31",
    question: "What role does the proscription scene (Act IV, Scene 1) play in the plot?",
    options: [
      "It reveals the triumvirs' ruthlessness, showing they are no better than the tyrants they replaced",
      "It shows that Antony, Octavius, and Lepidus are merciful and just rulers",
      "It demonstrates that democracy has been restored to Rome",
      "It proves that Caesar's death has brought peace to Rome",
    ],
    correctIndex: 0,
    explanation: "The proscription scene is deeply ironic — the men who avenged Caesar's death are themselves tyrannical, casually trading family members' lives. It undermines the idea that any side held moral high ground.",
  },
  {
    id: "mcq-32",
    question: "What does Brutus's stoic reaction to Portia's death reveal about his character?",
    options: [
      "He suppresses his grief to maintain composure as a leader — showing stoic Roman values",
      "He did not truly love Portia and is indifferent to her death",
      "He blames Portia for the conspiracy's failure",
      "He has become emotionally numb from too much violence",
    ],
    correctIndex: 0,
    explanation: "Brutus's restrained reaction shows his stoic philosophy — he believes a Roman leader must control his emotions. However, his later vulnerability (the quarrel, ghost scene) suggests deep inner pain.",
  },
  {
    id: "mcq-33",
    question: "Why is the phrase 'honourable man' considered an example of verbal irony?",
    options: [
      "Antony says 'honourable' but means the opposite — each repetition makes it more sarcastic",
      "The crowd genuinely believes Brutus is honourable throughout the speech",
      "Brutus actually is honourable, so it is not ironic at all",
      "Antony is being sincere but the crowd misunderstands him",
    ],
    correctIndex: 0,
    explanation: "Verbal irony occurs when the intended meaning is opposite to the literal meaning. Antony's repeated 'honourable man' starts neutral but becomes increasingly sarcastic as he piles up evidence of Caesar's generosity.",
  },
  {
    id: "mcq-34",
    question: "What is the significance of Brutus speaking in prose and Antony in verse?",
    options: [
      "Prose reflects Brutus's rational, logical approach; verse reflects Antony's emotional, poetic appeal",
      "Prose shows Brutus is uneducated; verse shows Antony is more cultured",
      "There is no difference — both use the same style",
      "Prose is used for villains; verse is used for heroes",
    ],
    correctIndex: 0,
    explanation: "Shakespeare deliberately uses prose for Brutus (appealing to reason) and verse for Antony (appealing to emotion). This stylistic choice reinforces the contrast between their rhetorical strategies.",
  },
  {
    id: "mcq-35",
    question: "Why does Brutus refuse to be taken prisoner and led through Rome?",
    options: [
      "Roman honour demands he die free rather than suffer the humiliation of a triumphal procession",
      "He fears being tortured for information about remaining conspirators",
      "He believes prisoners are executed immediately in Rome",
      "He wants to deny Antony the satisfaction of a public trial",
    ],
    correctIndex: 0,
    explanation: "Brutus declares he 'bears too great a mind' to be led captive. In Roman culture, defeated enemies were paraded through Rome in a 'triumph.' Brutus considers death preferable to such dishonour.",
  },
  {
    id: "mcq-36",
    question: "What is the central theme of Julius Caesar as shown in Acts III-V?",
    options: [
      "The conflict between idealism and political reality, and the devastating consequences of political violence",
      "The glory of war and the honour of dying in battle",
      "The superiority of democracy over dictatorship",
      "The importance of loyalty to one's friends above all else",
    ],
    correctIndex: 0,
    explanation: "The play examines how noble intentions (Brutus's idealism) collide with political reality (Antony's manipulation), and how political violence creates a cycle of destruction that consumes everyone involved.",
  },
  {
    id: "mcq-37",
    question: "Extract: 'Had I as many eyes as thou hast wounds, weeping as fast as they stream forth thy blood...' What figure of speech is used?",
    options: [
      "Hyperbole — Antony exaggerates to express his overwhelming grief for Caesar",
      "Simile — he compares his eyes to Caesar's wounds",
      "Understatement — he minimises his grief deliberately",
      "Oxymoron — he combines contradictory ideas",
    ],
    correctIndex: 0,
    explanation: "Antony uses hyperbole (deliberate exaggeration) — wishing he had as many weeping eyes as Caesar has wounds is impossible but powerfully conveys the depth of his sorrow.",
  },
  {
    id: "mcq-38",
    question: "How does the play end?",
    options: [
      "Octavius orders Brutus's honourable burial, and Antony delivers the 'noblest Roman' eulogy",
      "Antony becomes sole ruler of Rome and executes all remaining conspirators",
      "The Roman Senate restores the Republic after both sides are defeated",
      "Octavius and Antony divide the Roman Empire between themselves",
    ],
    correctIndex: 0,
    explanation: "The play ends with a note of reconciliation — even victors honour the fallen. Antony's eulogy and Octavius's order for a dignified burial elevate Brutus's legacy above mere political defeat.",
  },
  {
    id: "mcq-39",
    question: "What does Cassius mean by 'I did not think you could have been so angry'?",
    options: [
      "He is genuinely surprised by the intensity of Brutus's rage, showing their friendship matters deeply to him",
      "He is mocking Brutus for being emotional and irrational",
      "He is afraid that Brutus will kill him in anger",
      "He believes Brutus is pretending to be angry to test him",
    ],
    correctIndex: 0,
    explanation: "This line reveals Cassius's vulnerability. Despite being the tough, practical manipulator, he is genuinely hurt and surprised by Brutus's fury, showing how much he values their friendship.",
  },
  {
    id: "mcq-40",
    question: "Why is Brutus's decision to march to Philippi considered a critical error?",
    options: [
      "It gives up their defensive advantage — the enemy was weakening and coming to them would have tired their forces",
      "Philippi was too far away and the march exhausted his troops",
      "He had fewer soldiers than Cassius and could not afford to split forces",
      "The terrain at Philippi was unfavourable for his cavalry",
    ],
    correctIndex: 0,
    explanation: "Cassius argued they should stay at Sardis and let the enemy exhaust themselves marching. By going to Philippi, Brutus abandoned this advantage. The irony is that his famous 'tide' metaphor led to a poor strategic decision.",
  },
];
