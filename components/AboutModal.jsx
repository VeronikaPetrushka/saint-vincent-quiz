import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const AboutModal = ({ visible, onClose }) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView style={{width: '100%'}}>
                        <Text style={styles.modalText}>
                            Saint-Vincent Valley Adventures is your gateway to the stunning world of Saint-Vincent, Italy. Explore picturesque valleys like Val d’Ayas and Valtournenche, discovering their natural beauty and opportunities for outdoor activities. Learn about the rich history and culture of the region through historical landmarks, including the Church of Saint Vincent and the Castle of Châtillon. Enjoy the relaxing thermal springs and botanical garden that offer tranquility and rejuvenation. Marvel at the breathtaking landscapes of the Matterhorn and Lake Lod, and savor exquisite Italian cuisine at the finest restaurants and cafes in town. Find the perfect place to stay at top hotels like Grand Hotel Billia and Hotel Parc et Lac. Your adventure in Saint-Vincent starts here!
                        </Text>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </ScrollView>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        height: '72%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalText: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    closeButton: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#618e4d',
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default AboutModal;
