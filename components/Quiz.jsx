// Background theme image
// On finish -> topic cards to buy for album
// highlight correct in green, even when wrong selected
// Total balance

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuiz } from '../context/context.js';

const Quiz = ({ topic, topicIndex }) => {
    const navigation = useNavigation();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [nextEnabled, setNextEnabled] = useState(false);
    const [score, setScore] = useState(0);
    const [hintModalVisible, setHintModalVisible] = useState(false);
    const [hintApplied, setHintApplied] = useState(false);
    const [nextLevelModalVisible, setNextLevelModalVisible] = useState(false);

    const { unlockNextTopic, enabledTopics, updateTotalScore } = useQuiz();

    const handleOptionPress = (index) => {
        if (selectedOptionIndex === null && !hintApplied) {
            setSelectedOptionIndex(index);
            const isCorrect = topic.questions[currentQuestionIndex].options[index] === topic.questions[currentQuestionIndex].answer;

            setScore(prevScore => Math.max(0, prevScore + (isCorrect ? 100 : -100)));
            setNextEnabled(true);

            setTimeout(() => {
                if (currentQuestionIndex < topic.questions.length - 1) {
                    setNextEnabled(true);
                } else {
                    setShowResult(true);
                    unlockNextTopic(topicIndex);
                }
            }, 1500);
        }
    };

    const handleNextPress = () => {
        if (currentQuestionIndex < topic.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOptionIndex(null);
            setNextEnabled(false);
            setHintApplied(false);
        } else {
            setShowResult(true);
            unlockNextTopic(topicIndex);
        }
    };

    const handleHintPress = () => {
        if (score >= 50 && !hintApplied && selectedOptionIndex === null) {
            setHintModalVisible(true);
        } else if (selectedOptionIndex !== null) {
            alert('Cannot use hint after selecting an option.');
        } else if (hintApplied) {
            alert('Hint already used for this question.');
        } else {
            alert('Not enough points for a hint.');
        }
    };

    const handleHintPurchase = (purchase) => {
        if (purchase) {
            setScore(prevScore => Math.max(0, prevScore - 50));
            setHintApplied(true);
            setNextEnabled(true);
        }
        setHintModalVisible(false);
    };

    const handleProceedToNextTopic = () => {
        const nextTopicIndex = topicIndex + 1;

        if (enabledTopics[nextTopicIndex]) {
            setCurrentQuestionIndex(0);
            setSelectedOptionIndex(null);
            setShowResult(false);
            setNextEnabled(false);
            setHintApplied(false);
            setScore(0);
            setNextLevelModalVisible(false);

            navigation.navigate('QuizScreen', { topicIndex: nextTopicIndex });
        } else {
            alert('Next topic is not unlocked yet.');
        }
    };

    const nextTopicExists = topicIndex + 1 < enabledTopics.length;

    if (showResult) {
        // Only update the total score with the final score of the current quiz
        updateTotalScore(score);

        return (
            <View style={styles.container}>
                <Text style={styles.topicName}>Quiz Finished</Text>
                <Text style={styles.topicName}>{topic.topic}</Text>
                <Text style={styles.scoreText}>Final Score: {score}</Text>
                {/* Make sure you have a way to show the total score if needed */}
                <TouchableOpacity onPress={() => navigation.navigate('NewGameScreen')}>
                    <Text style={styles.finishText}>Go back</Text>
                </TouchableOpacity>

                {nextTopicExists && (
                    <TouchableOpacity onPress={() => setNextLevelModalVisible(true)}>
                        <Text style={styles.nextTopicBtnText}>Next</Text>
                    </TouchableOpacity>
                )}

                <Modal
                    transparent={true}
                    visible={nextLevelModalVisible}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Congratulations, you’ve unlocked the next level!</Text>
                            <Button title="Close" onPress={() => setNextLevelModalVisible(false)} />
                            <Button title="Proceed" onPress={handleProceedToNextTopic} />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    const currentQuestion = topic.questions[currentQuestionIndex];
    const correctOptionIndex = currentQuestion.options.indexOf(currentQuestion.answer);
    const isCorrect = selectedOptionIndex !== null && currentQuestion.options[selectedOptionIndex] === currentQuestion.answer;

    return (
        <View style={styles.container}>
            <Text style={styles.topicName}>{topic.topic}</Text>
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Score: {score}</Text>
                <TouchableOpacity
                    style={[styles.hintButton, { opacity: selectedOptionIndex !== null || hintApplied ? 0.5 : 1 }]}
                    onPress={handleHintPress}
                    disabled={selectedOptionIndex !== null || hintApplied}
                >
                    <Text style={styles.hintButtonText}>Hint</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.questionContainer}>
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
            </View>
            <TouchableOpacity
                style={[styles.nextButton, { opacity: nextEnabled ? 1 : 0.5 }]}
                onPress={handleNextPress}
                disabled={!nextEnabled}
            >
                <Text style={styles.nextButtonText}>Next</Text>
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
        paddingHorizontal: 30,
        paddingVertical: 20,
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    topicName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        marginTop: 30,
    },
    scoreText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    questionContainer: {
        marginBottom: 20,
        width: '100%',
    },
    questionText: {
        fontSize: 20,
        marginBottom: 200,
        textAlign: 'center',
        height: 50
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
    optionText: {
        fontSize: 18,
    },
    correctOption: {
        backgroundColor: 'lightgreen',
    },
    incorrectOption: {
        backgroundColor: 'red',
    },
    hintOption: {
        backgroundColor: 'lightgreen',
    },
    nextButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        backgroundColor: '#007bff',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
    },
    nextButtonText: {
        fontSize: 18,
        color: '#fff',
    },
    scoreContainer:{
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        marginBottom: 50
    },
    hintButton: {
        padding: 7,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        backgroundColor: '#ffc107',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
    },
    hintButtonText: {
        fontSize: 18,
        color: '#fff',
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
    finishText: {
        fontSize: 20,
        color: 'blue',
        textAlign: 'center',
        marginTop: 20,
    },
    nextTopicBtnText: {
        fontSize: 20,
        color: 'blue',
        textAlign: 'center',
        marginTop: 20,
    }
});

export default Quiz;