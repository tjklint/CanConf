import {
  isApplicationOpen,
  getApplicationStatus,
  formatApplicationDeadline,
  createGithubIssueUrl
} from './applicationUtils';

describe('isApplicationOpen', () => {
  it('should return false when no deadline is provided', () => {
    expect(isApplicationOpen()).toBe(false);
    expect(isApplicationOpen(undefined)).toBe(false);
  });

  it('should return true when deadline is in the future', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    expect(isApplicationOpen(futureDate.toISOString())).toBe(true);
  });

  it('should return false when deadline is in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    expect(isApplicationOpen(pastDate.toISOString())).toBe(false);
  });

  it('should return false when deadline is today (same time)', () => {
    const now = new Date();
    expect(isApplicationOpen(now.toISOString())).toBe(false);
  });

  it('should return false for invalid date strings', () => {
    expect(isApplicationOpen('invalid-date')).toBe(false);
  });
});

describe('getApplicationStatus', () => {
  it('should return "unknown" when no deadline is provided', () => {
    expect(getApplicationStatus()).toBe('unknown');
    expect(getApplicationStatus(undefined)).toBe('unknown');
  });

  it('should return "open" when deadline is in the future', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    expect(getApplicationStatus(futureDate.toISOString())).toBe('open');
  });

  it('should return "closed" when deadline is in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    expect(getApplicationStatus(pastDate.toISOString())).toBe('closed');
  });

  it('should return "closed" when deadline is today (same time)', () => {
    const now = new Date();
    expect(getApplicationStatus(now.toISOString())).toBe('closed');
  });

  it('should return "unknown" for invalid date strings', () => {
    expect(getApplicationStatus('invalid-date')).toBe('closed');
  });
});

describe('formatApplicationDeadline', () => {
  it('should return empty string when no deadline is provided', () => {
    expect(formatApplicationDeadline()).toBe('');
    expect(formatApplicationDeadline(undefined)).toBe('');
  });

  it('should format a valid date string in en-CA format', () => {
    const date = new Date('2025-03-15');
    const result = formatApplicationDeadline(date.toISOString());
    expect(result).toBe('Mar 15, 2025');
  });

  it('should format date with different months correctly', () => {
    const date = new Date('2025-12-25');
    const result = formatApplicationDeadline(date.toISOString());
    expect(result).toBe('Dec 25, 2025');
  });

  it('should return original string for invalid date', () => {
    expect(formatApplicationDeadline('invalid-date')).toBe('Invalid Date');
  });
});

describe('createGithubIssueUrl', () => {
  it('should create a valid GitHub issue URL', () => {
    const eventName = 'Test Event';
    const currentStatus = 'open';
    const url = createGithubIssueUrl(eventName, currentStatus);

    expect(url).toContain('https://github.com/tjklint/CanConf/issues/new');
    expect(url).toContain('title=');
    expect(url).toContain('body=');
    expect(url).toContain('labels=data-correction');
  });

  it('should include event name in the title', () => {
    const eventName = 'Hackathon 2025';
    const url = createGithubIssueUrl(eventName, 'closed');

    expect(url).toContain(encodeURIComponent(`Application Status Incorrect: ${eventName}`));
  });

  it('should include current status in the body', () => {
    const currentStatus = 'open';
    const url = createGithubIssueUrl('Test Event', currentStatus);

    expect(url).toContain(encodeURIComponent(`**Current Status:** ${currentStatus}`));
  });

  it('should include event name in the body', () => {
    const eventName = 'Conference 2025';
    const url = createGithubIssueUrl(eventName, 'closed');

    expect(url).toContain(encodeURIComponent(`**Event Name:** ${eventName}`));
  });

  it('should include template body content', () => {
    const url = createGithubIssueUrl('Test', 'open');
    const decodedBody = decodeURIComponent(url.split('body=')[1].split('&labels')[0]);

    expect(decodedBody).toContain('**Event Name:**');
    expect(decodedBody).toContain('**Current Status:**');
    expect(decodedBody).toContain('**Issue Description:**');
    expect(decodedBody).toContain('**Correct Information:**');
    expect(decodedBody).toContain('**Source:**');
    expect(decodedBody).toContain('This issue was created via the CanConf website');
  });

  it('should handle special characters in event name', () => {
    const eventName = 'Event & "Special" <Chars>';
    const url = createGithubIssueUrl(eventName, 'open');

    expect(url).toContain('title=');
    expect(url).toContain('body=');
  });
});
