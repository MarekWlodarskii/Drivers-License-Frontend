import React, { useEffect, useState } from 'react';
import QuestionComponent from '../Components/QuestionComponent';
import axios from 'axios';
import './Style/RepetetiveQuestions.css';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

interface QuestionData {
    questionText: string;
    answers: {
        A: string;
        B: string;
        C?: string;
    };
    correctAnswer: string;
    fileName: string;
    fileType: string;
    isYesNo: boolean;
    basicOrSpecial: string;
    points: string;
    userAnswer?: string;
}

function RepetetiveQuestions() {
    const [questionData, setQuestionData] = useState<QuestionData | null>(null);
    const [temp, setTemp] = useState<number>(0);
    const [type, setType] = useState<string>("all");

    useEffect(() => {
        axios.get<QuestionData>(`http://localhost:8080/getOneQuestion`, {
            params: { type }
          })
            .then(response => {
                setQuestionData(response.data);
            })
            .catch(error => {
                console.error('Błąd podczas pobierania danych z backendu:', error);
            });
    }, [type]);

    const handleTempChange = (updatedQuestionData: QuestionData) => {
        setQuestionData(updatedQuestionData);
    };

    const QuestionChange = () => {
        axios.get<QuestionData>(`http://localhost:8080/getOneQuestion`, {
            params: { type }
          })
            .then(response => {
                setQuestionData(response.data);
                setTemp(temp + 1);
            })
            .catch(error => {
                console.error('Błąd podczas pobierania danych z backendu:', error);
            });
    };

    const questionKey = questionData ? `${questionData?.questionText}-${temp}` : '';

    return (
        <div className="repetetiveQuestionsContainer">
            <Helmet>
                <title>Pytania Losowe</title>
                <link/>
            </Helmet>
            <div className="leftMenu">
            <Link to="/Home" className='menuButton'>
                        Strona Główna
                </Link>
                <Link to="/Exam" className='menuButton'>
                        Rozwiąż Egzamin
 
                </Link>
            </div>
            <div className="questionContainer">
            <h1 className="questionTitle">{"Pytanie "}
                    {questionData ? questionData.userAnswer === questionData.correctAnswer ? " - " + questionData.points + " / " + questionData.points : " - " + "0 / " + questionData.points :
                        ""
                    }
                </h1>
                {questionData ? (
                    <QuestionComponent
                        key={questionKey}
                        questionData={questionData}
                        onTempChange={handleTempChange}
                        showCorrectAnswer={true}
                        checkAnswers={false}
                    />
                ) : (
                    <div>Loading...</div>
                )}
                <div className="nextButtonContainer">
                    <button onClick={QuestionChange} className="nextButton">Następne pytanie</button>
                </div>
            </div>
        </div>
    );
}

export default RepetetiveQuestions;