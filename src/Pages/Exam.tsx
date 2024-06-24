import React, { useEffect, useState } from 'react';
import QuestionComponent from '../Components/QuestionComponent';
import axios from 'axios';
import './Style/Exam.css';
import FinishedExamComponent from '../Components/FinishedExamComponent';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
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

function Exam() {
    const [questionData, setQuestionData] = useState<QuestionData[] | null>(null);
    const [temp, setTemp] = useState<number>(0);
    const [finishTest, setFinishTest] = useState<boolean>(false);
    const [pointAmount, setPointAmout] = useState<number>(0);
    const [moveToNextExam, setMoveToNextExam] = useState<boolean>(false);
    const [checkAnswers, setCheckAnswers] = useState<boolean>(false);
    const [cookies, setCookie] = useCookies(['questionData']);
    const [, , removeCookie] = useCookies(['questionData']);
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);


    useEffect(() => {
        //removeCookie('questionData', { path: '/' });
        if(cookies.questionData){
            //setQuestionData(cookies.questionData);
            //setQuestionData(JSON.parse(cookies.questionData));
        }
        else{        
        axios.get<QuestionData[]>('http://localhost:8080/getQuestion')
            .then(response => {
                setQuestionData(response.data);
                console.log(response.data);
                //setCookie('questionData', JSON.stringify(response.data), { path: '/', expires: oneYearFromNow });
                //setCookie('questionData', response.data, { path: '/', expires: oneYearFromNow });            
            })
            .catch(error => {
                console.error('Błąd podczas pobierania danych z backendu:', error);
            });
        }
    }, []);

    useEffect(() => {
        if(moveToNextExam === false)
            return;
        axios.get<QuestionData[]>('http://localhost:8080/getQuestion')
            .then(response => {
                setQuestionData(response.data);
                setFinishTest(false);
                setMoveToNextExam(false);
                setTemp(0);
                //setCookie('questionData', response.data, { path: '/', expires: new Date(Date.now() + 86400e3)});
                //setCookie('questionData', JSON.stringify(response.data), { path: '/', expires: oneYearFromNow });
            })
            .catch(error => {
                console.error('Błąd podczas pobierania danych z backendu:', error);
            });
    }, [moveToNextExam]);

    const handleTempChange = (updatedQuestionData: QuestionData) => {
        if (!questionData) return;

        const updatedQuestions = [...questionData];
        updatedQuestions[temp] = updatedQuestionData;

        setQuestionData(updatedQuestions);
        //setCookie('questionData', updatedQuestions, { path: '/', expires: new Date(Date.now() + 86400e3) });
        //setCookie('questionData', JSON.stringify(updatedQuestions), { path: '/', expires: oneYearFromNow });
    };

    const QuestionChange = (questionNumber: number) => {
        if (questionNumber === -2) {
            if(temp > 0){
                setTemp(temp-1);
            }
            return;
        }
        if (questionNumber === -1) {
            if(questionData){
                if(questionData?.length){
                    setTemp(temp+1);
                }
            }
            return;
        }
        setTemp(questionNumber);
    };

    const GetPoints = () => {
        //removeCookie('questionData', { path: '/' });
        var p: number = 0;

        questionData?.forEach(element => {
            if(element.userAnswer != null){
                p += element.userAnswer === element.correctAnswer ? parseInt(element.points) : 0;
            }
        });

        setPointAmout(p);
    }

    const questionKey = questionData ? `${questionData[temp]?.questionText}-${temp}` : '';
    

    return (
        <div className="examContainer">
            <Helmet>
                <title>Exam</title>
                <link/>
            </Helmet>
            <div className="leftMenu">
                 <Link to="/Home" className='menuButton'>
                        Strona Główna
                </Link>
                <Link to="/RepetetiveQuestions" className='menuButton'>
                        Losowe Pytania
 
                </Link>
            </div>
            {finishTest === false ? (
                <div className="questionContainer">
                <h1 className="questionTitle">{"Pytanie " + (temp + 1) + " - "}
                    {checkAnswers === false ? (questionData ? questionData[temp].points === "1" ? questionData[temp].points + " punkt" : questionData[temp].points + " punkty" : "") :
                    questionData ? questionData[temp].userAnswer === null || questionData[temp].userAnswer != questionData[temp].correctAnswer ? "0 / " + questionData[temp].points : questionData[temp].points + " / " + questionData[temp].points : ""
                    }
                </h1>
                {questionData ? (
                    <QuestionComponent
                        key={questionKey}
                        questionData={questionData[temp]}
                        onTempChange={handleTempChange}
                        checkAnswers={checkAnswers}
                        showCorrectAnswer={false}
                    />
                ) : (
                    <div>Loading...</div>
                )}
                <div className="navigationButtons">
                    <button onClick={() => QuestionChange(-2)} className="navButton">Poprzednie pytanie</button>
                    <button onClick={() => QuestionChange(-1)} className="navButton">Następne pytanie</button>
                    <button onClick={() => {setFinishTest(true); GetPoints()}} className="navButton">{checkAnswers === false ? "Zakończ Test" : "Zakończ Przegląd"}</button>
                </div>
                <div className="questionIndexButtons">
                    {questionData?.map((question, index) => (
                        <button
                            key={index}
                            onClick={() => QuestionChange(index)}
                            className="indexButton"
                            style={{ backgroundColor: 
                                checkAnswers === false ? question.userAnswer ? "green" : ""
                            : question.userAnswer == null ? "" : 
                            question.correctAnswer === question.userAnswer ? "#28a745" : "#dc3545"}}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
            ) : (<div>
                <FinishedExamComponent
                    key={questionKey}
                    pointAmount={pointAmount} 
                    setMoveToNextExam={setMoveToNextExam}
                    setCheckAnswers={setCheckAnswers}
                    setFinishTest={setFinishTest}
                    />
            </div>)}
            
        </div>
    );
}

export default Exam;