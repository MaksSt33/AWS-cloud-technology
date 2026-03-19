import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toastr from 'toastr';
import * as courseAction from '../../action/CourseAction';
import CourseList from './CourseList';

const CourseListContainer = () => {
    const [selectedCourseId, setSelectedCourseId] = useState(undefined);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const courses = useSelector(state => state.coursesReducer.courses);

    useEffect(() => {
        dispatch(courseAction.getCoursesAction())
            .catch(error => toastr.error(error));
    }, [dispatch]);

    const handleAddCourse = () => navigate('/course');

    const handleEditCourse = () => {
        if (selectedCourseId) {
            setSelectedCourseId(undefined);
            navigate(`/course/${selectedCourseId}`);
        }
    };

    const handleDelete = () => {
        if (selectedCourseId) {
            setSelectedCourseId(undefined);
            dispatch(courseAction.deleteCourseAction(selectedCourseId))
                .catch(error => toastr.error(error));
        }
    };

    const handleRowSelect = (row) => setSelectedCourseId(row.id);

    if (!courses) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid">
            <div className="row mt-3">
                <div className="col">
                    <h1>Courses</h1>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col">
                    <div className="btn-group" role="group">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleAddCourse}
                        >
                            <i className="fas fa-plus" aria-hidden="true" /> New
                        </button>

                        <button
                            type="button"
                            className="btn btn-warning ms-2"
                            onClick={handleEditCourse}
                        >
                            <i className="fas fa-pencil" aria-hidden="true" /> Edit
                        </button>

                        <button
                            type="button"
                            className="btn btn-danger ms-2"
                            onClick={handleDelete}
                        >
                            <i className="fas fa-trash" aria-hidden="true" /> Delete
                        </button>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <CourseList
                        courses={courses}
                        handleRowSelect={handleRowSelect}
                        selectedCourseId={selectedCourseId}
                    />
                </div>
            </div>
        </div>
    );
};

export default CourseListContainer;
