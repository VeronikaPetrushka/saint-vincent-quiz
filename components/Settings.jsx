import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleResetProgress = async () => {
        try {
            await AsyncStorage.removeItem('totalBalance');
            setIsModalVisible(false); // Hide the modal
            Alert.alert('Success', 'Progress has been reset.');
        } catch (error) {
            console.error('Failed to reset progress:', error);
            Alert.alert('Error', 'Failed to reset progress.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity
                style={styles.resetButton}
                onPress={() => setIsModalVisible(true)}
            >
                <Text style={styles.resetButtonText}>Reset Progress</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Are you sure?</Text>
                        <Text style={styles.modalMessage}>Do you really want to reset your progress? This action cannot be undone.</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.yesButton]}
                                onPress={handleResetProgress}
                            >
                                <Text style={styles.modalButtonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.noButton]}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '110%',
        justifyContent: 'start',
        alignItems: 'center',
        backgroundColor: '#c7d3b8',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white'
    },
    resetButton: {
        backgroundColor: '#618e4d',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        width: '100%',
        marginTop: 300
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        width: '45%',
    },
    yesButton: {
        backgroundColor: '#618e4d',
    },
    noButton: {
        backgroundColor: '#d9534f',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Settings;
