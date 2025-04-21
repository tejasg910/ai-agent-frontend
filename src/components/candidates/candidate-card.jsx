import Link from 'next/link';

export default function CandidateCard({ candidate }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{candidate.phone}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {candidate.experience} years
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            {candidate.appointments} appointments
          </span>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Current CTC:</span>{' '}
          <span className="font-medium text-gray-700">${candidate.current_ctc}</span>
        </div>
        <div>
          <span className="text-gray-500">Expected CTC:</span>{' '}
          <span className="font-medium text-gray-700">${candidate.expected_ctc}</span>
        </div>
        <div>
          <span className="text-gray-500">Notice Period:</span>{' '}
          <span className="font-medium text-gray-700">{candidate.notice_period}</span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end space-x-3">
        <Link 
          href={`/dashboard/candidates/${candidate._id}`}
          className="text-orange-500 hover:text-orange-600 font-medium text-sm"
        >
          View Details
        </Link>
        <button className="text-gray-500 hover:text-gray-600 font-medium text-sm">
          Edit
        </button>
        <button className="text-red-500 hover:text-red-600 font-medium text-sm">
          Delete
        </button>
      </div>
    </div>
  );
}