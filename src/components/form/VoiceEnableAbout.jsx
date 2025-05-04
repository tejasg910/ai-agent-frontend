import { useState, useEffect } from 'react';
import { Info, X, Mic, MicOff, Loader2 } from "lucide-react";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function VoiceEnabledAboutField({ 
  value, 
  onChange, 
  error, 
  errorMessage 
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();
      
      newRecognition.continuous = true;
      newRecognition.interimResults = false;
      newRecognition.lang = 'en-US';
      
      newRecognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        
        // Create a synthetic event to pass to the onChange handler
        const syntheticEvent = {
          target: {
            name: 'about',
            value: value ? `${value} ${transcript}` : transcript
          }
        };
        
        onChange(syntheticEvent);
        setIsProcessing(false);
      };
      
      newRecognition.onstart = () => {
        setIsRecording(true);
        setIsProcessing(true);
      };
      
      newRecognition.onend = () => {
        setIsRecording(false);
        setIsProcessing(false);
      };
      
      newRecognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        setIsProcessing(false);
      };
      
      setRecognition(newRecognition);
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const handleToggleRecording = () => {
    if (!recognition) return;
    
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
      setIsProcessing(true);
    }
  };

  return (
    <div className="space-y-1">
      <Label
        htmlFor="about"
        className="text-sm font-medium flex items-center text-gray-700"
      >
        <Info className="mr-2 h-4 w-4 text-orange-500" />
        About the Candidate*
      </Label>
      
      <div className="relative">
        <Textarea
          id="about"
          name="about"
          value={value}
          onChange={onChange}
          className={`transition-all pr-12 ${
            error
              ? "border-red-300 ring-1 ring-red-300"
              : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
          }`}
          placeholder="Brief description, background, or notes about the candidate"
          rows={3}
        />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleToggleRecording}
                disabled={!recognition}
                className={`absolute right-3 bottom-3 p-2 rounded-full transition-colors
                  ${isRecording 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-orange-500 hover:bg-gray-200'
                  } ${!recognition ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isRecording ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {!recognition ? (
                "Your browser doesn't support speech recognition"
              ) : isRecording ? (
                "Stop recording"
              ) : (
                "Click to record voice input"
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <X className="mr-1 h-4 w-4" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}