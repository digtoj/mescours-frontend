import { Rocket, Key, X, ExternalLink } from 'lucide-react';

interface OnboardingCardProps {
  onDismiss: () => void;
  onOpenApiKeyModal: () => void;
}

export function OnboardingCard({ onDismiss, onOpenApiKeyModal }: OnboardingCardProps) {
  return (
    <div className="mb-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Close button */}
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="relative">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            <Rocket className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold">Welcome to MesCoursAI! 🎓</h2>
        </div>

        <p className="text-purple-100 mb-6 max-w-2xl">
          Transform your study materials into interactive learning experiences with
          AI-powered summaries, audio explanations, and smart Q&A.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                1
              </div>
              <h3 className="font-semibold">Get Your API Key</h3>
            </div>
            <p className="text-purple-100 text-sm">
              Create a free Gemini API key from Google AI Studio. It takes less than 1 minute!
            </p>
          </div>

          <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                2
              </div>
              <h3 className="font-semibold">Upload Course</h3>
            </div>
            <p className="text-purple-100 text-sm">
              Drop your PDF, slides, or notes. Our AI will process and understand your content.
            </p>
          </div>

          <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                3
              </div>
              <h3 className="font-semibold">Learn Smarter</h3>
            </div>
            <p className="text-purple-100 text-sm">
              Listen to audio summaries, read key points, and ask questions about your material.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenApiKeyModal}
            className="bg-white text-purple-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-opacity-90 transition flex items-center"
          >
            <Key className="w-4 h-4 mr-2" />
            Add Your Gemini Key
          </button>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white bg-opacity-20 px-5 py-2.5 rounded-xl font-medium hover:bg-opacity-30 transition flex items-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Get Free API Key
          </a>
          <button
            onClick={onDismiss}
            className="text-purple-200 hover:text-white px-4 py-2 transition text-sm"
          >
            I'll do this later
          </button>
        </div>
      </div>
    </div>
  );
}
