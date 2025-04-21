'use client';

import { useState } from 'react';
import VoiceRecorder from '@/components/voice/voice-recorder';
import ConversationLog from '@/components/voice/conversation-log';

export default function VoiceTestPage() {
  const [conversation, setConversation] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  
  const addToConversation = (speaker, text) => {
    setConversation(prev => [...prev, { speaker, text, timestamp: new Date() }]);
  };
  
  const handleStartRecording = () => {
    setIsRecording(true);
    addToConversation('system', 'Recording started...');
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    addToConversation('system', 'Recording stopped.');
  };
  
  const handleSpeechResult = (text) => {
    addToConversation('user', text);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Thank you for your interest. Could you tell me about your current notice period?",
        "What is your expected CTC for this role?",
        "Are you available for an interview next Tuesday at 2PM?",
        "Great! I've scheduled your interview for next Tuesday at 2PM. Is that correct?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addToConversation('assistant', randomResponse);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Voice Agent Testing</h1>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Test Voice Agent</h2>
            <p className="mt-1 text-sm text-gray-500">
              Try out the voice agent's conversation flow and test its ability to understand and respond to candidate queries.
            </p>
          </div>
          
          <div className="p-6">
            <ConversationLog conversation={conversation} />
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <VoiceRecorder 
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onSpeechResult={handleSpeechResult}
            />
          </div>
        </div>
      </main>
    </div>
  );
}