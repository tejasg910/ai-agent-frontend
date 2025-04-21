'use client';

import { useEffect, useRef } from 'react';

export default function ConversationLog({ conversation }) {
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [conversation]);
  
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div ref={logRef} className="h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
      {conversation.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          No conversation yet. Start recording to begin.
        </div>
      ) : (
        conversation.map((message, index) => (
          <div key={index} className={`flex ${message.speaker === 'user' ? 'justify-end' : ''}`}>
            <div
              className={`max-w-md rounded-lg px-4 py-2 ${
                message.speaker === 'user'
                  ? 'bg-orange-100 text-orange-800'
                  : message.speaker === 'assistant'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-gray-100 text-gray-600 italic text-sm'
              }`}
            >
              {message.speaker !== 'system' && (
                <div className="text-xs text-gray-500 mb-1">
                  {message.speaker === 'user' ? 'You' : 'Assistant'} • {formatTime(message.timestamp)}
                </div>
              )}
              <div>{message.text}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}