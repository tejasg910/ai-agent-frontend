'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CandidateForm from '@/components/candidates/candidate-form';
import { useCreateCandidate } from '@/api/hooks/candidates/useCreateCandidate';

export default function NewCandidatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate, isLoading, isError, error, data } = useCreateCandidate();

  const handleSubmit = async (candidateData) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this to your API
      // const response = await candidatesApi.create(candidateData);
      
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1000));
     await  mutate(candidateData)
      
      console.log('Candidate created:', candidateData);
      router.push('/dashboard/candidates');
    } catch (error) {
      console.error('Error creating candidate:', error);
      alert('Failed to create candidate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Add New Candidate</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <CandidateForm onSubmit={handleSubmit} isSubmitting={isLoading} />
      </div>
    </div>
  );
}