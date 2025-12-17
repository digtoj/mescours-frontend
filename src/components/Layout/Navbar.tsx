import { GraduationCap, Key, User } from 'lucide-react';

interface NavbarProps {
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
}

export function Navbar({ hasApiKey, onOpenApiKeyModal }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="gradient-bg text-white p-2 rounded-lg mr-3">
              <GraduationCap className="h-6 w-6" /> {/* Using Lucide icon properly */}
            </div>
            <span className="text-xl font-bold text-gray-800">CourseAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenApiKeyModal}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:border-gray-300 transition"
            >
              <Key className="mr-2 h-4 w-4 text-purple-500" />
              <span>{hasApiKey ? 'Key Saved' : 'Add API Key'}</span>
            </button>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
