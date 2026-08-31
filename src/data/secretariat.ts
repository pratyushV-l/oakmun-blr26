export type Letter = {
  id: string;
  name: string;
  role: string;
  signOff: string;
  portrait: string;
  paragraphs: string[];
};

export const letters: Letter[] = [
  {
    id: 'aditya-agarwal',
    name: 'Aditya Agarwal',
    role: 'Secretary-General',
    signOff: 'Secretary-General, OakMUN 2026',
    portrait: '/secretariat-imgs/aditya-agarwal.jpg',
    paragraphs: [
      'OAKMUN did not start as OAKMUN. It started in 2016 as the Bangalore Junior MUN, a handful of committees and a room full of delegates who had no idea what a moderated caucus was yet. Nobody in that first room was thinking about legacy. They were thinking about getting through their first speech without their voice cracking. That is the part of the origin story worth remembering: this conference was built by beginners, for beginners, long before it was built for anything else.',
      'It did not stay small. Junior MUN became OAKMUN, and OAKMUN kept outgrowing itself, year after year, until it was pulling in delegates from a dozen schools and running committees that ranged from crisis simulations to historical councils in front of closing-ceremony guests like former RBI Central Board Director Rajeev Gowda. Now folded into Nord Anglia Education, one of the largest school networks in the world, and running most recently as the SEAMEI Regional MUN Conference, OAKMUN has grown into a genuine regional fixture, one that draws delegates from well outside Bengaluru for days of debate that outlast any single school’s walls.',
      'None of that growth changed what the conference actually rewards. OAKMUN 2026 carries the theme Ideas Too Bright for Silence, and that is not just this year’s tagline, it is the same instinct the conference was founded on. A junior delegate standing up for the first time in 2016 and a delegate walking into their tenth committee this September are chasing the same thing: a room that will not let a good idea sit quietly just because the person holding it is new, or unsure, or outnumbered. That has always been the point of this conference. Diplomacy is learned by saying the thing out loud before you are ready to, in a room built to let you try.',
    ],
  },
];
