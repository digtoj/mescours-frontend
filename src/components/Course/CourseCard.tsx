import { FileText, Headphones, MessageSquare, Trash2 } from 'lucide-react';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  onDelete?: () => void;
}

export function CourseCard({ course, onClick, onDelete }: CourseCardProps) {
  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  // Get gradient based on category
  const getGradient = () => {
    const gradients = [
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-400',
      'from-orange-400 to-pink-500',
      'from-green-500 to-teal-400',
      'from-red-500 to-orange-400',
    ];
    const index = course.title.length % gradients.length;
    return gradients[index];
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div
      onClick={onClick}
      className="card overflow-hidden hover:shadow-md transition cursor-pointer group"
    >
      {/* Header with gradient */}
      <div className={`h-32 bg-gradient-to-br ${getGradient()} flex items-center justify-center relative`}>
        <FileText className="w-12 h-12 text-white opacity-50" />
        
        {/* Delete button */}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-opacity-30 transition"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
            {course.category}
          </span>
          <span className="text-xs text-gray-400">{formatDate(course.createdAt)}</span>
        </div>

        <h3 className="font-semibold text-gray-800 mb-1 truncate">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {course.content.substring(0, 100)}...
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-400">
            <FileText className="w-4 h-4 mr-1" />
            <span>{course.pageCount} pages</span>
          </div>

          <div className="flex space-x-2">
            {course.summary && (
              <span
                className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center"
                title="Summary Ready"
              >
                <Headphones className="w-4 h-4 text-green-500" />
              </span>
            )}
            <span
              className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center"
              title="Q&A Available"
            >
              <MessageSquare className="w-4 h-4 text-blue-500" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
