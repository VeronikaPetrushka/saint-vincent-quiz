import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from './Icons';

const generateRandomPeople = () => {
    const names = ['John Doe', 'Jane Smith', 'Emily Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson', 'Laura Miller'];
    const people = names.map(name => ({
        name,
        balance: Math.floor(Math.random() * 10000)
    }));
    return people;
};

const Results = () => {
    const [people, setPeople] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const balance = 'balance';

    useEffect(() => {
        const loadTotalBalance = async () => {
            try {
                const storedTotalBalance = await AsyncStorage.getItem('totalBalance');
                if (storedTotalBalance !== null) {
                    setTotalBalance(parseInt(storedTotalBalance, 10));
                }
            } catch (error) {
                console.error('Failed to load total balance:', error);
            }
        };

        loadTotalBalance();
        setPeople(generateRandomPeople());
    }, []);

    const shareBalance = async () => {
        try {
            await Share.share({
                message: `My total balance is ${totalBalance} coins! Check out the app to see how you can earn more.`,
            });
        } catch (error) {
            console.error('Failed to share balance:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.balanceContainer}>
                <Icons type={balance}/>
                <Text style={styles.balance}>{item.balance}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Results</Text>
            <View style={styles.balanceContainerMain}>
                <Icons type={balance}/>
                <Text style={styles.totalBalance}>{totalBalance}</Text>
            </View>
            <FlatList
                data={people}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
            />
            <TouchableOpacity style={styles.shareButton} onPress={shareBalance}>
                <Text style={styles.shareButtonText}>Share My Balance</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#c7d3b8',
        height: '110%'
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
        color: '#333333'
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333'
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    balance: {
        fontSize: 18,
        marginLeft: 10,
        color: '#333333'
    },
    totalBalance: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10
    },
    balanceContainerMain: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 30
    },
    shareButton: {
        backgroundColor: '#618e4d',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        borderRadius: 15,
        position: 'absolute',
        bottom: 200,
        left: '6%',
        width: '100%'
    },
    shareButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default Results;
