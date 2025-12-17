import { useState, useEffect } from 'react';
import { X, Play, Pause, Headphones, Lightbulb, Loader2, Volume2 } from 'lucide-react';
import type { Course } from '../../types';
import { ChatInterface } from './ChatInterface';
import { courseApi } from '../../api/courseApi';

interface CourseModalProps {
  course: Course;
  apiKey: string | null;
  onClose: () => void;
  onUpdate: (updates: Partial<Course>) => void;
}

export function CourseModal({ course, apiKey, onClose, onUpdate }: CourseModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  // const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);

  // Generate summary on first open if not exists
  useEffect(() => {
    if (!course.summary && apiKey) {
      generateSummary();
    }
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const generateSummary = async () => {
    if (!apiKey) return;

    setIsGeneratingSummary(true);
    try {
      const response = await courseApi.summarize(course.content, apiKey);
      onUpdate({
        summary: response.summary,
        keyPoints: response.key_points,
        audioScript: response.audio_script,
      });
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const text = course.audioScript || course.summary || course.content.substring(0, 1000);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      // setSpeechSynthesis(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="gradient-bg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded">
                {course.category}
              </span>
              <h2 className="text-2xl font-bold mt-2">{course.title}</h2>
              <p className="text-purple-100 text-sm mt-1">
                {course.pageCount} pages • Uploaded {course.createdAt.toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Side - Audio & Summary */}
          <div className="w-1/2 border-r border-gray-100 p-6 overflow-y-auto">
            {/* Audio Player */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                <Headphones className="w-4 h-4 mr-2 text-purple-500" />
                Audio Summary
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlay}
                    disabled={!course.summary && !apiKey}
                    className="w-14 h-14 gradient-bg rounded-full flex items-center justify-center text-white hover:opacity-90 transition shadow-lg disabled:opacity-50"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full gradient-bg rounded-full transition-all ${isPlaying ? 'w-1/3' : 'w-0'
                          }`}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {course.summary ? 'Click to listen' : 'Generate summary first'}
                    </p>
                  </div>
                  <Volume2 className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Key Points */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                Key Points
              </h3>

              {isGeneratingSummary ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500 mr-2" />
                  <span className="text-gray-500">Generating summary...</span>
                </div>
              ) : course.keyPoints && course.keyPoints.length > 0 ? (
                <div className="space-y-3">
                  {course.keyPoints.map((point, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 border-l-4 border-purple-500"
                    >
                      <p className="text-sm text-gray-700">{point}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  {apiKey ? (
                    <button
                      onClick={generateSummary}
                      className="btn-primary"
                    >
                      Generate Summary
                    </button>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Add your Gemini API key to generate summaries
                    </p>
                  )}
                </div>
              )}

              {/* Summary Text */}
              {course.summary && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{course.summary}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Q&A Chat */}
          <div className="w-1/2 flex flex-col">
            <ChatInterface courseContent={course.content} apiKey={apiKey} />
          </div>
        </div>
      </div>
    </div>
  );
}
