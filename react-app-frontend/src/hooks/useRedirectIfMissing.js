import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';

/**
 * Redirects to `to` if, once loading is finished, `entity` is still falsy.
 * Only runs when an `id` is present (edit mode); skipped for create/list pages.
 *
 * @param {boolean} loading  Loading state returned by useAsyncLoader.
 * @param {*}       entity   The entity to check (undefined / null triggers the redirect).
 * @param {Object}  [opts]
 * @param {string}  [opts.to='/']             Redirect destination.
 * @param {string}  [opts.message='Not found'] Toastr error message.
 *
 * @example
 * useRedirectIfMissing(loading, course, { message: 'Course not found' });
 */
const useRedirectIfMissing = (loading, entity, { to = '/', message = 'Not found' } = {}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !entity) {
            toastr.error(message);
            navigate(to, { replace: true });
        }
    }, [loading, entity, message, to, navigate]);
};

export default useRedirectIfMissing;
