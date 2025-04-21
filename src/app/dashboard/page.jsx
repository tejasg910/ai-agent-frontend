import StatsCard from '@/components/dashboard/stats-card';
import OverviewChart from '@/components/dashboard/overview-chart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Jobs" 
          value={12} 
          trend="up" 
          percentage={8} 
          icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
        <StatsCard 
          title="Total Candidates" 
          value={48} 
          trend="up" 
          percentage={12} 
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <StatsCard 
          title="Booked Appointments" 
          value={24} 
          trend="up" 
          percentage={5} 
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Interview Overview</h2>
        <OverviewChart />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Jobs</h2>
          <div className="space-y-4">
            {[
              { id: 1, title: 'Frontend Developer', candidates: 12, appointments: 8 },
              { id: 2, title: 'Backend Engineer', candidates: 8, appointments: 5 },
              { id: 3, title: 'UI/UX Designer', candidates: 6, appointments: 3 },
            ].map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.candidates} candidates, {job.appointments} appointments</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500" 
                      style={{ width: `${(job.appointments / job.candidates) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Appointments</h2>
          <div className="space-y-4">
            {[
              { id: 1, candidate: 'John Doe', job: 'Frontend Developer', date: '2025-04-22', status: 'booked' },
              { id: 2, candidate: 'Jane Smith', job: 'Backend Engineer', date: '2025-04-23', status: 'booked' },
              { id: 3, candidate: 'Bob Johnson', job: 'UI/UX Designer', date: '2025-04-21', status: 'completed' },
            ].map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{appointment.candidate}</h3>
                  <p className="text-sm text-gray-500">{appointment.job} • {appointment.date}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    appointment.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}