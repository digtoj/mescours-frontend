import { useState } from 'react';
import { Search, Book } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import type { Course } from '../../types';

interface CourseSidebarProps {
    courses: Course[];
}

export function CourseSidebar({ courses }: CourseSidebarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const { id } = useParams();

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-10">
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-2 text-purple-600 mb-6">
                    <Book className="w-6 h-6" />
                    <span className="font-bold text-lg tracking-tight">MesCours</span>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredCourses.map(course => (
                    <Link
                        key={course.id}
                        to={`/course/${course.id}`}
                        className={`block p-3 rounded-xl transition-all ${course.id === id
                                ? 'bg-purple-50 text-purple-700 border border-purple-100 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                            }`}
                    >
                        <div className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                            {course.category}
                        </div>
                        <div className="font-medium truncate">{course.title}</div>
                    </Link>
                ))}

                {filteredCourses.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        No courses found
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-100">
                <Link to="/" className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
