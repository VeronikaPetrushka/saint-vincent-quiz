import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from "./Icons";

const MenuPanel = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [isQuizVisited, setIsQuizVisited] = useState(false);

    const home = 'home';
    const settings = 'settings';
    const shop = 'shop';
    const gallery = 'gallery';
    const results = 'results';

    useFocusEffect(
        React.useCallback(() => {
            const checkQuizVisited = async () => {
                try {
                    const visited = await AsyncStorage.getItem('quizVisited');
                    setIsQuizVisited(!!visited); 
                } catch (error) {
                    console.error('Failed to retrieve quizVisited:', error);
                }
            };

            checkQuizVisited();
        }, [])
    );

    const handleNavigateToHome = () => {
        navigation.navigate('MainMenuScreen');
    };

    const handleNavigateToGallery = () => {
        navigation.navigate('AlbumScreen');
    };

    const handleNavigateToStore = () => {
        if (isQuizVisited) {
            navigation.navigate('StoreScreen');
        } else {
            Alert.alert(
                "Store Unavailable",
                "You need to complete at least one quiz before shopping!",
                [
                    {
                        text: "Close",
                        onPress: () => console.log("Alert closed"),
                        style: "cancel"
                    },
                    {
                        text: "Go to Quiz",
                        onPress: () => navigation.navigate('NewGameScreen')
                    }
                ]
            );
        }
    };

    const handleNavigateToResults = () => {
        navigation.navigate('ResultsScreen');
    };

    const handleNavigateToSettings = () => {
        navigation.navigate('SettingsScreen');
    };

    const isCurrent = (screen) => route.name === screen;

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={handleNavigateToStore} 
                style={[styles.button, isCurrent('StoreScreen') && styles.activeButton]}
            >
                <Icons type={shop} />
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={handleNavigateToGallery} 
                style={[styles.button, isCurrent('AlbumScreen') && styles.activeButton]}
            >
                <Icons type={gallery} />
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={handleNavigateToHome} 
                style={[styles.button, isCurrent('MainMenuScreen') && styles.activeButton]}
            >
                <Icons type={home} />
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={handleNavigateToResults} 
                style={[styles.button, isCurrent('ResultsScreen') && styles.activeButton]}
            >
                <Icons type={results} />
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={handleNavigateToSettings} 
                style={[styles.button, isCurrent('SettingsScreen') && styles.activeButton]}
            >
                <Icons type={settings} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "90%",
        height: 75,
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignSelf: "center",
        borderRadius: 50,
    },
    button: {
        padding: 15,
        borderRadius: 30,
    },
    activeButton: {
        backgroundColor: '#c7d3b8',
    },
    disabledButton: {
        backgroundColor: '#d3d3d3',
    },
});

export default MenuPanel;
