import type { Contributor } from '../types';
import contributorsData from '../data/contributors.json';
import './Contributors.scss';

const Contributors = () => {
  const contributors = contributorsData.contributors as Contributor[];

  if (contributors.length === 0) {
    return null;
  }

  return (
    <section className="contributors">
      <div className="contributors__container">
        <h2 className="contributors__title">Contributors 🤝</h2>
        <p className="contributors__subtitle">
          Thank you to these amazing people who help make CanConf better for everyone!
        </p>
        
        <div className="contributors__grid">
          {contributors.map((contributor) => (
            <a
              key={contributor.username}
              href={contributor.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contributors__card"
              aria-label={`View ${contributor.username}'s GitHub profile`}
            >
              <img
                src={contributor.avatarUrl}
                alt={`${contributor.username}'s avatar`}
                className="contributors__avatar"
                loading="lazy"
              />
              <div className="contributors__info">
                <h3 className="contributors__username">@{contributor.username}</h3>
                <div className="contributors__stats">
                  <span className="contributors__contributions">
                    {contributor.contributions} contribution{contributor.contributions !== 1 ? 's' : ''}
                  </span>
                  <span className="contributors__date">
                    Since {new Date(contributor.firstContribution).toLocaleDateString('en-CA', {
                      year: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <div className="contributors__cta">
          <p>Want to see your name here?</p>
          <a 
            href="https://github.com/tjklint/CanConf/blob/main/.github/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="contributors__contribute-link"
          >
            Contribute to CanConf →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contributors;
