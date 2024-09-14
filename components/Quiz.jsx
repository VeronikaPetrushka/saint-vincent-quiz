// highlight correct in green, even when wrong selected
// Total balance - inconsistent update +- 100

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button, ImageBackground, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useQuiz } from '../context/context.js';
import Icons from './Icons.jsx';
import brochures from '../constants/brochures.js';

const Quiz = ({ topic, topicIndex }) => {
    const navigation = useNavigation();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [nextEnabled, setNextEnabled] = useState(false);
    const [score, setScore] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const [hintModalVisible, setHintModalVisible] = useState(false);
    const [hintApplied, setHintApplied] = useState(false);
    const [nextLevelModalVisible, setNextLevelModalVisible] = useState(false);
    const [purchasedBrochures, setPurchasedBrochures] = useState([]);
    const [brochuresForTopic, setBrochuresForTopic] = useState([]);
    const balance = 'balance';

    const { unlockNextTopic, enabledTopics } = useQuiz();

    useEffect(() => {
        const initializeData = async () => {
            try {
                const storedTotalBalance = await AsyncStorage.getItem('totalBalance');
                if (storedTotalBalance !== null) {
                    setTotalBalance(parseInt(storedTotalBalance, 10));
                }
                
                const storedBrochures = await AsyncStorage.getItem('brochures');
                if (storedBrochures) {
                    setPurchasedBrochures(JSON.parse(storedBrochures));
                } else {
                    await AsyncStorage.setItem('brochures', JSON.stringify(brochures));
                    setPurchasedBrochures(brochures);
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };

        initializeData();
    }, []);

    useEffect(() => {
        const getBrochuresForCurrentTopic = () => {
            const topicBrochures = purchasedBrochures.find(b => b.topic === topic.topic);
            if (topicBrochures) {
                setBrochuresForTopic(topicBrochures.cards);
            }
        };

        getBrochuresForCurrentTopic();
    }, [purchasedBrochures, topic]);

    const updateTotalBalance = async (newBalance) => {
        try {
            await AsyncStorage.setItem('totalBalance', newBalance.toString());
            setTotalBalance(newBalance);
        } catch (error) {
            console.error('Failed to save total balance:', error);
        }
    };

    const purchaseBrochure = async (brochure) => {
        console.log('Attempting to purchase brochure:', brochure.name);

        if (totalBalance >= brochure.price) {
            const updatedBrochures = purchasedBrochures.map(b => {
                if (b.topic === topic.topic) {
                    return {
                        ...b,
                        cards: b.cards.map(card => {
                            if (card.name === brochure.name) {
                                console.log('Updating purchased status for brochure:', brochure.name);
                                return { ...card, purchased: true };
                            }
                            return card;
                        })
                    };
                }
                return b;
            });

            const newBalance = totalBalance - brochure.price;

            setPurchasedBrochures(updatedBrochures);
            const updatedBrochuresForTopic = brochuresForTopic.map(card => {
                if (card.name === brochure.name) {
                    return { ...card, purchased: true };
                }
                return card;
            });
            setBrochuresForTopic(updatedBrochuresForTopic);

            console.log('Updated brochures:', updatedBrochures);
            console.log('Updated balance:', newBalance);
            await updateTotalBalance(newBalance);

            try {
                await AsyncStorage.setItem('brochures', JSON.stringify(updatedBrochures));
                console.log('Brochures saved to AsyncStorage.');
            } catch (error) {
                console.error('Failed to save brochures to AsyncStorage:', error);
            }
        } else {
            Alert.alert('Insufficient balance', 'You do not have enough balance to buy this brochure.');
        }
    };

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
                    finishQuiz();
                }
            }, 1500);
        }
    };

    const finishQuiz = async () => {
        setShowResult(true);

        const updatedBalance = totalBalance + score;
        await updateTotalBalance(updatedBalance);
        unlockNextTopic(topicIndex);
    };

    const handleNextPress = () => {
        if (currentQuestionIndex < topic.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOptionIndex(null);
            setNextEnabled(false);
            setHintApplied(false);
        } else {
            finishQuiz();
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
        return (
            <ImageBackground
                source={topic.image}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
              <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.topicName}>Quiz Finished</Text>
                    <Text style={styles.topicName}>{topic.topic}</Text>
                    <Text style={styles.scoreFinalText}>Final Score: {score}</Text>
                    <Text style={styles.scoreFinalText}> <Icons type={balance}/> {totalBalance}</Text>

                    <TouchableOpacity style={styles.finishBtn} onPress={() => navigation.navigate('NewGameScreen')}>
                        <Text style={styles.finishText}>Go back</Text>
                    </TouchableOpacity>

                    {nextTopicExists && (
                        <TouchableOpacity style={styles.finishBtn} onPress={() => setNextLevelModalVisible(true)}>
                            <Text style={styles.finishText}>Next</Text>
                        </TouchableOpacity>
                    )}

<FlatList
    data={brochuresForTopic}
    keyExtractor={item => item.name}
    numColumns={2}
    style={styles.brochureList}
    renderItem={({ item }) => {
        console.log('Rendering brochure:', item.name, 'Purchased status:', item.purchased);
        return (
            <View style={styles.brochureCard}>
                <ImageBackground source={item.image} style={styles.brochureImage}>
                </ImageBackground>

                <Text style={styles.brochureTitle}>{item.name}</Text>

                <TouchableOpacity
                    style={[
                        styles.buyButton,
                        { 
                            backgroundColor: item.purchased || totalBalance < item.price ? 'gray' : 'green' 
                        }
                    ]}
                    onPress={() => purchaseBrochure(item)}
                    disabled={item.purchased || totalBalance < item.price}
                >
                    <Text style={styles.buyButtonText}>
                        {item.purchased ? 'Purchased' : `${item.price}`}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }}
/>

                    <Modal
                        transparent={true}
                        visible={nextLevelModalVisible}
                        animationType="slide"
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalText}>Congratulations, you’ve unlocked the next level!</Text>
                                <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
                                <Button title="Close" onPress={() => setNextLevelModalVisible(false)} />
                                <Button title="Proceed" onPress={handleProceedToNextTopic} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </ImageBackground>
    );
}

const currentQuestion = topic.questions[currentQuestionIndex];
const correctOptionIndex = currentQuestion.options.indexOf(currentQuestion.answer);
const isCorrect = selectedOptionIndex !== null && currentQuestion.options[selectedOptionIndex] === currentQuestion.answer;

return (
    <ImageBackground
        source={topic.image}
        style={styles.backgroundImage}
        resizeMode="cover"
    >
        <View style={styles.overlay}>
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
                            <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
                            <Button title="Yes" onPress={() => handleHintPurchase(true)} />
                            <Button title="No" onPress={() => handleHintPurchase(false)} />
                            </View>
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
        paddingHorizontal: 30,
        paddingVertical: 20,
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
    topicName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        marginTop: 30,
        color: 'white'
    },
    scoreText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    scoreFinalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20
    },
    questionContainer: {
        marginBottom: 20,
        width: '100%',
    },
    questionText: {
        fontSize: 20,
        marginBottom: 200,
        textAlign: 'center',
        height: 50,
        color: 'white'
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
        color: 'white'
    },
    correctOption: {
        backgroundColor: '#6aa84f',
    },
    incorrectOption: {
        backgroundColor: 'red',
    },
    hintOption: {
        backgroundColor: '#6aa84f',
    },
    nextButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        backgroundColor: '#618e4d',
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
    },
    brochureList: {
        width: '100%',
        marginVertical: 20,
        marginBottom: 130
    },
    brochureCard: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 170,
        height: 320,
        margin: 5
    },
    brochureImage: {
        width: 140,
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden'
    },
    brochureTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5
    },
    brochurePrice: {
        fontSize: 16,
        color: '#333',
    },
    buyButton: {
        padding: 5,
        borderRadius: 10,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    buyButtonText: {
        color: "white"
    },
    finishBtn: {
        width: '100%',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#618e4d',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 5,
        padding: 10
    },
    finishText: {
        color: 'white',
        fontSize: 18
    }
});

export default Quiz;