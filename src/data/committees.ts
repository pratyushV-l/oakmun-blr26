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
  description: string;
  image: string;
  executiveBoard: { name: string; role: string }[];
  freezeDate?: string;
  confidential?: boolean;
};

export const committees: Committee[] = [
  {
    id: 'specpol', index: 1, code: 'SPECPOL', name: 'SPECPOL', category: 'General Assembly', format: 'Single Delegate', size: 40,
    agenda: 'The Question of Western Sahara',
    shortAgenda: 'The Question of Western Sahara',
    description: 'SPECPOL is the General Assembly’s forum for questions of political decolonisation and special political concern. Delegates will balance self-determination, territorial integrity, regional stability, and the role of multilateral institutions.', image: '/committees/specpol.png',
    executiveBoard: [{ name: 'Nikunj Gupta', role: 'Crisis Director' }],
  },
  {
    id: 'unga', index: 2, code: 'UNGA', name: 'United Nations General Assembly', category: 'General Assembly', format: 'Single Delegate', size: 50,
    agenda: 'The Principle of Self-Defence under Article 51 of the United Nations Charter',
    shortAgenda: 'The Principle of Self-Defence',
    description: 'The United Nations General Assembly is the UN’s principal deliberative body, bringing every Member State into the same room. This committee asks delegates to navigate the legal, political, and humanitarian limits of self-defence under the UN Charter.', image: '/committees/unga.png',
    executiveBoard: [
      { name: 'Aditya Kannan', role: 'Chair' },
      { name: 'Rohan FK', role: 'Vice-Chair' },
      { name: 'Lakshya Shree', role: 'Vice-Chair / Co-Chair' },
      { name: 'Veer Pandey', role: 'Moderator' },
    ],
  },
  {
    id: 'unhrc', index: 3, code: 'UNHRC', name: 'United Nations Human Rights Council', category: 'General Assembly', format: 'Single Delegate', size: 50,
    agenda: 'The Protection of Refugees and Asylum Seekers amid Rising Border Restrictions and the Principle of Non-Refoulement',
    shortAgenda: 'The Protection of Refugees and Asylum Seekers',
    description: 'UNHRC examines the protection and promotion of human rights worldwide. Delegates will consider how international humanitarian law, accountability mechanisms, and state responsibility can protect journalists working in conflict zones.', image: '/committees/unhrc.png',
    executiveBoard: [
      { name: 'Oudeer Srin', role: 'Chair' },
      { name: 'Arul S', role: 'Co-Chair' },
      { name: 'Ahiri Banerjee', role: 'Vice-Chair' },
      { name: 'Tejashree', role: 'Moderator' },
    ],
  },
  {
    id: 'h-unsc', index: 4, code: 'H-UNSC', name: 'Historical United Nations Security Council', category: 'Semi-Crisis', format: 'Double Delegate', size: 40,
    agenda: 'The Situation in the Occupied Arab Territories, with Special Reference to the Golan Heights',
    shortAgenda: 'The Situation in the Occupied Arab Territories',
    description: 'The Historical UNSC examines the situation in the occupied Arab territories, with special reference to the Golan Heights. Delegates must navigate territorial claims, regional security, international law, and the competing pressures of the Cold War.',
    image: '/committees/h-unsc.png',
    freezeDate: '17 December 1981',
    executiveBoard: [
      { name: 'Joel Thomas', role: 'Co-Chair' },
      { name: 'Dhruv Bajaj', role: 'Co-Chair' },
    ],
  },
  {
    id: 'disec', index: 5, code: 'DISEC', name: 'Disarmament and International Security Committee', category: 'General Assembly', format: 'Single Delegate', size: 40,
    agenda: 'The Regulation of Anti-Satellite Weapons in light of the Outer Space Treaty (OST) of 1967',
    shortAgenda: 'Regulating Anti-Satellite Weapons',
    description: 'DISEC is the First Committee of the General Assembly, focused on disarmament and international security. Delegates will confront the growing military use of outer space and explore safeguards for security, verification, and peaceful access.', image: '/committees/disec.png',
    executiveBoard: [
      { name: 'Kavin Sharaf', role: 'Co-Chair' },
      { name: 'Adeeb', role: 'Co-Chair' },
      { name: 'Tarun Shanmukha', role: 'Vice-Chair' },
    ],
  },
  {
    id: 'fatf', index: 6, code: 'FATF', name: 'Financial Action Task Force', category: 'Specialized Committee', format: 'Single Delegate', size: 35,
    agenda: 'The Financial Crime Risks of Alternative Cross-Border Payment Systems amid De-Dollarization',
    shortAgenda: 'Financial Crime & De-Dollarization',
    description: 'FATF is an intergovernmental body that sets global standards to combat money laundering and terrorist financing. Delegates will assess how changing cross-border payment systems can support financial inclusion while creating new risks for illicit finance.', image: '/committees/fatf.png',
    executiveBoard: [
      { name: 'Snehi Banerjee', role: 'Chair' },
      { name: 'Yug Singh', role: 'Co-Chair' },
      { name: 'Rohan Shankar', role: 'Vice-Chair' },
    ],
  },
  {
    id: 'interpol', index: 7, code: 'INTERPOL', name: 'INTERPOL', category: 'Specialized Committee', format: 'Single Delegate', size: 35,
    agenda: 'Operation Shadow Storm: Dismantling the Global Scam-Centre Network',
    shortAgenda: 'Operation Shadow Storm',
    description: 'INTERPOL enables law-enforcement cooperation across national borders. Delegates will coordinate an international response to transnational scam-centre networks, weighing intelligence sharing, victim protection, sovereignty, and criminal accountability.', image: '/committees/interpol.png',
    executiveBoard: [
      { name: 'Sourav Satish', role: 'Chair' },
      { name: 'Suban Sudhakar', role: 'Vice-Chair' },
      { name: 'Aadi Nair', role: 'Moderator' },
    ],
  },
  {
    id: 'lok-sabha', index: 8, code: 'LOK SABHA', name: 'Lok Sabha', category: 'Indian Parliament', format: 'Single Delegate', size: 35,
    agenda: 'Reviewing the legality and jurisprudence of the BNSS and ensuring a balance between the right to peaceful protest and public order with a special emphasis on the recent actions in the NCT of Delhi',
    shortAgenda: 'The BNSS, peaceful protest, and public order',
    description: 'Lok Sabha recreates the lower house of India’s Parliament, where representatives scrutinise policy, debate legislation, and hold the executive to account. Delegates will examine the legality and jurisprudence of the BNSS while balancing the right to peaceful protest with public order, with special emphasis on recent actions in the NCT of Delhi.',
    image: '/committees/lok-sabha.png',
    freezeDate: '16 October · 23:59',
    executiveBoard: [
      { name: 'Shlok Dubey', role: 'Chair' },
      { name: 'Talin Krishna', role: 'Vice-Chair' },
    ],
  },
  {
    id: 'ipc', index: 9, code: 'IPC', name: 'International Press Corps', category: 'Press', format: 'Single Delegate', size: 20,
    agenda: 'Press Freedom and the Protection of Journalists in Armed Conflict Zones',
    shortAgenda: 'Press Freedom in Conflict Zones',
    description: 'The International Press Corps follows the conference from the perspective of journalists, not diplomats. Delegates will report, investigate, and shape public understanding of press freedom and the risks faced by reporters in armed conflict zones.', image: '/committees/ipc.png',
    executiveBoard: [
      { name: 'Natasha Agarwal', role: 'Chair' },
      { name: 'Avika', role: 'Vice-Chair' },
      { name: 'Saanvi', role: 'Moderator' },
    ],
  },
  {
    id: 'alea-iacta-est', index: 10, code: 'ALEA IACTA EST', name: 'Alea Iacta Est: The Rubicon Crossing', category: 'JCC', format: 'Single Delegate', size: 40,
    agenda: 'Caesar Crosses the Rubicon: The Final Struggle for the Roman Republic',
    shortAgenda: 'Caesar Crosses the Rubicon',
    description: 'Alea Iacta Est is a Joint Crisis Committee set at the moment Julius Caesar crosses the Rubicon. Delegates enter a fast-moving historical crisis where alliances, military decisions, and political legitimacy will determine the future of the Roman Republic.', image: '/committees/jcc-rubicon.png',
    executiveBoard: [
      { name: 'Sai Juhith', role: 'Head of Cabinet 1' },
      { name: 'Dyutit Vivek', role: 'Vice of Cabinet 1' },
      { name: 'Ansh Datta', role: 'Head of Cabinet 2' },
      { name: 'Utkarsh', role: 'Vice of Cabinet 2' },
    ],
  },
  {
    id: 'committee-x', index: 11, code: 'COMMITTEE X', name: 'Committee X', category: '', format: '', size: 0,
    agenda: '', shortAgenda: '', description: 'This committee remains classified. Details will be disclosed at the appropriate time.', image: '/committees/committee-x.png',
    executiveBoard: [
      { name: 'Ashwin Thomas', role: 'Chair' },
      { name: 'Partiv Dileep', role: 'Vice-Chair' },
      { name: 'Divit Shetty', role: 'Moderator' },
    ],
    confidential: true,
  },
  {
    id: 'us-senate', index: 12, code: 'US SENATE', name: 'United States Senate', category: 'Regional Legislature', format: 'Single Delegate', size: 25,
    agenda: 'U.S. Policy toward Greenland: Arctic Security, Greenlandic Self-Determination, and the Future of U.S.-Danish Relations',
    shortAgenda: 'U.S. Policy toward Greenland',
    description: 'The United States Senate examines national policy through legislation, oversight, and debate. Delegates will consider the strategic, diplomatic, and self-determination questions surrounding Greenland in an increasingly consequential Arctic region.', image: '/committees/us-senate.png',
    executiveBoard: [
      { name: 'Suryamant Roy', role: 'Vice-Chair' },
      { name: 'Vedant Daxini', role: 'Vice-Chair' },
    ],
  },
];
