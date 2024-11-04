import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';

const { height } = Dimensions.get('window');

const CreateBrochure = ({ visible, onClose, onSubmit, brochureToEdit }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({ name: '', date: '', image: '' });
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        if (brochureToEdit) {
            setName(brochureToEdit.name);
            setDate(brochureToEdit.date);
            setDescription(brochureToEdit.description);
            setImage(brochureToEdit.image ? { uri: brochureToEdit.image } : null);
        } else {
            clearFields();
        }
    }, [brochureToEdit]);

    const clearFields = () => {
        setName('');
        setDate('');
        setDescription('');
        setImage(null);
        setErrors({ name: '', date: '', image: '' });
    };

    const options = {
        mediaType: 'photo',
        includeBase64: false,
        quality: 1,
    };

    const pickImageFromGallery = () => {
        launchImageLibrary(options, (response) => {
            if (!response.didCancel && !response.errorCode) {
                const source = { uri: response.assets[0].uri };
                setImage(source);
                setErrors({ ...errors, image: '' });
            }
        });
    };

    const takePhotoWithCamera = () => {
        launchCamera(options, (response) => {
            if (!response.didCancel && !response.errorCode) {
                const source = { uri: response.assets[0].uri };
                setImage(source);
                setErrors({ ...errors, image: '' });
            }
        });
    };

    const handleSubmit = async () => {
        let valid = true;
        const newErrors = { name: '', date: '', image: '' };

        if (name.length < 2 || name.length > 30) {
            newErrors.name = 'Name must be between 2 and 30 characters';
            valid = false;
        }

        if (!date) {
            newErrors.date = 'Date is required';
            valid = false;
        }

        if (!image) {
            newErrors.image = 'Image is required';
            valid = false;
        }

        if (valid) {
            const newBrochure = { name, date, description, image: image.uri };

            try {
                const storedBrochures = await AsyncStorage.getItem('UserBrochures');
                const brochures = storedBrochures ? JSON.parse(storedBrochures) : [];

                if (brochureToEdit) {
                    const updatedBrochures = brochures.map(brochure =>
                        brochure.name === brochureToEdit.name ? newBrochure : brochure
                    );
                    await AsyncStorage.setItem('UserBrochures', JSON.stringify(updatedBrochures));
                } else {
                    brochures.push(newBrochure);
                    await AsyncStorage.setItem('UserBrochures', JSON.stringify(brochures));
                }

                onSubmit(newBrochure);
                clearFields();
                onClose();
            } catch (error) {
                console.error('Failed to save brochure:', error);
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleClose = () => {
        if (!brochureToEdit) {
            clearFields();
        }
        onClose();
    };

    const handleDayPress = (day) => {
        setDate(day.dateString);
        setShowCalendar(false);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView contentContainerStyle={styles.container}>
                        <Text style={styles.title}>{brochureToEdit ? 'Edit Brochure' : 'Add New Brochure'}</Text>

                        {image && <Image source={image} style={styles.imagePreview} />}
                        {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

                        <TouchableOpacity style={styles.imageButton} onPress={pickImageFromGallery}>
                            <Text style={styles.buttonText}>Pick an Image from Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.imageButton} onPress={takePhotoWithCamera}>
                            <Text style={styles.buttonText}>Take a Photo</Text>
                        </TouchableOpacity>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter Name"
                            value={name}
                            onChangeText={setName}
                            maxLength={30}
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                        <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)} style={styles.dateInput}>
                            <Text>{date ? date : 'Select Date'}</Text>
                        </TouchableOpacity>
                        {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

                        {showCalendar && (
                            <Calendar
                                onDayPress={handleDayPress}
                                markedDates={{
                                    [date]: { selected: true, selectedColor: 'blue' },
                                }}
                            />
                        )}

                        <TextInput
                            style={styles.textArea}
                            placeholder="Enter Description"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            maxLength={300}
                        />
                        <Text style={styles.note}>Optional</Text>

                        <Button title="Submit" onPress={handleSubmit} />
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};



const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flexGrow: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#DDDDDD',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        height: 50,
        paddingHorizontal: 10,
        marginTop: 10,
        justifyContent: 'center'
    },
    textArea: {
        height: 140,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
        marginTop: 5,
    },
    note: {
        color: '#ccc',
        fontSize: 13,
        marginTop: 5,
        marginBottom: 5,
    },
    imageButton: {
        backgroundColor: '#618e4d',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    imagePreview: {
        width: '100%',
        height: 400,
        marginBottom: 20,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        height: '75%',
    },
    closeButton: {
        marginTop: 20,
        alignSelf: 'center',
        padding: 10,
        backgroundColor: '#618e4d',
        borderRadius: 12,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 15,
        fontSize: 13,
    },
});

export default CreateBrochure;
