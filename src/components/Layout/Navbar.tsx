import { GraduationCap, Key } from 'lucide-react';

interface NavbarProps {
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
}

export function Navbar({ hasApiKey, onOpenApiKeyModal }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="gradient-bg text-white p-2 rounded-lg mr-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-800">MesCoursAI</span>
          </div>

          {/* API Key Button */}
          <div className="flex items-center">
            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center px-4 py-2 text-sm font-medium border rounded-lg transition ${
                hasApiKey
                  ? 'border-green-300 text-green-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Key className="w-4 h-4 mr-2 text-purple-500" />
              {hasApiKey ? 'Key Saved ✓' : 'Add API Key'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
