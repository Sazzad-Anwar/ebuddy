/* eslint-disable react/jsx-props-no-spreading */
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, ...rest }) => {
    const { user } = useSelector((state) => state.userLogin);
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
