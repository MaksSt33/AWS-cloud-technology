import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import toastr from 'toastr';


const useAsyncLoader = (getActions, deps) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    // Keep a ref so the effect body always sees the latest factory without
    // needing it in the dependency array (avoids stale-closure issues).
    const getActionsRef = useRef(getActions);
    getActionsRef.current = getActions;

    useEffect(() => {
        setLoading(true);
        Promise.all(getActionsRef.current().map(action => dispatch(action)))
            .catch(err => toastr.error(err))
            .finally(() => setLoading(false));
    }, deps); // eslint-disable-line

    return { loading };
};

export default useAsyncLoader;
