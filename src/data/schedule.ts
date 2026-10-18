export type ScheduleKind =
  | 'logistics'
  | 'ceremony'
  | 'break'
  | 'committee'
  | 'meal'
  | 'social'
  | 'venue'
  | 'dispersal';

export interface ScheduleMealSlot {
  label: string;
  time: string;
}

export interface ScheduleItem {
  time: string;
  end?: string;
  title: string;
  kind: ScheduleKind;
  headline?: boolean;
  mark?: string;
  meals?: ScheduleMealSlot[];
}

export interface ScheduleDay {
  id: string;
  label: string;
  date: string;
  items: ScheduleItem[];
}

export const scheduleDays: ScheduleDay[] = [
  {
    id: 'day-1',
    label: 'Day 01',
    date: 'Dec 17',
    items: [
      { time: '07:30', end: '08:30', title: 'Arrival & Registration', kind: 'logistics' },
      { time: '08:30', end: '08:45', title: 'Settling In', kind: 'logistics' },
      { time: '08:45', end: '10:00', title: 'Opening Ceremony', kind: 'ceremony', headline: true },
      { time: '10:00', end: '10:15', title: 'Break', kind: 'break' },
      { time: '10:15', end: '12:15', title: 'Committee Session I', kind: 'committee', headline: true, mark: 'I' },
      {
        time: '12:15', end: '13:15', title: 'Lunch', kind: 'meal',
        meals: [{ label: 'Block A', time: '12:15 – 12:45' }, { label: 'Block B', time: '12:45 – 13:15' }],
      },
      { time: '12:45', end: '15:00', title: 'Committee Session II', kind: 'committee', headline: true, mark: 'II' },
      { time: '15:00', end: '16:00', title: 'Networking Hour & Break', kind: 'break' },
      { time: '16:15', end: '18:00', title: 'Committee Session III', kind: 'committee', headline: true, mark: 'III' },
      { time: '18:00', title: 'Dispersal', kind: 'dispersal' },
    ],
  },
  {
    id: 'day-2',
    label: 'Day 02',
    date: 'Dec 18',
    items: [
      { time: '07:30', end: '08:00', title: 'Arrival & Bag Checks', kind: 'logistics' },
      { time: '08:15', end: '10:00', title: 'Committee Session IV', kind: 'committee', headline: true, mark: 'IV' },
      { time: '10:00', end: '10:15', title: 'Snack Break', kind: 'break' },
      { time: '10:15', end: '13:15', title: 'Committee Session V', kind: 'committee', headline: true, mark: 'V' },
      {
        time: '12:30', end: '13:45', title: 'Lunch', kind: 'meal',
        meals: [{ label: 'Block A', time: '12:30 – 13:15' }, { label: 'Block B', time: '13:15 – 13:45' }],
      },
      { time: '13:15', end: '15:45', title: 'Committee Session VI', kind: 'committee', headline: true, mark: 'VI' },
      { time: '15:45', end: '16:15', title: 'Pre-Social Break', kind: 'break' },
      { time: '16:15', end: '19:15', title: 'Socials', kind: 'social', headline: true },
    ],
  },
  {
    id: 'day-3',
    label: 'Day 03',
    date: 'Dec 19',
    items: [
      { time: '07:30', end: '08:15', title: 'Arrival & Bag Checks', kind: 'logistics' },
      { time: '08:15', end: '10:55', title: 'Committee Session VII', kind: 'committee', headline: true, mark: 'VII' },
      { time: '10:55', end: '11:15', title: 'Moving to Venue', kind: 'venue' },
      { time: '11:15', end: '12:30', title: 'Closing Ceremony', kind: 'ceremony', headline: true },
      { time: '12:30', end: '13:00', title: 'Dispersal', kind: 'dispersal' },
    ],
  },
];
