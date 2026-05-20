import { render, screen } from '@testing-library/react';
import Contributors from './Contributors';

describe('Contributors', () => {
  it('renders the component with title and subtitle', () => {
    render(<Contributors />);

    expect(screen.getByText('Contributors 🤝')).toBeInTheDocument();
    expect(screen.getByText('Thank you to these amazing people who help make CanConf better for everyone!')).toBeInTheDocument();
  });

  it('renders contributor cards with correct information', () => {
    render(<Contributors />);

    expect(screen.getByText('@tjklint')).toBeInTheDocument();
    expect(screen.getByText('@marmishaw14')).toBeInTheDocument();
    expect(screen.getByText('@nicoespeon')).toBeInTheDocument();
  });

  it('renders contributor stats with contribution count', () => {
    render(<Contributors />);

    expect(screen.getByText('27 contributions')).toBeInTheDocument();
    expect(screen.getByText('5 contributions')).toBeInTheDocument();
    expect(screen.getByText('2 contributions')).toBeInTheDocument();
  });

  it('renders singular "contribution" when count is 1', () => {
    render(<Contributors />);

    const contributionTexts = screen.getAllByText('1 contribution');
    expect(contributionTexts.length).toBe(4);
  });

  it('renders contributor since date', () => {
    render(<Contributors />);

    const sinceDates = screen.getAllByText(/Since Aug 2025/);
    expect(sinceDates.length).toBe(7);
  });

  it('renders contributor cards as links to GitHub profiles', () => {
    render(<Contributors />);

    const tjklintLink = screen.getByRole('link', { name: /View tjklint's GitHub profile/i });
    expect(tjklintLink).toHaveAttribute('href', 'https://github.com/tjklint');
    expect(tjklintLink).toHaveAttribute('target', '_blank');
    expect(tjklintLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders contributor avatars with correct attributes', () => {
    render(<Contributors />);

    const avatar = screen.getByAltText(/tjklint's avatar/i);
    expect(avatar).toHaveAttribute('src', 'https://avatars.githubusercontent.com/u/112092190?v=4');
    expect(avatar).toHaveAttribute('loading', 'lazy');
  });

  it('renders CTA section with call to action', () => {
    render(<Contributors />);

    expect(screen.getByText('Want to see your name here?')).toBeInTheDocument();
  });

  it('renders contribute link', () => {
    render(<Contributors />);

    const contributeLink = screen.getByText('Contribute to CanConf →');
    expect(contributeLink).toHaveAttribute('href', 'https://github.com/tjklint/CanConf/blob/main/.github/CONTRIBUTING.md');
    expect(contributeLink).toHaveAttribute('target', '_blank');
    expect(contributeLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders correct number of contributor cards', () => {
    render(<Contributors />);

    const cards = document.querySelectorAll('.contributors__card');
    expect(cards.length).toBe(7);
  });

  it('renders all contributor usernames', () => {
    render(<Contributors />);

    expect(screen.getByText('@tjklint')).toBeInTheDocument();
    expect(screen.getByText('@marmishaw14')).toBeInTheDocument();
    expect(screen.getByText('@nicoespeon')).toBeInTheDocument();
    expect(screen.getByText('@AntoninaKosyakova')).toBeInTheDocument();
    expect(screen.getByText('@Gregster31')).toBeInTheDocument();
    expect(screen.getByText('@JordonH03')).toBeInTheDocument();
    expect(screen.getByText('@carsonSgit')).toBeInTheDocument();
  });

  it('renders grid container for contributors', () => {
    render(<Contributors />);

    expect(document.querySelector('.contributors__grid')).toBeInTheDocument();
  });

  it('renders container with proper structure', () => {
    render(<Contributors />);

    expect(document.querySelector('.contributors')).toBeInTheDocument();
    expect(document.querySelector('.contributors__container')).toBeInTheDocument();
  });

  it('renders contributor info sections', () => {
    render(<Contributors />);

    const infoSections = document.querySelectorAll('.contributors__info');
    expect(infoSections.length).toBe(7);
  });

  it('renders contributor stats sections', () => {
    render(<Contributors />);

    const statsSections = document.querySelectorAll('.contributors__stats');
    expect(statsSections.length).toBe(7);
  });
});
