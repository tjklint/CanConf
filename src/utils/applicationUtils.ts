/**
 * Utility functions for application status
 */

export const isApplicationOpen = (applicationDeadline?: string): boolean => {
  if (!applicationDeadline) return false;
  
  try {
    const deadline = new Date(applicationDeadline);
    const now = new Date();
    return deadline > now;
  } catch {
    return false;
  }
};

export const getApplicationStatus = (applicationDeadline?: string): 'open' | 'closed' | 'unknown' => {
  if (!applicationDeadline) return 'unknown';
  
  try {
    const deadline = new Date(applicationDeadline);
    const now = new Date();
    return deadline > now ? 'open' : 'closed';
  } catch {
    return 'unknown';
  }
};

export const formatApplicationDeadline = (applicationDeadline?: string): string => {
  if (!applicationDeadline) return '';
  
  try {
    const deadline = new Date(applicationDeadline);
    return deadline.toLocaleDateString('en-CA', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return applicationDeadline;
  }
};

export const createGithubIssueUrl = (eventName: string, currentStatus: string): string => {
  const title = `Application Status Incorrect: ${eventName}`;
  const body = `**Event Name:** ${eventName}

**Current Status:** ${currentStatus}

**Issue Description:**
The application status for this event appears to be incorrect.

**Correct Information:**
<!-- Please provide the correct application deadline or status -->

**Source:**
<!-- Please provide a source/link where the correct information can be verified -->

---
*This issue was created via the CanConf website's error reporting feature.*`;

  const encodedTitle = encodeURIComponent(title);
  const encodedBody = encodeURIComponent(body);
  
  return `https://github.com/tjklint/CanConf/issues/new?title=${encodedTitle}&body=${encodedBody}&labels=data-correction`;
};
