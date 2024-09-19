import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icons from './Icons';
import CreateBrochure from './CreateBrochure';

const Album = () => {
    const [purchasedBrochures, setPurchasedBrochures] = useState([]);
    const [selectedBrochure, setSelectedBrochure] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isQuizVisited, setIsQuizVisited] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userBrochures, setUserBrochures] = useState([]);
    const navigation = useNavigation();

    const plus = 'plus';
    const trash = 'delete';

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

    const loadUserBrochures = useCallback(async () => {
        try {
            const storedUserBrochures = await AsyncStorage.getItem('UserBrochures');
            if (storedUserBrochures) {
                setUserBrochures(JSON.parse(storedUserBrochures));
            } else {
                setUserBrochures([]);
            }
        } catch (error) {
            console.error('Failed to load user brochures:', error);
        }
    }, []);

    const handleBrochureSubmit = async (newBrochure) => {
        const updatedBrochures = [...userBrochures, newBrochure];
        setUserBrochures(updatedBrochures);
        await AsyncStorage.setItem('UserBrochures', JSON.stringify(updatedBrochures));
    };

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
            loadUserBrochures();
        }, [loadPurchasedBrochures, checkQuizVisited, loadUserBrochures])
    );

    const combinedBrochures = [...purchasedBrochures, ...userBrochures];

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

    const deleteUserBrochure = async (item) => {
        const updatedBrochures = userBrochures.filter(brochure => brochure.name !== item.name);
        setUserBrochures(updatedBrochures);
        await AsyncStorage.setItem('UserBrochures', JSON.stringify(updatedBrochures));
        Alert.alert("Deleted", "Brochure has been removed from your album.");
    };

    const renderBrochureItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleBrochurePress(item)}>
            <View style={styles.brochureCard}>
                {selectedBrochure && selectedBrochure.name === item.name ? (
                    <ScrollView contentContainerStyle={styles.factContainer}>
                        <Text style={styles.factTitle}>{item.fact ? item.fact.factName : item.name}</Text>
                        <Text style={styles.factDescription}>
                            {item.fact ? item.fact.description : (item.date ? `Date: ${item.date}` : '')}
                        </Text>
                        {item.description ? <Text style={styles.factDescription}>Description: {item.description}</Text> : null}
                    </ScrollView>
                ) : (
                    <>
                        <Image
                            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                            style={styles.brochureImage}
                        />
                        <Text style={styles.brochureTitle}>{item.name}</Text>
                    </>
                )}

                {userBrochures.includes(item) && (
                    <TouchableOpacity onPress={() => deleteUserBrochure(item)} style={styles.deleteButton}>
                        <Icons type={trash}/>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newPage = Math.floor(contentOffsetX / styles.brochureCard.width);
        setCurrentPage(newPage);
    };

    const handleAddBrochure = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Album</Text>

            {combinedBrochures.length === 0 ? (
                <View style={{ width: '100%' }}>
                    <Text style={styles.emptyText}>No brochures added yet.</Text>
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
                        data={combinedBrochures}
                        renderItem={renderBrochureItem}
                        keyExtractor={(item) => item.name}
                        horizontal
                        pagingEnabled
                        onScroll={handleScroll}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.brochuresContainer}
                    />

                    <View style={styles.dotsContainer}>
                        {combinedBrochures.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    { backgroundColor: currentPage === index ? '#618e4d' : '#fff' }
                                ]}
                            />
                        ))}
                    </View>

                    <TouchableOpacity style={styles.addBtn} onPress={handleAddBrochure}>
                        <Icons type={plus} />
                    </TouchableOpacity>
                </View>
            )}

            <CreateBrochure 
                visible={isModalVisible} 
                onClose={closeModal}
                onSubmit={handleBrochureSubmit} 
                />
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
    },
    addBtn: {
        alignSelf: 'center',
        marginTop: 10
    },
    deleteButton: {
        position: 'absolute',
        bottom: 10,
        right: 30,
        padding: 10
    }
});

export default Album;
