import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import quiz from '../constants/quiz.js';
import shuffleArray from '../utils/shuffle.js';

const QuizGenius = () => {
    const navigation = useNavigation();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
    const [score, setScore] = useState(0);
    const [hintModalVisible, setHintModalVisible] = useState(false);
    const [hintApplied, setHintApplied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120);
    const [correctAnswersInRow, setCorrectAnswersInRow] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [totalBalance, setTotalBalance] = useState(0);
    const [shuffledQuestions, setShuffledQuestions] = useState(shuffleArray(quiz.flatMap(topic => {
        return topic.questions.map(question => ({ ...question, topic: topic.topic }));
    })));

    useEffect(() => {
        if (quizFinished) return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(timer);
                    finishQuiz();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizFinished]);

    useEffect(() => {
        const loadTotalBalance = async () => {
            try {
                const storedTotalBalance = await AsyncStorage.getItem('totalBalance');
                if (storedTotalBalance !== null) {
                    setTotalBalance(parseInt(storedTotalBalance, 10));
                }
            } catch (error) {
                console.error('Failed to load total balance:', error);
            }
        };

        loadTotalBalance();
    }, []);

    const updateTotalBalance = async (newBalance) => {
        try {
            await AsyncStorage.setItem('totalBalance', newBalance.toString());
            setTotalBalance(newBalance);
        } catch (error) {
            console.error('Failed to save total balance:', error);
        }
    };

    const handleOptionPress = (index) => {
        if (selectedOptionIndex === null && !hintApplied) {
            setSelectedOptionIndex(index);
            const isCorrect = index === currentQuestion?.options.indexOf(currentQuestion?.answer);
            setScore(prevScore => {
                const newScore = Math.max(0, prevScore + (isCorrect ? 100 : -100));
                console.log('Score updated to:', newScore);
                return newScore;
            });
    
            if (isCorrect) {
                setCorrectAnswersInRow(prev => {
                    const newCount = prev + 1;
                    if (newCount % 2 === 0) {
                        setTimeLeft(prevTime => Math.min(prevTime + 20, 120));
                    }
                    return newCount;
                });
            } else {
                setCorrectAnswersInRow(0);
            }
            
            setHintApplied(true);
        }
    };
    

    const handleNextQuestion = () => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOptionIndex(null);
            setHintApplied(false);
        } else {
            finishQuiz();
        }
    };

    const handleHintPress = () => {
        if (score >= 50 && !hintApplied) {
            setHintModalVisible(true);
        } else if (hintApplied) {
            Alert.alert('Hint already used for this question.');
        } else {
            Alert.alert('Not enough points for a hint.');
        }
    };

    const handleHintAction = (action) => {
        if (action === 'reveal') {
            setScore(prevScore => Math.max(0, prevScore - 50));
            setHintApplied(true);
            setSelectedOptionIndex(currentQuestion?.options.indexOf(currentQuestion?.answer));
        } else if (action === 'skip') {
            setScore(prevScore => Math.max(0, prevScore - 50));
            setHintApplied(true);
            handleNextQuestion();
        }
        setHintModalVisible(false);
    };

    const finishQuiz = async () => {
        setScore(prevScore => {
            const newBalance = totalBalance + prevScore;
    
            console.log('Final Score:', prevScore);
            console.log('Current Total Balance:', totalBalance);
            console.log('New Balance:', newBalance);
    
            updateTotalBalance(newBalance)
                .then(() => console.log('Balance updated successfully.'))
                .catch(error => console.error('Error updating total balance:', error));
    
            return prevScore;
        });
    
        setQuizFinished(true);
    };
    

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedOptionIndex(null);
        setScore(0);
        setHintApplied(false);
        setTimeLeft(120);
        setCorrectAnswersInRow(0);
        setQuizFinished(false);
        setShuffledQuestions(shuffleArray(quiz.flatMap(topic => {
            return topic.questions.map(question => ({ ...question, topic: topic.topic }));
        })));
    };

    const getOptionStyle = (index) => {
        let backgroundColor = 'transparent';
        if (selectedOptionIndex === index) {
            backgroundColor = index === currentQuestion?.options.indexOf(currentQuestion?.answer) ? '#6aa84f' : 'red';
        } else if (index === currentQuestion?.options.indexOf(currentQuestion?.answer) && selectedOptionIndex !== null) {
            backgroundColor = '#6aa84f';
        }
        return [styles.optionButton, { backgroundColor }];
    };

    if (quizFinished) {
        return (
            <View style={styles.container}>
                <Text style={styles.topicText}>Quiz Finished</Text>
                <Text style={styles.topicText}>You were magnificent, but unfortunately, time has run out!</Text>
                <Text style={styles.scoreText}>Final Score: {score}</Text>
                <Text style={styles.scoreText}>Total Balance: {totalBalance}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('NewGameScreen')} style={styles.restartButton}>
                    <Text>Go Back to New Game</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={restartQuiz} style={styles.restartButton}>
                    <Text>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    
    return (
        <ImageBackground
            source={require('../assets/background/genius.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.topicText}>{currentQuestion.topic}</Text>
                    <Text style={styles.questionText}>{currentQuestion.question}</Text>
                    <Text style={styles.scoreText}>Score: {score}</Text>
                    <Text style={styles.timerText}>Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Text>
                    <View style={styles.optionsContainer}>
                        {currentQuestion.options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={getOptionStyle(index)}
                                onPress={() => handleOptionPress(index)}
                                disabled={selectedOptionIndex !== null || hintApplied}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity
                        onPress={handleHintPress}
                        style={[styles.hintButton, { opacity: score >= 50 && !hintApplied && selectedOptionIndex === null ? 1 : 0.5 }]}
                        disabled={score < 50 || hintApplied || selectedOptionIndex !== null}
                    >
                        <Text style={styles.btnText}>Hint</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleNextQuestion}
                        style={[styles.nextButton, { opacity: selectedOptionIndex !== null ? 1 : 0.5 }]}
                        disabled={selectedOptionIndex === null}
                    >
                        <Text style={styles.btnText}>Next</Text>
                    </TouchableOpacity>
                    <Modal
                        transparent={true}
                        visible={hintModalVisible}
                        animationType="slide"
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalText}>Choose an action:</Text>
                                <Button title="Reveal Answer (50 points)" onPress={() => handleHintAction('reveal')} />
                                <Button title="Skip Question (50 points)" onPress={() => handleHintAction('skip')} />
                                <Button title="Cancel" onPress={() => setHintModalVisible(false)} />
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </ImageBackground>
    );
};




const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    backgroundImage: {
        width: '100%',
        height: '110%',
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    topicText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "white"
    },
    questionText: {
        fontSize: 18,
        marginBottom: 20,
        color: "white"
    },
    scoreText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "white"
    },
    timerText: {
        color: "white",
        fontSize: 18,
        marginBottom: 200
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
    optionText:{
        color: "white",
        fontSize: 18,
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
    btnText: {
        color: "white"
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
