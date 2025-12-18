import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { CourseDetails } from './pages/CourseDetails';
import { useApiKey } from './hooks/useApiKey';
import { useCourses } from './hooks/useCourses';
import './index.css';

function App() {
  const { apiKey, hasApiKey, saveApiKey } = useApiKey();
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Dashboard
            apiKey={apiKey}
            hasApiKey={hasApiKey}
            saveApiKey={saveApiKey}
            courses={courses}
            addCourse={addCourse}
            updateCourse={updateCourse}
            deleteCourse={deleteCourse}
          />
        } />
        <Route path="/course/:id" element={
          <CourseDetails
            courses={courses}
            apiKey={apiKey}
            onUpdateCourse={updateCourse}
          />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
