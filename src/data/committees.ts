export type Committee = {
  id: string;
  index: number;
  code: string;
  name: string;
  category: string;
  format: string;
  size: number;
  agenda: string;
  shortAgenda: string;
  image: string;
  confidential?: boolean;
};

export const committees: Committee[] = [
  {
    id: 'specpol', index: 1, code: 'SPECPOL', name: 'SPECPOL', category: 'General Assembly', format: 'Single Delegate', size: 40,
    agenda: 'The Question of Western Sahara (Security Council Report)',
    shortAgenda: 'The Question of Western Sahara', image: '/committees/specpol.png',
  },
  {
    id: 'unga', index: 2, code: 'UNGA', name: 'United Nations General Assembly', category: 'General Assembly', format: 'Single Delegate', size: 50,
    agenda: 'The Principle of Self-Defence under Article 51 of the United Nations Charter (United Nations Legal Affairs)',
    shortAgenda: 'The Principle of Self-Defence', image: '/committees/unga.png',
  },
  {
    id: 'unhrc', index: 3, code: 'UNHRC', name: 'United Nations Human Rights Council', category: 'General Assembly', format: 'Single Delegate', size: 50,
    agenda: 'The Protection of Journalists under International Humanitarian Law',
    shortAgenda: 'The Protection of Journalists', image: '/committees/unhrc.png',
  },
  {
    id: 'h-unsc', index: 4, code: 'H-UNSC', name: 'Historical United Nations Security Council', category: 'Semi-Crisis', format: 'Double Delegate', size: 40,
    agenda: 'The Yom Kippur War, 1973: Preventing Regional Escalation and Direct Superpower Confrontation in the Middle East',
    shortAgenda: 'The Yom Kippur War, 1973', image: '/committees/h-unsc.png',
  },
  {
    id: 'disec', index: 5, code: 'DISEC', name: 'Disarmament and International Security Committee', category: 'General Assembly', format: 'Single Delegate', size: 40,
    agenda: 'The Regulation of Anti-Satellite Weapons in light of the Outer Space Treaty (OST) of 1967',
    shortAgenda: 'Regulating Anti-Satellite Weapons', image: '/committees/disec.png',
  },
  {
    id: 'fatf', index: 6, code: 'FATF', name: 'Financial Action Task Force', category: 'Specialized Committee', format: 'Single Delegate', size: 35,
    agenda: 'The Financial Crime Risks of Alternative Cross-Border Payment Systems amid De-Dollarization (FATF)',
    shortAgenda: 'Financial Crime & De-Dollarization', image: '/committees/fatf.png',
  },
  {
    id: 'interpol', index: 7, code: 'INTERPOL', name: 'INTERPOL', category: 'Specialized Committee', format: 'Single Delegate', size: 35,
    agenda: 'Operation Shadow Storm: Dismantling the Global Scam-Centre Network',
    shortAgenda: 'Operation Shadow Storm', image: '/committees/interpol.png',
  },
  {
    id: 'lok-sabha', index: 8, code: 'LOK SABHA', name: 'Lok Sabha', category: 'Indian Parliament', format: 'Single Delegate', size: 35,
    agenda: 'Reviewing the Implementation of the National Education Policy, 2020',
    shortAgenda: 'Reviewing the National Education Policy', image: '/committees/lok-sabha.png',
  },
  {
    id: 'ipc', index: 9, code: 'IPC', name: 'International Press Corps', category: 'Press', format: 'Single Delegate', size: 20,
    agenda: 'Press Freedom and the Protection of Journalists in Armed Conflict Zones',
    shortAgenda: 'Press Freedom in Conflict Zones', image: '/committees/ipc.png',
  },
  {
    id: 'alea-iacta-est', index: 10, code: 'ALEA IACTA EST', name: 'Alea Iacta Est: The Rubicon Crossing', category: 'JCC', format: 'Single Delegate', size: 40,
    agenda: 'Caesar Crosses the Rubicon: The Final Struggle for the Roman Republic',
    shortAgenda: 'Caesar Crosses the Rubicon', image: '/committees/jcc-rubicon.png',
  },
  {
    id: 'committee-x', index: 11, code: 'COMMITTEE X', name: 'Committee X', category: '', format: '', size: 0,
    agenda: '', shortAgenda: '', image: '/committees/committee-x.png', confidential: true,
  },
  {
    id: 'us-senate', index: 12, code: 'US SENATE', name: 'United States Senate', category: 'Regional Legislature', format: 'Single Delegate', size: 25,
    agenda: 'U.S. Policy toward Greenland: Arctic Security, Greenlandic Self-Determination, and the Future of U.S.-Danish Relations (commonslibrary.parliament.uk)',
    shortAgenda: 'U.S. Policy toward Greenland', image: '/committees/us-senate.png',
  },
];
