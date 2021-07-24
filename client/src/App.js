import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AppRoutes from './Routes/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/global.css';
import './assets/css/custom.css';

const App = () => (
    <Router>
        <Route path="/" component={AppRoutes} />
    </Router>
);

export default App;
