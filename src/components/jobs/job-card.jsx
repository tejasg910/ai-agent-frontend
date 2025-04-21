import Link from 'next/link';

export default function JobCard({ job }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500 mt-1">Created on {formatDate(job.created_at)}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {job.candidates} candidates, {job.appointments} appointments
          </span>
          <div className="flex-shrink-0">
            <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500" 
                style={{ width: `${(job.appointments / job.candidates) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-3 text-gray-600">{job.description}</p>
      
      <div className="mt-4 text-sm text-gray-600">
        <strong>Requirements:</strong> {job.requirements}
      </div>
      
      <div className="mt-4 flex justify-end space-x-3">
        <Link 
          href={`/dashboard/jobs/${job.id}`}
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