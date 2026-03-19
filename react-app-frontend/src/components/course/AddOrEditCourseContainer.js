import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toastr from 'toastr';
import * as courseAction from '../../action/CourseAction';
import * as authorAction from '../../action/AuthorAction';
import CourseForm from './CourseForm';
import { authorsFormattedForDropdown } from '../../selectors/selectors';
import useAsyncLoader from '../../hooks/useAsyncLoader';
import useRedirectIfMissing from '../../hooks/useRedirectIfMissing';

const AddOrEditCourseContainer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const initialValues = useSelector(state => {
        if (id && state.selectedCourseReducer.course && id === state.selectedCourseReducer.course.id) {
            return state.selectedCourseReducer.course;
        }
        return undefined;
    });

    const authors = useSelector(state =>
        authorsFormattedForDropdown(state.authorReducer.authors)
    );

    const { loading } = useAsyncLoader(
        () => [courseAction.getCourseAction(id), authorAction.getAuthorsAction()],
        [id]
    );

    // Redirect back to the list if a course ID was given but nothing was found
    useRedirectIfMissing(loading, id ? initialValues : true, { message: 'Course not found' });

    const handleSave = (values) => {
        const course = {
            id: values.id,
            title: values.title,
            watchHref: values.watchHref,
            authorId: values.authorId,
            length: values.length,
            category: values.category
        };

        dispatch(courseAction.saveCourseAction(course))
            .then(() => {
                toastr.success('Course saved');
                navigate('/');
            }).catch(error => toastr.error(error));
    };

    const handleCancel = (event) => {
        event.preventDefault();
        navigate('/');
    };

    const heading = initialValues && initialValues.id ? 'Edit' : 'Add';

    if (loading && id) {
        return <div className="container mt-4">Loading...</div>;
    }

    return (
        <div className="container">
            <CourseForm
                heading={heading}
                authors={authors || []}
                handleSave={handleSave}
                handleCancel={handleCancel}
                initialValues={initialValues}
            />
        </div>
    );
};

export default AddOrEditCourseContainer;
