export interface Event {
  name: string;
  date: string;
  location: string;
  website: string;
  province: string;
  type: 'conference' | 'hackathon' | 'meetup';
  tags: string[];
  isStudentFocused: boolean;
}

export interface Contributor {
  username: string;
  githubUrl: string;
  avatarUrl: string;
  contributions: number;
  firstContribution: string;
  lastContribution: string;
}

export type Province = 
  | 'AB' // Alberta
  | 'BC' // British Columbia  
  | 'MB' // Manitoba
  | 'NB' // New Brunswick
  | 'NL' // Newfoundland and Labrador
  | 'NS' // Nova Scotia
  | 'NT' // Northwest Territories
  | 'NU' // Nunavut
  | 'ON' // Ontario
  | 'PE' // Prince Edward Island
  | 'QC' // Quebec
  | 'SK' // Saskatchewan
  | 'YT'; // Yukon

export const PROVINCES: { code: Province; name: string }[] = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' }
];
