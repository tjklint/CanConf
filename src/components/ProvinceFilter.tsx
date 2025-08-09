import type { Province } from '../types';
import { PROVINCES } from '../types';
import './ProvinceFilter.scss';

interface ProvinceFilterProps {
  selectedProvince: Province | 'ALL';
  onProvinceChange: (province: Province | 'ALL') => void;
}

const ProvinceFilter = ({ selectedProvince, onProvinceChange }: ProvinceFilterProps) => {
  return (
    <div className="province-filter">
      <h3 className="province-filter__title">Filter by Province</h3>
      <div className="province-filter__buttons">
        <button
          className={`province-filter__button ${selectedProvince === 'ALL' ? 'province-filter__button--active' : ''}`}
          onClick={() => onProvinceChange('ALL')}
        >
          All
        </button>
        {PROVINCES.map((province) => (
          <button
            key={province.code}
            className={`province-filter__button ${selectedProvince === province.code ? 'province-filter__button--active' : ''}`}
            onClick={() => onProvinceChange(province.code)}
            title={province.name}
          >
            {province.code}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProvinceFilter;
