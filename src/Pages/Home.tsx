import React from 'react';
import { Link } from 'react-router-dom';
import './Style/Home.css';
import { Helmet } from 'react-helmet';

function Exam() {
    return (
        <div className="homePageContainer">
            <Helmet>
                <title>Home</title>
                <link/>
            </Helmet>
            <div className="homeContentContainer">
                <Link to="/Exam">
                    <button className="homeButton">
                        Rozwiąż Egzamin
                    </button>
                </Link>
                <Link to="/RepetetiveQuestions">
                    <button className="homeButton">
                        Losowe Pytania
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Exam;