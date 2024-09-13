import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Album = () => {
    const [purchasedBrochures, setPurchasedBrochures] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFact, setSelectedFact] = useState(null);
    const navigation = useNavigation();

    // Function to load purchased brochures
    const loadPurchasedBrochures = useCallback(async () => {
        try {
            const storedBrochures = await AsyncStorage.getItem('brochureData');
            console.log('Stored brochures data:', storedBrochures);

            if (storedBrochures !== null) {
                const brochures = JSON.parse(storedBrochures);
                console.log('Parsed brochures data:', brochures);
                const filteredBrochures = brochures.filter(brochure => brochure.purchased);
                setPurchasedBrochures(filteredBrochures);
            } else {
                console.log('No purchased brochures found.');
                setPurchasedBrochures([]);
            }
        } catch (error) {
            console.error('Failed to load purchased brochures:', error);
        }
    }, []);

    // Load purchased brochures when the screen is focused
    useFocusEffect(
        useCallback(() => {
            loadPurchasedBrochures();
        }, [loadPurchasedBrochures])
    );

    const handleNavigateToStore = () => {
        navigation.navigate('StoreScreen');
    };

    const handleBrochurePress = (fact) => {
        setSelectedFact(fact);
        setModalVisible(true);
    };

    const renderBrochureItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleBrochurePress(item.fact)}>
            <View style={styles.brochureCard}>
                <Image
                    source={item.image}
                    style={styles.brochureImage}
                />
                <Text style={styles.brochureTitle}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Album</Text>
            {purchasedBrochures.length === 0 ? (
                <View styles={{ width: '100%' }}>
                    <Text style={styles.emptyText}>No purchased brochures yet.</Text>
                    <TouchableOpacity
                        style={styles.storeButton}
                        onPress={handleNavigateToStore}
                    >
                        <Text style={styles.storeButtonText}>Go to Store</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={purchasedBrochures}
                    renderItem={renderBrochureItem}
                    keyExtractor={(item) => item.name}
                    numColumns={2}
                    contentContainerStyle={styles.brochuresContainer}
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            {selectedFact && (
                                <>
                                    <Text style={styles.factTitle}>{selectedFact.factName}</Text>
                                    <Text style={styles.factDescription}>{selectedFact.description}</Text>
                                </>
                            )}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        height: "110%",
        width: '100%',
        backgroundColor: '#91b585'
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
        width: 175,
        height: 230
    },
    brochureImage: {
        width: 130,
        height: 170,
        marginBottom: 8,
        borderRadius: 10
    },
    brochureTitle: {
        fontSize: 18,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    factTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    factDescription: {
        fontSize: 16,
        color: '#555',
    },
    closeButton: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Album;
