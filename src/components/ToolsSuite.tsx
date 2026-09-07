import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  TrendingUp, 
  Scale, 
  ArrowRightLeft, 
  IndianRupee, 
  CheckCircle2, 
  Percent, 
  Calendar,
  Sparkles,
  PieChart as PieIcon,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { CITY_PRICE_TRENDS, AREA_CONVERSIONS } from '../data/mockData';

interface ToolsSuiteProps {
  onApplyLoan: (amount: number, emi: number) => void;
}

export const ToolsSuite: React.FC<ToolsSuiteProps> = ({ onApplyLoan }) => {
  const [activeToolTab, setActiveToolTab] = useState<'emi' | 'trends' | 'converter'>('emi');

  // --- 1. EMI Calculator State ---
  const [loanAmount, setLoanAmount] = useState<number>(5000000); // 50 Lakhs
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years

  const { emiMonthly, totalInterest, totalPayment } = useMemo(() => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (p <= 0 || r <= 0 || n <= 0) {
      return { emiMonthly: 0, totalInterest: 0, totalPayment: 0 };
    }

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totPay = emi * n;
    const totInt = totPay - p;

    return {
      emiMonthly: Math.round(emi),
      totalInterest: Math.round(totInt),
      totalPayment: Math.round(totPay)
    };
  }, [loanAmount, interestRate, tenureYears]);

  const emiPieData = [
    { name: 'Principal Amount', value: loanAmount, color: '#002869' },
    { name: 'Total Interest', value: totalInterest, color: '#FF6B35' }
  ];

  // --- 2. Price Trends State ---
  const [selectedTrendCities, setSelectedTrendCities] = useState<string[]>([
    'Delhi NCR',
    'Mumbai',
    'Bangalore',
    'Pune',
    'Hyderabad'
  ]);

  const toggleTrendCity = (city: string) => {
    if (selectedTrendCities.includes(city)) {
      if (selectedTrendCities.length > 1) {
        setSelectedTrendCities(selectedTrendCities.filter((c) => c !== city));
      }
    } else {
      setSelectedTrendCities([...selectedTrendCities, city]);
    }
  };

  const cityLineColors: Record<string, string> = {
    'Delhi NCR': '#FF6B35',
    'Mumbai': '#002869',
    'Bangalore': '#10B981',
    'Pune': '#8B5CF6',
    'Hyderabad': '#EC4899'
  };

  // --- 3. Area Converter State ---
  const [inputAreaValue, setInputAreaValue] = useState<number>(1000);
  const [fromUnit, setFromUnit] = useState<keyof typeof AREA_CONVERSIONS>('sqft');
  const [toUnit, setToUnit] = useState<keyof typeof AREA_CONVERSIONS>('sqyd');

  const convertedArea = useMemo(() => {
    const inSqFt = inputAreaValue * AREA_CONVERSIONS[fromUnit];
    const target = inSqFt / AREA_CONVERSIONS[toUnit];
    return Number(target.toFixed(3));
  }, [inputAreaValue, fromUnit, toUnit]);

  // Format currency in Indian format
  const formatINR = (val: number) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  return (
    <section id="tools-section" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#002869] text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5 text-[#FF6B35]" />
            Real Estate Financial Toolkit
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#002869] font-heading tracking-tight">
            Smart Decision & Calculation Suite
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Calculate your exact EMI, track 7-year micro-market appreciation, and convert complex land measurements instantly.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full">
            <button
              type="button"
              onClick={() => setActiveToolTab('emi')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeToolTab === 'emi'
                  ? 'bg-[#002869] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#002869] hover:bg-slate-50'
              }`}
            >
              <Calculator className="w-4 h-4 text-[#FF6B35]" />
              <span>EMI Calculator</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveToolTab('trends')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeToolTab === 'trends'
                  ? 'bg-[#002869] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#002869] hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
              <span>Price Trends Chart</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveToolTab('converter')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeToolTab === 'converter'
                  ? 'bg-[#002869] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#002869] hover:bg-slate-50'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 text-[#FF6B35]" />
              <span>Area Unit Converter</span>
            </button>
          </div>
        </div>

        {/* --- TOOL 1: EMI CALCULATOR --- */}
        {activeToolTab === 'emi' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Sliders (Left 7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Loan Amount */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700">Loan Amount Required</label>
                  <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                    <span className="text-sm sm:text-base font-extrabold text-[#002869]">
                      {loanAmount >= 10000000
                        ? `₹${(loanAmount / 10000000).toFixed(2)} Cr`
                        : `₹${(loanAmount / 100000).toFixed(1)} Lakh`}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="100000000"
                  step="100000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#FF6B35] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-1">
                  <span>₹5 Lakh</span>
                  <span>₹50 Lakh</span>
                  <span>₹10 Cr</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700">Interest Rate (p.a.)</label>
                  <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                    <span className="text-sm sm:text-base font-extrabold text-[#002869]">
                      {interestRate}% p.a.
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="6.5"
                  max="15.0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#FF6B35] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-1">
                  <span>6.5% (SBI Repo)</span>
                  <span>8.5% (Avg)</span>
                  <span>15.0%</span>
                </div>
              </div>

              {/* Tenure Years */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700">Loan Tenure</label>
                  <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                    <span className="text-sm sm:text-base font-extrabold text-[#002869]">
                      {tenureYears} Years ({tenureYears * 12} Months)
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-[#FF6B35] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-1">
                  <span>1 Year</span>
                  <span>15 Years</span>
                  <span>30 Years</span>
                </div>
              </div>

              {/* Bank Partners Strip */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Preferred Lending Partners:
                </span>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">State Bank of India</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">HDFC Bank</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">ICICI Bank</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">Axis Bank</span>
                </div>
              </div>
            </div>

            {/* Results & Pie Chart (Right 5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#002869] to-[#071f49] rounded-2xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Calculated Monthly EMI
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-heading text-orange-400 mt-1 mb-4">
                  {formatINR(emiMonthly)}
                  <span className="text-xs font-normal text-blue-200 ml-1.5">/month</span>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/15 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-white" />
                      Principal Amount:
                    </span>
                    <span className="font-bold text-white">{formatINR(loanAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-blue-200 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
                      Total Interest:
                    </span>
                    <span className="font-bold text-orange-300">{formatINR(totalInterest)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/10 font-bold">
                    <span className="text-white">Total Amount Payable:</span>
                    <span className="text-white text-base">{formatINR(totalPayment)}</span>
                  </div>
                </div>

                {/* Mini Visual Breakdown */}
                <div className="mt-5 h-28 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emiPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={48}
                        stroke="none"
                      >
                        <Cell fill="#FFFFFF" />
                        <Cell fill="#FF6B35" />
                      </Pie>
                      <Tooltip
                        formatter={(val: number) => [formatINR(val), '']}
                        contentStyle={{ backgroundColor: '#0B1C30', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onApplyLoan(loanAmount, emiMonthly)}
                className="mt-6 w-full py-3.5 px-4 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#FF6B35]/30 transition-all cursor-pointer text-center"
              >
                Apply for Pre-Approved Home Loan
              </button>
            </div>
          </motion.div>
        )}

        {/* --- TOOL 2: PRICE TRENDS CHART --- */}
        {activeToolTab === 'trends' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-100"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#002869] font-heading">
                  Average Capital Values (₹ / sq.ft) 2020 – 2026
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Historical real estate index based on verified transaction registry data.
                </p>
              </div>

              {/* City Toggles */}
              <div className="flex items-center gap-2 flex-wrap">
                {Object.keys(cityLineColors).map((city) => {
                  const isSelected = selectedTrendCities.includes(city);
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleTrendCity(city)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-[#002869] text-white border-[#002869] shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cityLineColors[city] }}
                      />
                      <span>{city}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recharts Line Chart */}
            <div className="h-80 sm:h-96 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CITY_PRICE_TRENDS} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="year" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={12}
                    tickFormatter={(val) => `₹${val}`}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(val: number, name: string) => [`₹${val.toLocaleString('en-IN')}/sq.ft`, name]}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '12px',
                      color: '#FFF',
                      border: 'none',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}
                  />
                  <Legend />
                  {selectedTrendCities.map((city) => (
                    <Line
                      key={city}
                      type="monotone"
                      dataKey={city}
                      stroke={cityLineColors[city]}
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: '#FFF' }}
                      activeDot={{ r: 7 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* --- TOOL 3: AREA UNIT CONVERTER --- */}
        {activeToolTab === 'converter' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-100 max-w-3xl mx-auto"
          >
            <h3 className="text-xl font-bold text-[#002869] font-heading mb-1 text-center">
              Indian Land & Property Area Converter
            </h3>
            <p className="text-xs text-slate-500 text-center mb-8">
              Easily convert between Square Feet, Gaj (Sq. Yards), Acres, Bigha, Guntha & Cents.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
              {/* From value and unit */}
              <div className="sm:col-span-5 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">From:</label>
                <input
                  type="number"
                  value={inputAreaValue}
                  onChange={(e) => setInputAreaValue(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-[#002869] focus:outline-none"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value as any)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <option value="sqft">Square Feet (sq.ft)</option>
                  <option value="sqyd">Gaj / Square Yards (sq.yd)</option>
                  <option value="sqm">Square Meters (sq.m)</option>
                  <option value="acre">Acres</option>
                  <option value="bigha">Bigha (North India)</option>
                  <option value="guntha">Guntha (West/South India)</option>
                  <option value="cent">Cents (South India)</option>
                </select>
              </div>

              {/* Middle Swap Arrow */}
              <div className="sm:col-span-1 flex justify-center py-2">
                <button
                  type="button"
                  onClick={() => {
                    const temp = fromUnit;
                    setFromUnit(toUnit);
                    setToUnit(temp);
                  }}
                  className="p-3 rounded-full bg-blue-50 text-[#002869] hover:bg-blue-100 transition-colors shadow-xs cursor-pointer"
                  title="Swap units"
                >
                  <ArrowRightLeft className="w-5 h-5 text-[#FF6B35]" />
                </button>
              </div>

              {/* To value and unit */}
              <div className="sm:col-span-5 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Converted Value:</label>
                <div className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-lg font-extrabold text-[#002869] truncate">
                  {convertedArea.toLocaleString('en-IN')}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value as any)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <option value="sqyd">Gaj / Square Yards (sq.yd)</option>
                  <option value="sqft">Square Feet (sq.ft)</option>
                  <option value="sqm">Square Meters (sq.m)</option>
                  <option value="acre">Acres</option>
                  <option value="bigha">Bigha (North India)</option>
                  <option value="guntha">Guntha (West/South India)</option>
                  <option value="cent">Cents (South India)</option>
                </select>
              </div>
            </div>

            {/* Quick Conversion Quick Reference Table */}
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">1 Gaj / Sq.Yd</span>
                <span className="font-bold text-[#002869]">9 Sq.Ft</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">1 Acre</span>
                <span className="font-bold text-[#002869]">43,560 Sq.Ft</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">1 Guntha</span>
                <span className="font-bold text-[#002869]">1,089 Sq.Ft</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">1 Cent</span>
                <span className="font-bold text-[#002869]">435.6 Sq.Ft</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
