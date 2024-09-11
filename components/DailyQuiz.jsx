// Set timer for 24h

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dailyQuiz from '../constants/dailyQuiz.js';

const DailyQuiz = () => {
    const navigation = useNavigation();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [nextQuizAvailable, setNextQuizAvailable] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const intervalRef = useRef(null);

    // Time allowed between quizzes (2 minutes = 120000ms)
    const QUIZ_INTERVAL = 120000; // 2 minutes in milliseconds

    useEffect(() => {
        checkQuizAvailability();
    }, []);

    useEffect(() => {
        if (countdown > 0 && nextQuizAvailable) {
            intervalRef.current = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown <= 1) {
                        clearInterval(intervalRef.current);
                        setNextQuizAvailable(false);
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
        }

        return () => clearInterval(intervalRef.current);
    }, [countdown, nextQuizAvailable]);

    const checkQuizAvailability = async () => {
        const lastCompletedTime = await AsyncStorage.getItem('lastQuizTime');
        if (lastCompletedTime) {
            const timeDifference = Date.now() - parseInt(lastCompletedTime, 10);
            if (timeDifference < QUIZ_INTERVAL) {
                setNextQuizAvailable(true);
                setCountdown(Math.floor((QUIZ_INTERVAL - timeDifference) / 1000));
            }
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const handleOptionPress = (selectedAnswer) => {
        if (selectedOption === null) {
            setSelectedOption(selectedAnswer);
    
            if (selectedAnswer === correctAnswer) {
                setScore(prevScore => prevScore + 100);
            }
    
            setTimeout(() => {
                if (currentQuestionIndex < 9) {
                    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                    setSelectedOption(null);
                } else {
                    finishQuiz();
                }
            }, 1000);
        }
    };
    

    const finishQuiz = async () => {
        setQuizFinished(true);
        await AsyncStorage.setItem('lastQuizTime', Date.now().toString());
    };

    if (nextQuizAvailable) {
        return (
            <View style={styles.container}>
                <Text style={styles.scoreText}>
                    Next daily quiz will be available in {formatTime(countdown)}.
                </Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
                    <Text style={styles.goBackText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (quizFinished) {
        return (
            <View style={styles.container}>
                <Text style={styles.scoreText}>You have completed all your daily tasks for today. See you tomorrow!</Text>
                <Text style={styles.scoreText}>Final Score: {score}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
                    <Text style={styles.goBackText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentQuestion = dailyQuiz[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer;

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>{currentQuestion.statement}</Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <TouchableOpacity
                style={[
                    styles.optionButton,
                    selectedOption === true && (correctAnswer ? styles.correctOption : styles.incorrectOption)
                ]}
                onPress={() => handleOptionPress(true)}
                disabled={selectedOption !== null}
            >
                <Text style={styles.optionText}>True</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.optionButton,
                    selectedOption === false && (correctAnswer ? styles.incorrectOption : styles.correctOption)
                ]}
                onPress={() => handleOptionPress(false)}
                disabled={selectedOption !== null}
            >
                <Text style={styles.optionText}>False</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    questionText: {
        fontSize: 18,
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 18,
        marginBottom: 10
    },
    optionButton: {
        padding: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '40%',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionText: {
        fontSize: 16
    },
    correctOption: {
        backgroundColor: 'green',
        borderColor: 'green'
    },
    incorrectOption: {
        backgroundColor: 'red',
        borderColor: 'red'
    },
    goBackButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    goBackText: {
        color: '#FFF',
        fontSize: 16
    }
});

export default DailyQuiz;
