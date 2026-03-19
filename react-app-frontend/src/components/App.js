import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import CourseListContainer from './course/CourseListContainer';
import AddOrEditCourseContainer from './course/AddOrEditCourseContainer';

const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<CourseListContainer />} />
                    <Route path="/course" element={<AddOrEditCourseContainer />} />
                    <Route path="/course/:id" element={<AddOrEditCourseContainer />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;