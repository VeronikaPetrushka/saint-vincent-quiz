import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from './Icons';

const { height } = Dimensions.get('window');

const Store = ({ navigation }) => {
    const [totalBalance, setTotalBalance] = useState(0);
    const [brochuresData, setBrochuresData] = useState([]);
    const [purchasedState, setPurchasedState] = useState({});
    const balanceIcon = 'balance';

    useEffect(() => {
        const loadData = async () => {
            try {
                const balance = await AsyncStorage.getItem('totalBalance');
                const storedBrochures = await AsyncStorage.getItem('brochures');
                const storedPurchasedState = await AsyncStorage.getItem('purchasedState');

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

                if (storedPurchasedState) {
                    setPurchasedState(JSON.parse(storedPurchasedState));
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

            setBrochuresData(updatedBrochuresData);

            const newPurchasedState = {
                ...purchasedState,
                [brochure.name]: true
            };
            setPurchasedState(newPurchasedState);

            try {
                await AsyncStorage.setItem('totalBalance', newBalance.toString());
                await AsyncStorage.setItem('brochures', JSON.stringify(updatedBrochuresData));
                await AsyncStorage.setItem('purchasedState', JSON.stringify(newPurchasedState));
            } catch (error) {
                console.error('Failed to save data to AsyncStorage:', error);
            }
        }
    };

    const isBrochurePurchased = (brochureName, topic) => {
        const topicData = brochuresData.find(b => b.topic === topic);
        return topicData?.cards.some(card => card.name === brochureName && card.purchased) || purchasedState[brochureName];
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
                    {!purchased ? <Icons type={balanceIcon}/> : ''}
                    <Text style={styles.purchaseButtonText}>
                        {purchased ? 'Purchased' : `  ${item.price}`}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.wrapper}>
            <ScrollView style={styles.container}>
                <View style={styles.balanceContainer}>
                    <Icons type={balanceIcon} />
                    <Text style={styles.balanceText}>{totalBalance}</Text>
                </View>

                {!brochuresData.length ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyMessage}>Try the quiz and come back to shop!</Text>
                        <TouchableOpacity
                            style={styles.goBackButton}
                            onPress={() => navigation.navigate('NewGameScreen')}
                        >
                            <Text style={styles.goBackButtonText}>Go to Quiz</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    brochuresData.map((topic, index) => (
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
                    ))
                )}
                <View style={{height: 100}}/>
            </ScrollView>
        </View>
    );
};




const styles = StyleSheet.create({
    wrapper: {
        height: '100%',
        width: '100%',
        paddingTop: height * 0.07,
    },
    container: {
        padding: 16,
        backgroundColor: '#fff',
        height: '100%',
        backgroundColor: '#c7d3b8',
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
        width: "46%",
        height: height * 0.4,
    },
    brochureImage: {
        width: "100%",
        height: height * 0.2,
        marginBottom: 8,
        borderRadius: 10,
    },
    brochureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    purchaseButton: {
        backgroundColor: '#618e4d',
        padding: 8,
        borderRadius: 8,
        marginTop: 8,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 40
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    purchaseButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyMessage: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    goBackButton: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 8,
    },
    goBackButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Store;
