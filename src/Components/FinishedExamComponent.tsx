import React from 'react';
import './Style/FinishedExamComponent.css';

interface Props {
    pointAmount: number;
    setMoveToNextExam: (nextExam: boolean) => void;
    setCheckAnswers: (nextExam: boolean) => void;
    setFinishTest: (finishTest: boolean) => void;
}

const FinishedExamComponent: React.FC<Props> = ({ pointAmount, setMoveToNextExam, setCheckAnswers, setFinishTest }: Props) => {
    const maxPoints: number = 74;

    return (
        <div className="finishedExamContainer">
            <div className="scoreDisplay">
                <h1>Wynik:</h1>
                {pointAmount}/{maxPoints}
            </div>
            <div className="buttonFinishedContainer">
                <button className="finishedButton" onClick={() => {setCheckAnswers(true); setFinishTest(false)}}>Przejrzyj Test</button>
                <button className="finishedButton" onClick={() => {setMoveToNextExam(true); setCheckAnswers(false)}}>Rozwiąż Kolejny</button>
            </div>
        </div>
    );
};

export default FinishedExamComponent;