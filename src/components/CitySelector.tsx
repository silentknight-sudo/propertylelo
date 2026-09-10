import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Check, X, Search, Building } from 'lucide-react';
import { getAllCities, saveNewCity } from '../lib/cities';

interface CitySelectorProps {
  value: string;
  onChange: (city: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helperText?: string;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  value,
  onChange,
  label = 'City *',
  required = true,
  disabled = false,
  className = '',
  helperText
}) => {
  const [cities, setCities] = useState<string[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCityInput, setNewCityInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const list = getAllCities();
    setCities(list);
    // If value is set but not in list, add it
    if (value && !list.includes(value)) {
      setCities(prev => [value, ...prev]);
    }
  }, [value]);

  const handleAddNewCity = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newCityInput.trim();
    if (!clean) {
      setError('Please enter a valid city name');
      return;
    }

    const updated = saveNewCity(clean);
    setCities(updated);
    onChange(clean);
    setNewCityInput('');
    setIsAddingNew(false);
    setError(null);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__ADD_NEW__') {
      setIsAddingNew(true);
      setError(null);
    } else {
      onChange(val);
      setIsAddingNew(false);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block font-bold text-slate-700 text-xs sm:text-sm">
          {label}
        </label>
        {!disabled && !isAddingNew && (
          <button
            type="button"
            onClick={() => {
              setIsAddingNew(true);
              setError(null);
            }}
            className="text-[11px] font-bold text-[#FF6B35] hover:text-[#E85520] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add New City</span>
          </button>
        )}
      </div>

      {isAddingNew ? (
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-bold text-[#002869]">
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#FF6B35]" />
              Enter New City
            </span>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setError(null);
              }}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              autoFocus
              value={newCityInput}
              onChange={(e) => {
                setNewCityInput(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddNewCity();
                }
              }}
              placeholder="e.g. Chandigarh, Jaipur, Lucknow, Dehradun..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white border border-blue-200 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#002869]"
            />
            <button
              type="button"
              onClick={() => handleAddNewCity()}
              className="px-3 py-2 bg-[#002869] hover:bg-[#071f49] text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Use</span>
            </button>
          </div>

          {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
          <p className="text-[11px] text-slate-500">
            This city will be saved and available across all listing forms and search filters.
          </p>
        </div>
      ) : (
        <div className="relative">
          <select
            value={value || 'Delhi NCR'}
            onChange={handleSelectChange}
            disabled={disabled}
            required={required}
            className={`w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 text-xs sm:text-sm appearance-none pr-8 focus:ring-2 focus:ring-[#002869] focus:outline-none ${
              disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : 'cursor-pointer hover:border-slate-300'
            }`}
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
            <option value="__ADD_NEW__" className="font-bold text-[#FF6B35]">
              + Add / List in Another City...
            </option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <MapPin className="w-4 h-4 text-[#FF6B35]" />
          </div>
        </div>
      )}

      {helperText && !isAddingNew && (
        <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>
      )}
    </div>
  );
};
