import React from 'react';
import './Style/FinishedExamComponent.css';

interface Props {
    pointAmount: number;
    setPointAmount: (points: number) => void;
    setMoveToNextExam: (nextExam: boolean) => void;
}

const CheckAnswers: React.FC<Props> = ({ pointAmount, setPointAmount, setMoveToNextExam }: Props) => {
    const maxPoints: number = 74;

    const NextExam = () => {
        setMoveToNextExam(true);
    };

    return (
        <div className="finishedExamContainer">
            <div className="scoreDisplay">
                {pointAmount}/{maxPoints}
            </div>
            <div className="buttonFinishedContainer">
                <button className="finishedButton">Przejrzyj Test</button>
                <button className="finishedButton" onClick={() => NextExam()}>Rozwiąż Kolejny</button>
            </div>
        </div>
    );
};

export default CheckAnswers;