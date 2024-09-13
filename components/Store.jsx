import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import brochures from '../constants/brochures.js';
import Icons from './Icons';

const Store = () => {
    const [totalBalance, setTotalBalance] = useState(0);
    const [purchasedBrochures, setPurchasedBrochures] = useState({});
    const balance = 'balance';

    useEffect(() => {
        const loadTotalBalance = async () => {
            try {
                const balance = await AsyncStorage.getItem('totalBalance');
                if (balance !== null) {
                    setTotalBalance(parseInt(balance, 10));
                }
            } catch (error) {
                console.error('Failed to load balance from AsyncStorage:', error);
            }
        };

        // const loadPurchasedBrochures = async () => {
        //     try {
        //         const storedBrochures = await AsyncStorage.getItem('brochureData');
        //         if (storedBrochures !== null) {
        //             setPurchasedBrochures(JSON.parse(storedBrochures));
        //         }
        //     } catch (error) {
        //         console.error('Failed to load purchased brochures:', error);
        //     }
        // };

        loadTotalBalance();
        // loadPurchasedBrochures();
    }, []);

    // const handlePurchase = async (brochure) => {
    //     const price = brochure.price;
    //     if (totalBalance >= price) {
    //         const newBalance = totalBalance - price;
    //         setTotalBalance(newBalance);

    //         const updatedBrochureData = { ...purchasedBrochures, [brochure.name]: { purchased: true } };
    //         setPurchasedBrochures(updatedBrochureData);

    //         await AsyncStorage.setItem('totalBalance', newBalance.toString());
    //         await AsyncStorage.setItem('brochureData', JSON.stringify(updatedBrochureData));
    //     }
    // };

    // const isBrochurePurchased = (brochureName) => {
    //     return purchasedBrochures[brochureName]?.purchased;
    // };

    // const renderBrochureItem = ({ item }) => {
    //     const purchased = isBrochurePurchased(item.name);
    //     return (
    //         <View style={styles.brochureCard}>
    //             <Image source={item.image} style={styles.brochureImage} />
    //             <Text style={styles.brochureTitle}>{item.name}</Text>
    //             <TouchableOpacity
    //                 style={[styles.purchaseButton, (totalBalance < item.price || purchased) && styles.disabledButton]}
    //                 onPress={() => handlePurchase(item)}
    //                 disabled={totalBalance < item.price || purchased}
    //             >
    //                 <Text style={styles.purchaseButtonText}>
    //                     {purchased ? 'Purchased' : `$ ${item.price}`}
    //                 </Text>
    //             </TouchableOpacity>
    //         </View>
    //     );
    // };

    return (
        <SafeAreaView style={styles.wrapper}>
            <ScrollView style={styles.container}>
                <Text style={styles.balanceText}><Icons type={balance} /> {totalBalance}</Text>

                {/* {brochures.map((topic, index) => (
                    <View key={index}>
                        <Text style={styles.topicTitle}>{topic.topic}</Text>
                        <FlatList
                            data={topic.cards}
                            renderItem={renderBrochureItem}
                            keyExtractor={(item) => item.name}
                            numColumns={2}
                            scrollEnabled={false}
                            style={styles.list}
                        />
                    </View>
                ))} */}
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
    balanceText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    topicTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    brochureCard: {
        margin: 8,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        alignItems: 'center',
        width: 175,
        height: 250,
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
    },
});

export default Store;
