import React from 'react';
import { SafeAreaView } from "react-native";
import Quiz from "../components/Quiz";
import quiz from '../constants/quiz.js';

const QuizScreen = ({ route }) => {
    const { topicIndex } = route.params;
    const topic = quiz[topicIndex];

    return (
        <SafeAreaView>
            <Quiz topic={topic} topicIndex={topicIndex} />
        </SafeAreaView>
    );
};

export default QuizScreen;
