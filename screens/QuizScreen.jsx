import React, { useEffect } from 'react';
import { View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Quiz from "../components/Quiz";
import quiz from '../constants/quiz.js';

const QuizScreen = ({ route }) => {
    const { topicIndex } = route.params;
    const topic = quiz[topicIndex];

    useEffect(() => {
        const markQuizAsVisited = async () => {
            try {
                await AsyncStorage.setItem('quizVisited', 'true');
            } catch (error) {
                console.error("Failed to mark quiz as visited:", error);
            }
        };

        markQuizAsVisited();
    }, []);

    return (
        <View>
            <Quiz topic={topic} topicIndex={topicIndex} />
        </View>
    );
};

export default QuizScreen;
