// Expert button 

import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useQuiz } from '../context/context.js';
import quiz from '../constants/quiz.js';

const NewGame = () => {
    const navigation = useNavigation();
    const { enabledTopics } = useQuiz();

    const handleButtonPress = (index) => {
        if (enabledTopics[index]) {
            navigation.navigate('QuizScreen', { topicIndex: index });
        }
    };

    const handleGeniusPress = () => {
        navigation.navigate('QuizGeniusScreen');
    };

    const handleExpertPress = () => {
        navigation.navigate('QuizExpertScreen');
    };

    const allTopicsEnabled = enabledTopics.length === 6 && enabledTopics.every(enabled => enabled);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topicBtnContainer}>
                {quiz.map((item, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.buttonWrapper} 
                        onPress={() => handleButtonPress(index)} 
                        disabled={!enabledTopics[index]}
                    >
                        {enabledTopics[index] ? (
                            <Text style={styles.buttonText}>{index + 1}</Text>
                        ) : (
                            <Image source={require('../assets/quiz/padlock.png')} style={styles.icon} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.modeBtnContainer}>
                <TouchableOpacity 
                    style={[styles.modeBtn, { opacity: allTopicsEnabled ? 1 : 0.5 }]} 
                    onPress={handleGeniusPress}
                    disabled={!allTopicsEnabled}
                >
                    <Text style={styles.modeBtnText}>Genius</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modeBtn} onPress={handleExpertPress}>
                    <Text style={styles.modeBtnText}>Expert</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};



const styles = {

    container: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 25,
        paddingVertical: 30
    },

    topicBtnContainer: {
        width: "100%",
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 100
    },
    buttonWrapper: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },

    buttonText: {
        fontSize: 22
    },

    icon: {
        width: 30,
        height: 30
    },

    modeBtnContainer: {
        width: '100%'
    },

    modeBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
    },

    modeBtnText: {
        fontSize: 18
    }
}

export default NewGame;