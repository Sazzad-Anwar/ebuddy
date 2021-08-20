/* eslint-disable no-unused-vars */
import { Switch, Route, Redirect } from 'react-router-dom';
import HomeScreen from '../Screens/HomeScreen';
import NotFound from '../CustomComponents/NotFound';
import ProtectedRoute from '../Components/ProtectedRoute';
import Chat from '../Screens/Chat';
import Test from '../Components/Test';

const AppRoutes = () => (
    <Switch>
        <Route path="/test" component={Test} />
        <ProtectedRoute path="/chat">
            <Chat />
        </ProtectedRoute>
        <Route path="/not-found" component={NotFound} />
        <Route exact path="/" component={HomeScreen} />
        <Redirect to="/not-found" />
    </Switch>
);

export default AppRoutes;
