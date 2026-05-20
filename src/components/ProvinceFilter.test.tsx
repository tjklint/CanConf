import { render, screen, fireEvent } from '@testing-library/react';
import ProvinceFilter from './ProvinceFilter';
import { PROVINCES } from '../types';

describe('ProvinceFilter', () => {
  const mockOnProvinceChange = jest.fn();

  beforeEach(() => {
    mockOnProvinceChange.mockClear();
  });

  it('renders the component with title', () => {
    render(
      <ProvinceFilter
        selectedProvince="ALL"
        onProvinceChange={mockOnProvinceChange}
      />
    );

    expect(screen.getByText('Filter by Province')).toBeInTheDocument();
  });

  it('renders the "All" button', () => {
    render(
      <ProvinceFilter
        selectedProvince="ALL"
        onProvinceChange={mockOnProvinceChange}
      />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('renders all province buttons', () => {
    render(
      <ProvinceFilter
        selectedProvince="ALL"
        onProvinceChange={mockOnProvinceChange}
      />
    );

    PROVINCES.forEach((province) => {
      expect(screen.getByText(province.code)).toBeInTheDocument();
    });
  });

  it('has "All" button active when selectedProvince is "ALL"', () => {
    render(
      <ProvinceFilter
        selectedProvince="ALL"
        onProvinceChange={mockOnProvinceChange}
      />
    );

    const allButton = screen.getByText('All');
    expect(allButton).toHaveClass('province-filter__button--active');
  });

  it('has province button active when selectedProvince matches', () => {
    const selectedProvince = PROVINCES[0].code;
    render(
      <ProvinceFilter
        selectedProvince={selectedProvince}
        onProvinceChange={mockOnProvinceChange}
      />
    );

    const activeButton = screen.getByText(selectedProvince);
    expect(activeButton).toHaveClass('province-filter__button--active');
  });

  it('calls onProvinceChange with "ALL" when "All" button is clicked', () => {
    render(
      <ProvinceFilter
        selectedProvince={PROVINCES[0].code}
        onProvinceChange={mockOnProvinceChange}
      />
    );

    fireEvent.click(screen.getByText('All'));
    expect(mockOnProvinceChange).toHaveBeenCalledWith('ALL');
  });

  it('calls onProvinceChange with province code when province button is clicked', () => {
    render(
      <ProvinceFilter
        selectedProvince="ALL"
        onProvinceChange={mockOnProvinceChange}
      />
    );

    const provinceCode = PROVINCES[0].code;
    fireEvent.click(screen.getByText(provinceCode));
    expect(mockOnProvinceChange).toHaveBeenCalledWith(provinceCode);
  });

  it('has title with correct class', () => {
    render(
      <ProvinceFilter
        selectedProvince="ALL"
        onProvinceChange={mockOnProvinceChange}
      />
    );

    expect(screen.getByText('Filter by Province')).toHaveClass('province-filter__title');
  });

  it('has buttons container with correct class', () => {
    render(
      <ProvinceFilter
        selectedProvince="ALL"
        onProvinceChange={mockOnProvinceChange}
      />
    );

    expect(screen.getByText('All').parentElement).toHaveClass('province-filter__buttons');
  });

  it('displays province code as button text and name as title attribute', () => {
    render(
      <ProvinceFilter
        selectedProvince="ALL"
        onProvinceChange={mockOnProvinceChange}
      />
    );

    const province = PROVINCES[0];
    const button = screen.getByText(province.code);
    expect(button).toHaveAttribute('title', province.name);
  });
});
