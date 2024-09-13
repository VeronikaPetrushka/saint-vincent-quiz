import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Album = () => {
    const [purchasedBrochures, setPurchasedBrochures] = useState([]);
    const [selectedBrochure, setSelectedBrochure] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const navigation = useNavigation();

    const loadPurchasedBrochures = useCallback(async () => {
        try {
            const storedBrochures = await AsyncStorage.getItem('brochures');
            console.log('Stored brochures data:', storedBrochures);

            if (storedBrochures) {
                const brochures = JSON.parse(storedBrochures);

                const purchasedBrochuresList = brochures
                    .flatMap(topic => topic.cards)
                    .filter(card => card.purchased); 

                setPurchasedBrochures(purchasedBrochuresList);
            } else {
                console.log('No purchased brochures found.');
                setPurchasedBrochures([]);
            }
        } catch (error) {
            console.error('Failed to load purchased brochures:', error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadPurchasedBrochures(); 
        }, [loadPurchasedBrochures])
    );

    const handleNavigateToStore = () => {
        navigation.navigate('StoreScreen');
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
                                    { backgroundColor: currentPage === index ? '#618e4d' : '#ccc' }
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
        backgroundColor: '#91b585',
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
        justifyContent: 'center', // Center content vertically
        width: 370,
        height: 550
    },
    brochureImage: {
        width: 330,
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
    },
    storeButton: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#007BFF',
        borderRadius: 8,
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
        marginTop: 10
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
