import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    const [enabledTopics, setEnabledTopics] = useState([true, false, false, false, false, false, false, false, false]);

    const unlockNextTopic = (index) => {
        setEnabledTopics((prev) =>
            prev.map((enabled, i) => (i === index + 1 ? true : enabled))
        );
    };

    return (
        <QuizContext.Provider value={{ enabledTopics, setEnabledTopics, unlockNextTopic }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => useContext(QuizContext);
