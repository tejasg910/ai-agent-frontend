'use client';

import { useEffect, useState } from 'react';

export default function VoiceRecorder({ isRecording, onStartRecording, onStopRecording, onSpeechResult }) {
  const [recognition, setRecognition] = useState(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // Create speech recognition instance
      const SpeechRecognition = window.webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();
      
      newRecognition.continuous = true;
      newRecognition.interimResults = false;
      newRecognition.lang = 'en-US';
      
      newRecognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        onSpeechResult(transcript);
      };
      
      newRecognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
      };
      
      setRecognition(newRecognition);
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);
  
  useEffect(() => {
    if (!recognition) return;
    
    if (isRecording) {
      recognition.start();
    } else {
      recognition.stop();
    }
  }, [isRecording, recognition]);
  
  const handleToggleRecording = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleToggleRecording}
        className={`w-16 h-16 rounded-full flex items-center justify-center ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-orange-500 hover:bg-orange-600'
        } transition-colors`}
      >
        {isRecording ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
      <p className="mt-3 text-sm text-gray-500">
        {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
      </p>
      <p className="mt-1 text-xs text-gray-400">
        {typeof window !== 'undefined' && !('webkitSpeechRecognition' in window) && 
          "Your browser doesn't support speech recognition. Try Chrome or Edge."}
      </p>
    </div>
  );
}