'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CandidateForm({ candidate, onSubmit, isSubmitting }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: candidate?.name || '',
    phone: candidate?.phone || '',
    current_ctc: candidate?.current_ctc || '',
    expected_ctc: candidate?.expected_ctc || '',
    notice_period: candidate?.notice_period || '',
    experience: candidate?.experience || '',
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.current_ctc.trim()) {
      newErrors.current_ctc = 'Current CTC is required';
    } else if (isNaN(formData.current_ctc)) {
      newErrors.current_ctc = 'CTC must be a number';
    }
    
    if (!formData.expected_ctc.trim()) {
      newErrors.expected_ctc = 'Expected CTC is required';
    } else if (isNaN(formData.expected_ctc)) {
      newErrors.expected_ctc = 'CTC must be a number';
    }
    
    if (!formData.notice_period.trim()) {
      newErrors.notice_period = 'Notice period is required';
    }
    
    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    } else if (isNaN(formData.experience)) {
      newErrors.experience = 'Experience must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        ...formData,
        current_ctc: parseFloat(formData.current_ctc),
        expected_ctc: parseFloat(formData.expected_ctc),
        experience: parseInt(formData.experience, 10)
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="current_ctc" className="block text-sm font-medium text-gray-700">
            Current CTC (USD)
          </label>
          <input
            type="text"
            id="current_ctc"
            name="current_ctc"
            value={formData.current_ctc}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.current_ctc ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500`}
          />
          {errors.current_ctc && (
            <p className="mt-1 text-sm text-red-600">{errors.current_ctc}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="expected_ctc" className="block text-sm font-medium text-gray-700">
            Expected CTC (USD)
          </label>
          <input
            type="text"
            id="expected_ctc"
            name="expected_ctc"
            value={formData.expected_ctc}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.expected_ctc ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500`}
          />
          {errors.expected_ctc && (
            <p className="mt-1 text-sm text-red-600">{errors.expected_ctc}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="notice_period" className="block text-sm font-medium text-gray-700">
            Notice Period
          </label>
          <input
            type="text"
            id="notice_period"
            name="notice_period"
            value={formData.notice_period}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.notice_period ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500`}
          />
          {errors.notice_period && (
            <p className="mt-1 text-sm text-red-600">{errors.notice_period}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
            Experience (Years)
          </label>
          <input
            type="text"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.experience ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500`}
          />
          {errors.experience && (
            <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : candidate ? 'Update Candidate' : 'Add Candidate'}
        </button>
      </div>
    </form>
  );
}