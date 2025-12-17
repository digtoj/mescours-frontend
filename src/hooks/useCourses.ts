import { useState, useEffect } from 'react';
import type { Course } from '../types';

const COURSES_STORAGE_KEY = 'mescours_courses';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load courses from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(COURSES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      const coursesWithDates = parsed.map((c: Course) => ({
        ...c,
        createdAt: new Date(c.createdAt),
      }));
      setCourses(coursesWithDates);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever courses change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
    }
  }, [courses, isLoaded]);

  // Add a new course
  const addCourse = (course: Omit<Course, 'id' | 'createdAt'>) => {
    const newCourse: Course = {
      ...course,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setCourses((prev) => [newCourse, ...prev]);
    return newCourse;
  };

  // Update a course
  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id ? { ...course, ...updates } : course
      )
    );
  };

  // Delete a course
  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  // Get a single course
  const getCourse = (id: string) => {
    return courses.find((course) => course.id === id);
  };

  return {
    courses,
    isLoaded,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourse,
  };
}
