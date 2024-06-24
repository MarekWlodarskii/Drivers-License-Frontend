import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './Style/QuestionComponent.css';

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

interface Props {
    questionData: QuestionData;
    onTempChange: (newQuestionData: QuestionData) => void;
    showCorrectAnswer?: boolean;
    checkAnswers?: boolean;
}

const QuestionComponent: React.FC<Props> = ({ questionData, onTempChange, showCorrectAnswer, checkAnswers }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [isAnswered, setIsAnswered] = useState<boolean>(false);
    const [mediaUrl, setMediaUrl] = useState<string | undefined>();
    const mediaName: string = questionData.fileName;

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const response = await axios.get('http://localhost:8080/getMedia', {
                    params: { mediaName },
                    responseType: 'text'
                });
                const mediaUrl = `data:${questionData.fileType === 'mp4' ? 'video/mp4' : 'image/jpeg'};base64,${response.data}`;
                setMediaUrl(mediaUrl);
            } catch (error) {
                console.error('Błąd podczas pobierania pliku media z backendu:', error);
            }
        };

        fetchMedia();
    }, [mediaName, questionData.fileType]);

    const handleVideoLoaded = () => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const handleClick = (answer: string) => {
        console.log(questionData.correctAnswer);
        if(checkAnswers === true || (isAnswered === true && showCorrectAnswer === true))
            return;


            const updatedQuestionData: QuestionData = {
                ...questionData,
                userAnswer: answer,
            };
            onTempChange(updatedQuestionData);
        

        if (showCorrectAnswer && !isAnswered) {
            
            const e = document.getElementById(answer);
            const correct = document.getElementById(questionData.correctAnswer);
            if (e) {
                e.classList.add(questionData.correctAnswer === answer ? 'correct' : 'incorrect');
            }
            if (correct) {
                correct.classList.add('correct');
            }
            setIsAnswered(true);
        };
    };

    if (!questionData) {
        return <div>Loading...</div>;
    }

    const { questionText, answers, fileType } = questionData;

    return (
        <div className="pageContainer">
            <div className="contentContainer">
                <div className="mediaContainer">
                    {mediaUrl && (
                        fileType === 'VID' ? (
                            <video
                                ref={videoRef}
                                width="100%"
                                height="auto"
                                autoPlay
                                muted
                                controls
                                onLoadedMetadata={handleVideoLoaded}
                            >
                                <source src={mediaUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : fileType === 'IMG' ? (
                            <img ref={imgRef} src={mediaUrl} alt="Question related" style={{ width: '100%', height: 'auto' }} />
                        ) : null
                    )}
                </div>
                <div className="questionAndButtonsContainer">
                    <p className="question">{questionText}</p>
                    <div className="buttonContainer">
                        <button
                            id="A"
                            type="button"
                            onClick={() => handleClick('A')}
                            className={checkAnswers === false ? 
                                (questionData.userAnswer === 'A' && showCorrectAnswer === false) ? 'correct' : ''
                            : questionData.userAnswer === 'A' && questionData.userAnswer === questionData.correctAnswer ? 'correct' :
                            questionData.userAnswer === 'A' ? 'incorrect' :
                            questionData.correctAnswer === 'A' ? 'correct' : ''
                            }
                        >
                            A. {answers['A']}
                        </button>
                        <button
                            id="B"
                            type="button"
                            onClick={() => handleClick('B')}
                            className={checkAnswers === false ? 
                                (questionData.userAnswer === 'B' && showCorrectAnswer === false) ? 'correct' : ''
                            : questionData.userAnswer === 'B' && questionData.userAnswer === questionData.correctAnswer ? 'correct' :
                            questionData.userAnswer === 'B' ? 'incorrect' :
                            questionData.correctAnswer === 'B' ? 'correct' : ''
                            }
                        >
                            B. {answers['B']}
                        </button>
                        {answers['C'] && (
                            <button
                                id="C"
                                type="button"
                                onClick={() => handleClick('C')}
                                className={checkAnswers === false ? 
                                    (questionData.userAnswer === 'C' && showCorrectAnswer === false) ? 'correct' : ''
                                : questionData.userAnswer === 'C' && questionData.userAnswer === questionData.correctAnswer ? 'correct' :
                                questionData.userAnswer === 'C' ? 'incorrect' :
                                questionData.correctAnswer === 'C' ? 'correct' : ''
                                }
                            >
                                C. {answers['C']}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionComponent;