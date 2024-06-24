import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
}
from 'react-router-dom';
import Home from './Pages/Home';
import Exam from './Pages/Exam';
import RepetetiveQuestions from './Pages/RepetetiveQuestions';


const App: React.FC = () => {
    return (
        <div className="App">
            <BrowserRouter basename={process.env.PUBLIC_URL}>
              <Routes>
                <Route path='/' index element={<Home/>} />
                <Route path='/Home' index element={<Home/>} />
                <Route path='/Exam' index element={<Exam/>} />
                <Route path='/RepetetiveQuestions' index element={<RepetetiveQuestions/>} />
              </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;