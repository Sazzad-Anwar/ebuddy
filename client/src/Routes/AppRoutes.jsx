import { Switch, Route, Redirect } from 'react-router-dom';
import HomeScreen from '../Screens/HomeScreen';
import NotFound from '../CustomComponents/NotFound';
import ProtectedRoute from '../Components/ProtectedRoute';
import Login from '../Screens/Login';
import Chat from '../Screens/Chat';

const AppRoutes = () => (
    <Switch>
        <Route path="/login" component={Login} />
        <ProtectedRoute path="/chat">
            <Chat />
        </ProtectedRoute>
        <Route path="/not-found" component={NotFound} />
        <Route exact path="/" component={HomeScreen} />
        <Redirect to="/not-found" />
    </Switch>
);

export default AppRoutes;
