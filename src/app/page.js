import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl font-bold text-orange-600 mb-6">
          Interview Scheduler
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Voice-driven application for automated interview scheduling
        </p>
        <div className="flex gap-4">
          <Link 
            href="/dashboard" 
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link 
            href="/voice-test" 
            className="bg-white hover:bg-gray-100 text-orange-500 font-bold py-3 px-6 rounded-lg border border-orange-500 transition-colors"
          >
            Test Voice Agent
          </Link>
        </div>
      </main>
    </div>
  );
}