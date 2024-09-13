import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from './Icons';

const Store = () => {
    const [totalBalance, setTotalBalance] = useState(0);
    const [brochuresData, setBrochuresData] = useState([]);
    const balanceIcon = 'balance';

    useEffect(() => {
        const loadData = async () => {
            try {
                const balance = await AsyncStorage.getItem('totalBalance');
                const storedBrochures = await AsyncStorage.getItem('brochures');
                
                if (balance !== null) {
                    setTotalBalance(parseInt(balance, 10));
                }
                
                if (storedBrochures) {
                    setBrochuresData(JSON.parse(storedBrochures));
                } else {
                    const brochures = require('../constants/brochures.js');
                    setBrochuresData(brochures);
                    await AsyncStorage.setItem('brochures', JSON.stringify(brochures));
                }
            } catch (error) {
                console.error('Failed to load data from AsyncStorage:', error);
            }
        };

        loadData();
    }, []);

    const handlePurchase = async (brochure) => {
        const price = brochure.price;
        if (totalBalance >= price) {
            const newBalance = totalBalance - price;
            setTotalBalance(newBalance);

            const updatedBrochuresData = brochuresData.map(topic => {
                if (topic.topic === brochure.topic) {
                    return {
                        ...topic,
                        cards: topic.cards.map(card =>
                            card.name === brochure.name
                                ? { ...card, purchased: true }
                                : card
                        )
                    };
                }
                return topic;
            });

            try {
                await AsyncStorage.setItem('totalBalance', newBalance.toString());
                await AsyncStorage.setItem('brochures', JSON.stringify(updatedBrochuresData));
            } catch (error) {
                console.error('Failed to save data to AsyncStorage:', error);
            }

            setBrochuresData(updatedBrochuresData);
        }
    };

    const isBrochurePurchased = (brochureName, topic) => {
        const topicData = brochuresData.find(b => b.topic === topic);
        return topicData?.cards.some(card => card.name === brochureName && card.purchased);
    };

    const renderBrochureItem = ({ item, topic }) => {
        const purchased = isBrochurePurchased(item.name, topic);
        return (
            <View style={styles.brochureCard}>
                <Image source={item.image} style={styles.brochureImage} />
                <Text style={styles.brochureTitle}>{item.name}</Text>
                <TouchableOpacity
                    style={[
                        styles.purchaseButton,
                        (totalBalance < item.price || purchased) && styles.disabledButton
                    ]}
                    onPress={() => handlePurchase(item)}
                    disabled={totalBalance < item.price || purchased}
                >
                    <Text style={styles.purchaseButtonText}>
                        {purchased ? 'Purchased' : `$ ${item.price}`}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <ScrollView style={styles.container}>
                <View style={styles.balanceContainer}>
                    <Icons type={balanceIcon} />
                    <Text style={styles.balanceText}>{totalBalance}</Text>
                </View>

                {brochuresData.map((topic, index) => (
                    <View key={index} style={{ marginBottom: 50 }}>
                        <Text style={styles.topicTitle}>{topic.topic}</Text>
                        <FlatList
                            data={topic.cards}
                            renderItem={({ item }) => renderBrochureItem({ item, topic: topic.topic })}
                            keyExtractor={item => item.name}
                            numColumns={2}
                            scrollEnabled={false}
                            style={styles.list}
                        />
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    wrapper: {
        height: '110%',
        width: '100%',
    },
    container: {
        padding: 16,
        backgroundColor: '#fff',
        height: '100%',
        backgroundColor: '#91b585',
    },
    balanceContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 15,
        width: 120,
        maxWidth: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        alignSelf: 'center'
    },
    balanceText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10
    },
    topicTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333333',
        marginLeft: 7
    },
    brochureCard: {
        margin: 8,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 175,
        height: 300,
    },
    brochureImage: {
        width: 130,
        height: 150,
        marginBottom: 8,
        borderRadius: 10,
    },
    brochureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    purchaseButton: {
        backgroundColor: '#007BFF',
        padding: 8,
        borderRadius: 8,
        marginTop: 8,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    purchaseButtonText: {
        color: '#fff',
        fontSize: 16,
    }
});

export default Store;
