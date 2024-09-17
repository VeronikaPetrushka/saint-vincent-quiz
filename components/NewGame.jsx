import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ImageBackground } from "react-native";
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

    const allTopicsEnabled = enabledTopics.length === 9 && enabledTopics.every(enabled => enabled);

    return (
        <ImageBackground
        source={require('../assets/background/genius.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
    >
        <View style={styles.overlay}>
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
                <TouchableOpacity 
                    style={[styles.modeBtn, { opacity: allTopicsEnabled ? 1 : 0.5 }]} 
                    onPress={handleExpertPress}
                    disabled={!allTopicsEnabled}
                    >
                    <Text style={styles.modeBtnText}>Expert</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
            </View>
            </ImageBackground>
    );
};



const styles = {

    container: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 25,
        paddingVertical: 30,
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

    topicBtnContainer: {
        width: "100%",
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 100,
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
        margin: 10,
        backgroundColor: 'white',
    },

    buttonText: {
        fontSize: 22
    },

    icon: {
        width: 30,
        height: 30
    },

    modeBtnContainer: {
        width: '100%',
    },

    modeBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: 'white',
    },

    modeBtnText: {
        fontSize: 18
    }
}

export default NewGame;