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

    const QUIZ_INTERVAL = 24 * 60 * 60 * 1000;

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
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
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
                <Text style={styles.final}>
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
                <Text style={styles.final}>You have completed all your daily tasks for today. See you tomorrow!</Text>
                <Text style={styles.final}>Final Score: {score}</Text>
                <View style={styles.balanceContainer}>
                <Icons type={balance}/>
                <Text style={styles.scoreText}>{totalBalance}</Text>
                </View>
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
            <View style={styles.balanceContainer}>
            <Icons type={balance}/>
            <Text style={styles.scoreText}>{score}</Text>
            </View>
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
        marginTop: -200,
        height: 80,
        fontWeight: 600,
        textAlign: 'center'
    },
    scoreText: {
        fontSize: 22,
        color: 'black',
        marginLeft: 10,
        fontWeight: 'bold'
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
        backgroundColor: '#6aa84f',
        borderColor: '#6aa84f'
    },
    incorrectOption: {
        backgroundColor: 'red',
        borderColor: 'red'
    },
    goBackButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#618e4d',
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    goBackText: {
        color: '#FFF',
        fontSize: 18,
        color: 'white'
    },
    scoreTextFinal: {
        marginBottom: 50,
        fontSize: 22,
        color: 'black',
        marginLeft: 10,
        fontWeight: 'bold'
    },
    final: {
        fontSize: 22,
        marginBottom: 20,
        color: 'white',
        marginBottom: 100,
        marginTop: -100,
        height: 80,
        fontWeight: 600,
        textAlign: 'center'
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100,
        borderRadius: 10,
        backgroundColor: 'white',
        width: 120,
        height: 40
    },
    purchasedText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    goBackText: {
        color: '#FFF',
        fontSize: 18,
        color: 'white'
    },
    priceButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
});

export default DailyQuiz;
