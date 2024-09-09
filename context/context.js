import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    const [completedTopicIndex, setCompletedTopicIndex] = useState(null);

    const handleComplete = (index) => {
        setCompletedTopicIndex(index);
    };

    return (
        <QuizContext.Provider value={{ completedTopicIndex, handleComplete }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => useContext(QuizContext);
