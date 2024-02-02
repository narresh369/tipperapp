// AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import TipperList from './components/TipperList';
import Pricing from './components/Pricing';
import TipperRpts from './components/TipperRpts';
import About from './components/About';
import Tipper from './components/Tipper';
import TipperEdit from './components/TipperEdit';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tipper" element={<Tipper />} />
                <Route path="/tipperlist" element={<TipperList />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/reports" element={<TipperRpts />} />
                <Route path="/about" element={<About />} />
                <Route path="/tipper/edit/:id" element={<TipperEdit />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
