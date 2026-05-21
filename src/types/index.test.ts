import { Event, Contributor, PROVINCES, type Province } from './index';

describe('types/index.ts', () => {
  describe('Event interface', () => {
    it('should allow creating a valid Event with all required fields', () => {
      const event: Event = {
        name: 'Tech Conference 2026',
        date: '2026-06-15',
        location: 'Toronto',
        website: 'https://techconf2026.com',
        province: 'ON',
        type: 'conference',
        tags: ['technology', 'networking'],
        isStudentFocused: true,
      };

      expect(event.name).toBe('Tech Conference 2026');
      expect(event.type).toBe('conference');
      expect(event.isStudentFocused).toBe(true);
    });

    it('should allow creating an Event with optional fields', () => {
      const event: Event = {
        name: 'Hackathon 2026',
        date: '2026-07-20',
        location: 'Vancouver',
        website: 'https://hackathon2026.com',
        province: 'BC',
        type: 'hackathon',
        tags: ['hackathon', 'coding'],
        isStudentFocused: false,
        isBeginnerFocused: true,
        isProfessional: false,
        applicationDeadline: '2026-07-01',
      };

      expect(event.isBeginnerFocused).toBe(true);
      expect(event.applicationDeadline).toBe('2026-07-01');
    });

    it('should allow all event types', () => {
      const conference: Event = {
        name: 'Conference',
        date: '2026-01-01',
        location: 'Toronto',
        website: 'https://example.com',
        province: 'ON',
        type: 'conference',
        tags: [],
        isStudentFocused: true,
      };

      const hackathon: Event = {
        name: 'Hackathon',
        date: '2026-01-01',
        location: 'Toronto',
        website: 'https://example.com',
        province: 'ON',
        type: 'hackathon',
        tags: [],
        isStudentFocused: true,
      };

      const meetup: Event = {
        name: 'Meetup',
        date: '2026-01-01',
        location: 'Toronto',
        website: 'https://example.com',
        province: 'ON',
        type: 'meetup',
        tags: [],
        isStudentFocused: true,
      };

      expect(conference.type).toBe('conference');
      expect(hackathon.type).toBe('hackathon');
      expect(meetup.type).toBe('meetup');
    });
  });

  describe('Contributor interface', () => {
    it('should allow creating a valid Contributor with all required fields', () => {
      const contributor: Contributor = {
        username: 'johndoe',
        githubUrl: 'https://github.com/johndoe',
        avatarUrl: 'https://avatars.githubusercontent.com/u/123456',
        contributions: 42,
        firstContribution: '2025-01-15',
        lastContribution: '2026-03-18',
      };

      expect(contributor.username).toBe('johndoe');
      expect(contributor.contributions).toBe(42);
      expect(contributor.githubUrl).toContain('github.com');
    });

    it('should allow creating a Contributor with zero contributions', () => {
      const contributor: Contributor = {
        username: 'newuser',
        githubUrl: 'https://github.com/newuser',
        avatarUrl: 'https://avatars.githubusercontent.com/u/000000',
        contributions: 0,
        firstContribution: '2026-03-18',
        lastContribution: '2026-03-18',
      };

      expect(contributor.contributions).toBe(0);
    });
  });

  describe('Province type', () => {
    it('should allow all valid province codes', () => {
      const provinces: Province[] = [
        'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU',
        'ON', 'PE', 'QC', 'SK', 'YT'
      ];

      expect(provinces).toHaveLength(13);
      expect(provinces).toContain('ON');
      expect(provinces).toContain('BC');
      expect(provinces).toContain('QC');
    });
  });

  describe('PROVINCES constant', () => {
    it('should contain all 13 Canadian provinces and territories', () => {
      expect(PROVINCES).toHaveLength(13);
    });

    it('should have unique province codes', () => {
      const codes = PROVINCES.map(p => p.code);
      const uniqueCodes = new Set(codes);
      expect(codes.length).toBe(uniqueCodes.size);
    });

    it('should have unique province names', () => {
      const names = PROVINCES.map(p => p.name);
      const uniqueNames = new Set(names);
      expect(names.length).toBe(uniqueNames.size);
    });

    it('should contain Ontario', () => {
      const ontario = PROVINCES.find(p => p.code === 'ON');
      expect(ontario).toBeDefined();
      expect(ontario?.name).toBe('Ontario');
    });

    it('should contain British Columbia', () => {
      const bc = PROVINCES.find(p => p.code === 'BC');
      expect(bc).toBeDefined();
      expect(bc?.name).toBe('British Columbia');
    });

    it('should contain Quebec', () => {
      const qc = PROVINCES.find(p => p.code === 'QC');
      expect(qc).toBeDefined();
      expect(qc?.name).toBe('Quebec');
    });

    it('should have matching code and name pairs', () => {
      const expectedPairs: { code: Province; name: string }[] = [
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
        { code: 'YT', name: 'Yukon' },
      ];

      expectedPairs.forEach(({ code, name }) => {
        const province = PROVINCES.find(p => p.code === code);
        expect(province?.name).toBe(name);
      });
    });

    it('should allow filtering provinces by name', () => {
      const alberta = PROVINCES.filter(p => p.name.includes('Alberta'));
      expect(alberta).toHaveLength(1);
      expect(alberta[0].code).toBe('AB');
    });

    it('should allow mapping province codes', () => {
      const codes = PROVINCES.map(p => p.code);
      expect(codes).toContain('ON');
      expect(codes).toContain('QC');
      expect(codes).toContain('YT');
    });
  });
});
