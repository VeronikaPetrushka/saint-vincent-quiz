// Set timer for 24h

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dailyQuiz from '../constants/dailyQuiz.js';
import Icons from './Icons';

const DailyQuiz = () => {
    const navigation = useNavigation();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [nextQuizAvailable, setNextQuizAvailable] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const intervalRef = useRef(null);
    const balance = 'balance';

    const QUIZ_INTERVAL = 120000;

    useEffect(() => {
        checkQuizAvailability();
        loadTotalBalance();
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

    const updateTotalBalance = async (newBalance) => {
        try {
            await AsyncStorage.setItem('totalBalance', newBalance.toString());
            setTotalBalance(newBalance);
        } catch (error) {
            console.error('Failed to save total balance:', error);
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
        const newBalance = totalBalance + score;
        await updateTotalBalance(newBalance);
        setQuizFinished(true);
        await AsyncStorage.setItem('lastQuizTime', Date.now().toString());
    };

    if (nextQuizAvailable) {
        return (
            <ImageBackground
            source={require('../assets/background/genius.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.overlay}>        
            <View style={styles.container}>
                <Text style={styles.scoreText}>
                    Next daily quiz will be available in {formatTime(countdown)}.
                </Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
                    <Text style={styles.goBackText}>Go Back</Text>
                </TouchableOpacity>
            </View>
            </View>
        </ImageBackground>

        );
    }

    if (quizFinished) {
        return (
            <ImageBackground
            source={require('../assets/background/genius.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
        
            <View style={styles.container}>
                <Text style={styles.scoreTextFinal}>You have completed all your daily tasks for today. See you tomorrow!</Text>
                <Text style={styles.scoreTextFinal}>Final Score: {score}</Text>
                <Text style={styles.scoreTextFinal}>Total Balance: {totalBalance}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
                    <Text style={styles.goBackText}>Go Back</Text>
                </TouchableOpacity>
            </View>
            </View>
        </ImageBackground>

        );
    }

    const currentQuestion = dailyQuiz[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer;

    return (
        <ImageBackground
        source={require('../assets/background/genius.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
    >
        <View style={styles.overlay}>

        <View style={styles.container}>
            <Text style={styles.questionText}>{currentQuestion.statement}</Text>
            <Text style={styles.scoreText}><Icons type={balance}/>  {score}</Text>
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
            </View>
            </ImageBackground>
    
    );
};




const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    questionText: {
        fontSize: 22,
        marginBottom: 20,
        color: 'white',
        marginBottom: 100,
        marginTop: -200
    },
    scoreText: {
        fontSize: 22,
        marginBottom: 300,
        color: 'white'
    },
    optionButton: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionText: {
        fontSize: 20,
        color: 'white'
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
        fontSize: 16,
        color: 'white'
    },
    scoreTextFinal: {
        marginBottom: 50
    }
});

export default DailyQuiz;
