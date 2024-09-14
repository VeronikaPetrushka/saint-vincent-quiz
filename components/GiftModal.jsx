import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Easing, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from './Icons';

const Gift = ({ isVisible, onClose }) => {
    const [selectedGift, setSelectedGift] = useState(null);
    const [isShaking, setIsShaking] = useState(null);
    const [isGiftSelected, setIsGiftSelected] = useState(false);
    const shakeAnimation = useRef(new Animated.Value(0)).current;

    const gift = 'gift';

    const gifts = [200, 500, 1000, 2000, 5000];

    useEffect(() => {
        const listenerId = shakeAnimation.addListener(({ value }) => {
            console.log("Shake animation value:", value);
        });

        return () => {
            shakeAnimation.removeListener(listenerId);
        };
    }, [shakeAnimation]);

    const startShakeAnimation = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressIn = (index) => {
        if (!isGiftSelected) {
            setIsShaking(index);
            startShakeAnimation();
        }
    };

    const handlePressOut = async (index) => {
        if (!isGiftSelected) {
            setIsShaking(null);
            const gift = gifts[index];
            setSelectedGift(gift);
            setIsGiftSelected(true);

            setTimeout(async () => {
                await updateTotalBalance(gift);
                Alert.alert('Congratulations!', `You received ${gift} coins!`);
                onClose();
            }, 2000);
        }
    };

    const updateTotalBalance = async (giftValue) => {
        try {
            const storedBalance = await AsyncStorage.getItem('totalBalance');
            let newBalance = storedBalance ? parseInt(storedBalance, 10) : 0;
            newBalance += giftValue;

            await AsyncStorage.setItem('totalBalance', newBalance.toString());
        } catch (error) {
            console.error('Failed to update total balance:', error);
        }
    };

    const renderCubes = () => {
        return gifts.map((_, index) => (
            <TouchableOpacity
                key={index}
                style={[styles.cube, isShaking === index && styles.shaking, isGiftSelected && styles.disabled]}
                onPressIn={() => handlePressIn(index)}
                onPressOut={() => handlePressOut(index)}
                disabled={isGiftSelected}
            >
                <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
                    <Icons type={gift}/>
                </Animated.View>
            </TouchableOpacity>
        ));
    };

    return (
        <Modal
            transparent={true}
            visible={isVisible}
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Hold and press to receive a gift!</Text>
                    <View style={styles.cubesContainer}>
                        {renderCubes()}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
    },
    cubesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
    },
    cube: {
        width: 80,
        height: 80,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        margin: 5,
    },
    shaking: {
        backgroundColor: '#bbb',
    },
    disabled: {
        backgroundColor: '#ddd',
    },
    cubeText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Gift;
