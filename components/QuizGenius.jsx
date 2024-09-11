// Share results button on finish
// Total balance

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import quiz from '../constants/quiz.js';
import shuffleArray from '../utils/shuffle.js';
import { useQuiz } from '../context/context.js';

const QuizGenius = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(120);
    const [hintModalVisible, setHintModalVisible] = useState(false);
    const [hintApplied, setHintApplied] = useState(false);
    const [nextLevelModalVisible, setNextLevelModalVisible] = useState(false);

    const navigation = useNavigation();
    const { updateCommonScore } = useQuiz();

    useEffect(() => {
        setQuestions(shuffleArray(quiz));
        const timerId = setInterval(() => {
            setTimer(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timerId);
                    handleFinishQuiz();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        if (currentQuestionIndex > 0 && currentQuestionIndex % 2 === 0) {
            setTimer(prevTime => prevTime + 20);
        }
    }, [currentQuestionIndex]);

    const handleOptionPress = (index) => {
        if (selectedOptionIndex === null && !hintApplied) {
            setSelectedOptionIndex(index);
            const isCorrect = questions[currentQuestionIndex].options[index] === questions[currentQuestionIndex].answer;

            setScore(prevScore => Math.max(0, prevScore + (isCorrect ? 100 : -100)));
            setTimeout(() => {
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    setSelectedOptionIndex(null);
                } else {
                    handleFinishQuiz();
                }
            }, 1500);
        }
    };

    const handleFinishQuiz = () => {
        updateCommonScore(score);
        setShowResult(true);
    };

    const handleHintPress = () => {
        if (score >= 50 && !hintApplied && selectedOptionIndex === null) {
            setHintModalVisible(true);
        } else if (selectedOptionIndex !== null) {
            Alert.alert('Hint cannot be used after selecting an option.');
        } else if (hintApplied) {
            Alert.alert('Hint already used for this question.');
        } else {
            Alert.alert('Not enough points for a hint.');
        }
    };

    const handleHintPurchase = (purchase) => {
        if (purchase) {
            setScore(prevScore => Math.max(0, prevScore - 50));
            setHintApplied(true);
        }
        setHintModalVisible(false);
    };

    if (showResult) {
        return (
            <View style={styles.container}>
                <Text style={styles.scoreText}>Final Score: {score}</Text>
                <Text style={styles.scoreText}>Common Score: {commonScore}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('NewGameScreen')}>
                    <Text style={styles.finishText}>Go back</Text>
                </TouchableOpacity>
                <Modal
                    transparent={true}
                    visible={nextLevelModalVisible}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Congratulations, you’ve unlocked the next level!</Text>
                            <Button title="Close" onPress={() => setNextLevelModalVisible(false)} />
                            <Button title="Proceed" onPress={() => navigation.navigate('QuizGeniusScreen')} />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const correctOptionIndex = currentQuestion.options.indexOf(currentQuestion.answer);
    const isCorrect = selectedOptionIndex !== null && currentQuestion.options[selectedOptionIndex] === currentQuestion.answer;

    return (
        <View style={styles.container}>
            <Text style={styles.timerText}>Time Left: {timer}s</Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.optionButton,
                        selectedOptionIndex !== null && (
                            index === selectedOptionIndex
                                ? isCorrect
                                    ? styles.correctOption
                                    : styles.incorrectOption
                                : index === correctOptionIndex && hintApplied
                                    ? styles.correctOption
                                    : null
                        ),
                        selectedOptionIndex === null && hintApplied && index === correctOptionIndex ? styles.hintOption : null
                    ]}
                    onPress={() => handleOptionPress(index)}
                    disabled={selectedOptionIndex !== null || hintApplied}
                >
                    <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity
                style={[styles.hintButton, { opacity: selectedOptionIndex !== null || hintApplied ? 0.5 : 1 }]}
                onPress={handleHintPress}
                disabled={selectedOptionIndex !== null || hintApplied}
            >
                <Text style={styles.hintButtonText}>Hint</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={hintModalVisible}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Buy a hint for 50 points?</Text>
                        <Button title="Yes" onPress={() => handleHintPurchase(true)} />
                        <Button title="No" onPress={() => handleHintPurchase(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    topicText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    questionText: {
        fontSize: 18,
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    optionsContainer: {
        marginBottom: 20,
        width: '100%',
    },
    optionButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
    },
    hintButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#ffc107',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
});

export default QuizGenius;
