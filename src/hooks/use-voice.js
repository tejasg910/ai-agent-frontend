'use client';

import { useState, useEffect } from 'react';

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [browserSupported, setBrowserSupported] = useState(true);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check browser support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setBrowserSupported(false);
        return;
      }
      
      // Initialize speech recognition
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        const transcriptText = result[0].transcript;
        setTranscript(transcriptText);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        if (isListening) {
          recognitionInstance.start();
        }
      };
      
      setRecognition(recognitionInstance);
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);
  
  // Start/stop listening
  useEffect(() => {
    if (!recognition) return;
    
    if (isListening) {
      try {
        recognition.start();
      } catch (error) {
        // Handle the case where recognition is already started
        if (error.name !== 'InvalidStateError') {
          console.error('Error starting recognition:', error);
        }
      }
    } else {
      recognition.stop();
      setTranscript('');
    }
  }, [isListening, recognition]);
  
  const startListening = () => setIsListening(true);
  const stopListening = () => setIsListening(false);
  
  // Simple text-to-speech function
  const speak = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      window.speechSynthesis.speak(utterance);
      return true;
    }
    return false;
  };
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    speak,
    browserSupported
  };
}