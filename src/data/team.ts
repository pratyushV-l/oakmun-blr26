export type Member = {
  name: string;
  role: string;
  portrait: string;
};

export type Department = {
  id: string;
  name: string;
  members: Member[];
};

export const secretariat: Member[] = [
  {
    name: 'Aditya Agarwal',
    role: 'Secretary-General',
    portrait: '/secretariat-imgs/aditya-agarwal.jpg',
  },
  {
    name: 'Chandana Jelli',
    role: 'Director-General',
    portrait: '/secretariat-imgs/chandana-jelli.jpg',
  },
  {
    name: 'Ryan Dennis Gomez',
    role: 'Director-General',
    portrait: '/secretariat-imgs/ryan-dennis-gomez.jpg',
  },
];

export const departments: Department[] = [
  {
    id: 'ceremonies',
    name: 'Ceremonies',
    members: [
      { name: 'Deetya Yalavarthy', role: 'Head of Department', portrait: '/secretariat-imgs/deetya-yalavarthy.jpg' },
    ],
  },
  {
    id: 'hosting',
    name: 'Hosting and Set-Up',
    members: [
      { name: 'Sahasra Reddy Jevireddy', role: 'Head of Department', portrait: '/secretariat-imgs/sahasra-reddy.jpg' },
    ],
  },
  {
    id: 'delegate-affairs',
    name: 'Delegate Affairs',
    members: [
      { name: 'Ritika Rahul Kalaskar', role: 'Head of Department', portrait: '/secretariat-imgs/ritika-rahul-kalaskar.jpg' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance and Sponsorship',
    members: [
      { name: 'Vedant Agarwal', role: 'Head of Department', portrait: '/secretariat-imgs/vedant-agarwal.jpg' },
    ],
  },
  {
    id: 'logistics',
    name: 'Logistics',
    members: [
      { name: 'Shriya Gona', role: 'Head of Department', portrait: '/secretariat-imgs/shriya-gona.jpg' },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    members: [
      { name: 'Anvitha Pravin', role: 'Head of Department', portrait: '/secretariat-imgs/anvitha-praveen.jpg' },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    members: [
      { name: 'Samarth Raj Singh', role: 'Head of Department', portrait: '/secretariat-imgs/samarth-raj-singh.jpg' },
    ],
  },
  {
    id: 'technology',
    name: 'Technology',
    members: [
      { name: 'Pratyush Shankar', role: 'Co-Head of Department', portrait: '/secretariat-imgs/pratyush-vel-shankar.jpg' },
      { name: 'Ritayush Dey', role: 'Co-Head of Department', portrait: '/secretariat-imgs/ritayush-suchismita-dey.jpg' },
    ],
  },
];

const order = [
  'technology',
  'ceremonies',
  'hosting',
  'delegate-affairs',
  'finance',
  'logistics',
  'marketing',
  'security',
];

export const leads: (Member & { department: string })[] =
  secretariat.map((m) => ({ ...m, department: 'Secretariat' }));

export const crew: (Member & { department: string })[] = order.flatMap((id) => {
  const d = departments.find((dept) => dept.id === id);
  return d ? d.members.map((m) => ({ ...m, department: d.name })) : [];
});
