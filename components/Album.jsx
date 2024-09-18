import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icons from './Icons';

const Album = () => {
    const [purchasedBrochures, setPurchasedBrochures] = useState([]);
    const [selectedBrochure, setSelectedBrochure] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isQuizVisited, setIsQuizVisited] = useState(false);
    const navigation = useNavigation();

    const plus = 'plus'

    const loadPurchasedBrochures = useCallback(async () => {
        try {
            const storedBrochures = await AsyncStorage.getItem('brochures');
            const storedPurchasedState = await AsyncStorage.getItem('purchasedState');

            if (storedBrochures) {
                const brochures = JSON.parse(storedBrochures);
                const purchasedState = storedPurchasedState ? JSON.parse(storedPurchasedState) : {};

                const purchasedBrochuresList = brochures
                    .flatMap(topic => topic.cards)
                    .filter(card => card.purchased || purchasedState[card.name]);

                setPurchasedBrochures(purchasedBrochuresList);
            } else {
                setPurchasedBrochures([]);
            }
        } catch (error) {
            console.error('Failed to load purchased brochures:', error);
        }
    }, []);

    const checkQuizVisited = useCallback(async () => {
        try {
            const visited = await AsyncStorage.getItem('quizVisited');
            if (visited === 'true') {
                setIsQuizVisited(true);
            }
        } catch (error) {
            console.error("Failed to check if quiz was visited:", error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadPurchasedBrochures(); 
            checkQuizVisited();
        }, [loadPurchasedBrochures, checkQuizVisited])
    );

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

    const handleBrochurePress = (item) => {
        if (selectedBrochure && selectedBrochure.name === item.name) {
            setSelectedBrochure(null);
        } else {
            setSelectedBrochure(item);
        }
    };

    const renderBrochureItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleBrochurePress(item)}>
            <View style={styles.brochureCard}>
                {selectedBrochure && selectedBrochure.name === item.name ? (
                    <ScrollView contentContainerStyle={styles.factContainer}>
                        <Text style={styles.factTitle}>{selectedBrochure.fact.factName}</Text>
                        <Text style={styles.factDescription}>{selectedBrochure.fact.description}</Text>
                    </ScrollView>
                ) : (
                    <>
                        <Image
                            source={item.image}
                            style={styles.brochureImage}
                        />
                        <Text style={styles.brochureTitle}>{item.name}</Text>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newPage = Math.floor(contentOffsetX / styles.brochureCard.width);
        setCurrentPage(newPage);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Album</Text>
            {purchasedBrochures.length === 0 ? (
                <View style={{ width: '100%' }}>
                    <Text style={styles.emptyText}>No purchased brochures yet.</Text>
                    <TouchableOpacity
                        style={styles.storeButton}
                        onPress={handleNavigateToStore}
                    >
                        <Text style={styles.storeButtonText}>Go to Store</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <FlatList
                        data={purchasedBrochures}
                        renderItem={renderBrochureItem}
                        keyExtractor={(item) => item.name}
                        horizontal
                        pagingEnabled
                        onScroll={handleScroll}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.brochuresContainer}
                    />
                    <View style={styles.dotsContainer}>
                        {purchasedBrochures.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    { backgroundColor: currentPage === index ? '#618e4d' : '#fff' }
                                ]}
                            />
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        height: "110%",
        width: '100%',
        backgroundColor: '#c7d3b8',
        paddingBottom: 170
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
        color: 'white'
    },
    brochureCard: {
        margin: 8,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: 300,
        width: 370,
        height: 550
    },
    brochureImage: {
        width: "100%",
        height: 430,
        marginBottom: 8,
        borderRadius: 10
    },
    brochureTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
        color: '#333333'
    },
    storeButton: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#618e4d',
        borderRadius: 15,
        alignItems: 'center',
    },
    storeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    brochuresContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        width: '100%'
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 3
    },
    factContainer: {
        padding: 10,
        alignItems: 'center'
    },
    factTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10
    },
    factDescription: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center'
    }
});

export default Album;
