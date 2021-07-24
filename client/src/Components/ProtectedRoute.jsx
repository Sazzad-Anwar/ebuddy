/* eslint-disable react/jsx-props-no-spreading */
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { useToasts } from 'react-toast-notifications';
// import { useEffect } from 'react';

const ProtectedRoute = ({ children, ...rest }) => {
    const { user } = useSelector((state) => state.userLogin);
    // const { addToast } = useToasts();

    return (
        <Route
            {...rest}
            render={({ location }) =>
                user && user.isLoggedIn ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};
export default ProtectedRoute;
