import React, { useState } from 'react';
import { getApplicationStatus, formatApplicationDeadline, createGithubIssueUrl } from '../utils/applicationUtils';
import './ApplicationStatus.scss';

interface ApplicationStatusProps {
  eventName: string;
  applicationDeadline?: string;
  eventType: 'conference' | 'hackathon' | 'meetup';
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ 
  eventName, 
  applicationDeadline, 
  eventType 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const status = getApplicationStatus(applicationDeadline);
  
  // Only show for hackathons (main use case) and conferences that have application deadlines
  if (eventType === 'meetup' || (!applicationDeadline && eventType === 'conference')) {
    return null;
  }
  
  const handleReportError = () => {
    const statusText = status === 'unknown' ? 'Unknown' : 
                     status === 'open' ? `Open (closes ${formatApplicationDeadline(applicationDeadline)})` :
                     `Closed (closed ${formatApplicationDeadline(applicationDeadline)})`;
    
    const issueUrl = createGithubIssueUrl(eventName, statusText);
    window.open(issueUrl, '_blank', 'noopener,noreferrer');
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'open':
        return {
          className: 'application-status--open',
          text: 'Applications Open',
          icon: '✓',
          deadline: applicationDeadline ? `Closes ${formatApplicationDeadline(applicationDeadline)}` : ''
        };
      case 'closed':
        return {
          className: 'application-status--closed',
          text: 'Applications Closed',
          icon: '✕',
          deadline: applicationDeadline ? `Closed ${formatApplicationDeadline(applicationDeadline)}` : ''
        };
      case 'unknown':
      default:
        return {
          className: 'application-status--unknown',
          text: 'Applications Status Unknown',
          icon: '?',
          deadline: ''
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="application-status-container">
      <div 
        className={`application-status ${config.className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="application-status__icon">{config.icon}</span>
        <span className="application-status__text">{config.text}</span>
      </div>
      
      {showTooltip && (
        <div className="application-status-tooltip">
          <div className="application-status-tooltip__content">
            {config.deadline && (
              <div className="application-status-tooltip__deadline">
                {config.deadline}
              </div>
            )}
            <div className="application-status-tooltip__actions">
              <span className="application-status-tooltip__help">
                Wrong info?
              </span>
              <button 
                className="application-status-tooltip__report"
                onClick={handleReportError}
                title="Report incorrect application status"
              >
                Report Issue
              </button>
              <span className="application-status-tooltip__or">or</span>
              <a 
                href="https://github.com/tjklint/CanConf/blob/main/.github/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="application-status-tooltip__contribute"
                title="Learn how to contribute corrections"
              >
                Contribute Fix
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;
