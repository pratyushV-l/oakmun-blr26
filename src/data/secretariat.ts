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
      'Dear Delegates,',
      'In 2021, I asked the single stupidest question that has probably ever been asked in this very hall. I don’t remember the committee, and I don’t remember the agenda, but I remember standing up, motion in hand, and saying something so procedurally, embarrassingly wrong that my chair had to pause just to figure out how to respond to it. I sat back down convinced I had ended my diplomatic career before it began.',
      'I did not end my diplomatic career. I came back the next year, and the year after that. Committee after committee, gavel after gavel, I went from the delegate who didn’t know what a moderated caucus was to someone who could run one, then chair one, then eventually help build an entire conference from the ground up. Somewhere in that stretch, MUN stopped being something I did and became something closer to how I think, about negotiation, about power, about the distance between what a resolution says and what a room actually agrees to.',
      'What that first embarrassing speech actually taught me had nothing to do with procedure. It taught me that I had walked in certain I was right, and I was not, and the only way I found that out was because someone in that room was willing to correct me instead of just letting me sit down and be wrong quietly. That is the part of MUN people talk about the least. Everyone rehearses their opening speech. Almost nobody rehearses what to do when the delegate across the room makes a point that dismantles theirs. The best delegates I have watched over these five years were never the loudest in the room. They were the ones who could hear a good argument against their own position and change course without treating it as a loss.',
      'So here is the one thing I want every delegate in this hall to actually try this year: listen to every bloc, every counter, every amendment, as if you might be the one who is wrong. Not performatively. Actually consider it. Diplomacy that only sounds convincing to the person already convinced is not diplomacy, it is just a speech with extra steps. The delegates who leave OAKMUN having genuinely changed their position at least once are, in my experience, the ones who leave having learned something real.',
      'Every delegate walking into OAKMUN 2026 is somewhere on that same arc I was on. Some of you are about to ask your own version of the stupidest question in this hall. Some of you are a few placards away from chairing your first committee without knowing it yet. This conference does not exist to reward the delegates who already have it figured out. It exists to be the room where you figure it out, in front of people who are willing to tell you when you’re wrong, and who you should be just as willing to hear out in return.',
      'This year, we have tried to build a conference worth that kind of honesty. Twelve committees, a Historical UNSC running as a double delegation, a Joint Crisis Committee in Alea Iacta Est, and a historical crisis committee in Committee X: spaces built for delegates who want more than a script to follow, and spaces built just as deliberately for the delegate walking in for the first time, unsure whether they are even allowed to speak yet. You are allowed to speak. And when someone speaks back, you are expected to actually listen.',
      'To the first-timers: get the stupid question out of the way early. It is a rite of passage, not a setback.',
      'To the veterans: remember what it felt like before you knew what a POI was, and be generous with the delegate next to you who is living that moment right now.',
      'To everyone: OAKMUN has never been about diplomacy performed correctly. It has been about diplomacy attempted honestly, by people willing to be wrong in public and change their mind anyway.',
      'I cannot wait to watch this year’s delegates find their own version of that hall, that mistake, and that comeback.',
      'See you at the dais.',
      'Godspeed,',
    ],
  },
];
