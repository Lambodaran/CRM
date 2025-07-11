import React, { useState } from "react";

const MortgageCalculator = () => {
  const [inputs, setInputs] = useState({
    homePrice: 5000000,
    downPayment: 1000000,
    interestRate: 7.5,
    loanTerm: 20,
  });

  const [hasCalculated, setHasCalculated] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    // Set constraints for each field
    let constrainedValue = numValue;
    if (name === "homePrice") constrainedValue = Math.max(0, numValue);
    if (name === "downPayment") constrainedValue = Math.max(0, Math.min(numValue, inputs.homePrice));
    if (name === "interestRate") constrainedValue = Math.max(0, Math.min(numValue, 30));
    if (name === "loanTerm") constrainedValue = Math.max(1, Math.min(numValue, 30));
    
    setInputs((prev) => ({ ...prev, [name]: constrainedValue }));
    setHasCalculated(true);
  };

  // Calculations
  const homePrice = inputs.homePrice || 0;
  const downPayment = inputs.downPayment || 0;
  const interestRate = inputs.interestRate || 0;
  const loanTerm = inputs.loanTerm || 0;

  const downPaymentPercentage = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
  const loanAmount = Math.max(0, homePrice - downPayment);
  const monthlyInterestRate = interestRate / 12 / 100;
  const totalMonths = loanTerm * 12;

  const emi =
    monthlyInterestRate > 0 && totalMonths > 0 && loanAmount > 0
      ? (loanAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, totalMonths)) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
      : 0;

  const totalInterest = emi * totalMonths - loanAmount;
  const totalPayment = emi * totalMonths + downPayment;

  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Loan Calculator</h1>
      
      {/* Price Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Home Price</label>
          <span className="text-lg font-semibold">{formatCurrency(homePrice)}</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">₹0</span>
          <input
            type="range"
            name="homePrice"
            min="0"
            max="20000000"
            step="50000"
            value={homePrice}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-500 ml-2">₹2Cr</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">₹0</span>
          <span className="text-xs text-gray-500">₹1Cr</span>
          <span className="text-xs text-gray-500">₹2Cr</span>
        </div>
      </div>

      {/* Down Payment Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Down Payment</label>
          <div className="text-right">
            <span className="text-lg font-semibold">{formatCurrency(downPayment)}</span>
            <span className="text-sm text-gray-500 ml-2">({downPaymentPercentage.toFixed(1)}%)</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">₹0</span>
          <input
            type="range"
            name="downPayment"
            min="0"
            max={homePrice}
            step="50000"
            value={downPayment}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-500 ml-2">{formatCurrency(homePrice)}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">₹0</span>
          <span className="text-xs text-gray-500">{formatCurrency(homePrice/2)}</span>
          <span className="text-xs text-gray-500">{formatCurrency(homePrice)}</span>
        </div>
      </div>

      {/* Loan Term Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Loan Term (years)</label>
          <span className="text-lg font-semibold">{loanTerm} years</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">1</span>
          <input
            type="range"
            name="loanTerm"
            min="1"
            max="30"
            value={loanTerm}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-500 ml-2">30</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">1</span>
          <span className="text-xs text-gray-500">15</span>
          <span className="text-xs text-gray-500">30</span>
        </div>
      </div>

      {/* Interest Rate Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Interest Rate</label>
          <span className="text-lg font-semibold">{interestRate}%</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">0%</span>
          <input
            type="range"
            name="interestRate"
            min="0"
            max="30"
            step="0.1"
            value={interestRate}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-500 ml-2">30%</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">0%</span>
          <span className="text-xs text-gray-500">15%</span>
          <span className="text-xs text-gray-500">30%</span>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* EMI Summary */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-700 mb-2">Monthly Payment</h3>
            <p className="text-2xl font-bold text-black-600">
              {formatCurrency(Math.round(emi))}
            </p>
          </div>

          {/* Loan Details */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-700 mb-2">Loan Details</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Amount:</span>
                <span className="text-sm">{formatCurrency(loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Down Payment:</span>
                <span className="text-sm">
                  {formatCurrency(downPayment)} ({downPaymentPercentage.toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Rate:</span>
                <span className="text-sm">{interestRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Term:</span>
                <span className="text-sm">{loanTerm} years</span>
              </div>
            </div>
          </div>

          {/* Interest */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-700 mb-2">Total Interest</h3>
            <p className="text-xl font-bold text-black-500 mb-2">
              {formatCurrency(Math.round(totalInterest))}
            </p>
            <p className="text-xs text-gray-500">
              {((totalInterest / loanAmount) * 100).toFixed(1)}% Of loan amount
            </p>
          </div>

          {/* Total Payment */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-700 mb-2">Total Payment</h3>
            <p className="text-xl font-bold text-black-600">
              {formatCurrency(Math.round(totalPayment))}
            </p>
            <p className="text-xs text-gray-500">
              {((totalPayment / homePrice) * 100).toFixed(1)}% of home price
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;