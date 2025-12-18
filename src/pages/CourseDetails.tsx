import { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Lightbulb, Loader2, Globe, Layers, ArrowLeft } from 'lucide-react';
import type { Course } from '../types';
import { ChatInterface } from '../components/Course/ChatInterface';
import { courseApi } from '../api/courseApi';
import { CourseSidebar } from '../components/Course/CourseSidebar';

interface CourseDetailsProps {
    courses: Course[];
    apiKey: string | null;
    onUpdateCourse: (courseId: string, updates: Partial<Course>) => void;
}

export function CourseDetails({ courses, apiKey, onUpdateCourse }: CourseDetailsProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const course = courses.find(c => c.id === id);

    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [language, setLanguage] = useState('English');
    const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

    const LANGUAGES = ['English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese', 'Dutch'];

    if (!course) {
        return <Navigate to="/" replace />;
    }

    const generateSummary = async () => {
        if (!apiKey) return;

        setIsGeneratingSummary(true);
        try {
            const response = await courseApi.summarize(course.content, apiKey, language);
            onUpdateCourse(course.id, {
                summary: response.summary,
                keyPoints: response.key_points,
                flashcards: response.flashcards,
            });
        } catch (error) {
            console.error('Failed to generate summary:', error);
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const toggleCard = (index: number) => {
        const newFlipped = new Set(flippedCards);
        if (newFlipped.has(index)) {
            newFlipped.delete(index);
        } else {
            newFlipped.add(index);
        }
        setFlippedCards(newFlipped);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <CourseSidebar courses={courses} />

            {/* Main Content */}
            <div className="flex-1 ml-80 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm z-10">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <button onClick={() => navigate('/')} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-500" />
                            </button>
                            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
                                {course.category}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{course.title}</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {course.pageCount} pages • Uploaded {course.createdAt.toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Side - Summary & Flashcards */}
                    <div className="w-1/2 p-8 overflow-y-auto custom-scrollbar">
                        <div className="max-w-2xl">
                            {/* Key Points */}
                            <div className="mb-10">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                                    Key Points
                                </h3>

                                {isGeneratingSummary ? (
                                    <div className="flex items-center justify-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <Loader2 className="w-6 h-6 animate-spin text-purple-600 mr-3" />
                                        <span className="text-gray-500 font-medium">Analyzing course content...</span>
                                    </div>
                                ) : course.keyPoints && course.keyPoints.length > 0 ? (
                                    <div className="space-y-4">
                                        {course.keyPoints.map((point, index) => (
                                            <div key={index} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
                                                <p className="text-gray-700 leading-relaxed">{point}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                                        {apiKey ? (
                                            <div className="max-w-xs mx-auto">
                                                <div className="mb-6">
                                                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Select Language</label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                        <select
                                                            value={language}
                                                            onChange={(e) => setLanguage(e.target.value)}
                                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                                                        >
                                                            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                                                        </select>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={generateSummary}
                                                    className="btn-primary w-full shadow-lg shadow-purple-200"
                                                >
                                                    Generate Summary & Flashcards
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">Please add your API key in Dashboard to start.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Flashcards */}
                            {course.flashcards && course.flashcards.length > 0 && (
                                <div className="mb-10">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                                        <Layers className="w-5 h-5 mr-2 text-blue-500" />
                                        Study Flashcards
                                    </h3>
                                    <div className="grid gap-4">
                                        {course.flashcards.map((card, index) => {
                                            const isFlipped = flippedCards.has(index);
                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => toggleCard(index)}
                                                    className={`cursor-pointer perspective-1000 transition-all duration-300 ${isFlipped ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'} border rounded-xl p-6 relative overflow-hidden group min-h-[120px] flex flex-col justify-center`}
                                                >
                                                    <div className="absolute top-3 left-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {isFlipped ? 'Answer' : 'Question'}
                                                    </div>
                                                    <p className={`text-base font-medium text-center ${isFlipped ? 'text-blue-800' : 'text-gray-800'}`}>
                                                        {isFlipped ? card.back : card.front}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Summary Text */}
                            {course.summary && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Full Summary</h4>
                                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                        <p className="text-gray-600 leading-loose text-justify">{course.summary}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Chat */}
                    <div className="w-1/2 border-l border-gray-200 bg-white">
                        <ChatInterface courseContent={course.content} apiKey={apiKey} />
                    </div>
                </div>
            </div>
        </div>
    );
}
