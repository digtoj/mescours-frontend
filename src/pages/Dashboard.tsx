import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Layout/Navbar';
import { OnboardingCard } from '../components/Onboarding/OnboardingCard';
import { ApiKeyModal } from '../components/ApiKey/ApiKeyModal';
import { FileUpload } from '../components/Course/FileUpload';
import { CourseCard } from '../components/Course/CourseCard';
import type { Course } from '../types';

interface DashboardProps {
  apiKey: string | null;
  hasApiKey: boolean;
  saveApiKey: (key: string) => void;
  courses: Course[];
  addCourse: (course: Omit<Course, "id" | "createdAt">) => Course;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
}

export function Dashboard({ apiKey, hasApiKey, saveApiKey, courses, addCourse, deleteCourse }: DashboardProps) {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hide onboarding if user has API key
  useEffect(() => {
    if (hasApiKey) {
      setShowOnboarding(false);
    }
  }, [hasApiKey]);

  // Check localStorage for onboarding dismissal
  useEffect(() => {
    const dismissed = localStorage.getItem('onboarding_dismissed');
    if (dismissed === 'true') {
      setShowOnboarding(false);
    }
  }, []);

  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboarding_dismissed', 'true');
  };

  const handleUploadSuccess = (data: { text: string; pageCount: number; fileName: string }) => {
    // Extract title from filename
    const title = data.fileName.replace(/\.[^/.]+$/, ''); // Remove extension

    // Add new course
    const newCourse = addCourse({
      title,
      category: 'Uploaded',
      content: data.text,
      pageCount: data.pageCount,
    });

    // Navigate to course page
    navigate(`/course/${newCourse.id}`);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  const handleSaveApiKey = (key: string) => {
    saveApiKey(key);
    setShowOnboarding(false);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      deleteCourse(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar hasApiKey={hasApiKey} onOpenApiKeyModal={() => setShowApiKeyModal(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Onboarding Card */}
        {showOnboarding && (
          <OnboardingCard
            onDismiss={handleDismissOnboarding}
            onOpenApiKeyModal={() => setShowApiKeyModal(true)}
          />
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-500">
            Upload your course materials and let AI help you study
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        {/* File Upload */}
        <div className="mb-8">
          <FileUpload
            apiKey={apiKey}
            onUploadSuccess={handleUploadSuccess}
            onError={handleError}
          />
        </div>

        {/* Courses Grid */}
        {courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => navigate(`/course/${course.id}`)}
                onDelete={() => handleDeleteCourse(course.id)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {courses.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400">No courses yet. Upload your first document above!</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleSaveApiKey}
      />
    </div>
  );
}
