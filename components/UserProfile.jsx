import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, FlatList, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

const AVATAR_IMAGES = [
  { id: '1', uri: require('../assets/avatars/gorilla.png') },
  { id: '2', uri: require('../assets/avatars/chicken.png') },
  { id: '3', uri: require('../assets/avatars/dog-2.png') },
  { id: '4', uri: require('../assets/avatars/dog.png') },
  { id: '5', uri: require('../assets/avatars/bear.png') },
  { id: '6', uri: require('../assets/avatars/rabbit.png') },
  { id: '7', uri: require('../assets/avatars/girl.png') },
  { id: '8', uri: require('../assets/avatars/maya.png') },
  { id: '9', uri: require('../assets/avatars/woman-2.png') },
  { id: '10', uri: require('../assets/avatars/woman.png') },
  { id: '11', uri: require('../assets/avatars/man.png') },
  { id: '12', uri: require('../assets/avatars/man-4.png') },
  { id: '13', uri: require('../assets/avatars/man-3.png') },
  { id: '14', uri: require('../assets/avatars/man-2.png') },
];

const UserProfile = ({ resetProfile }) => {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_IMAGES[0].uri);
  const [showAvatars, setShowAvatars] = useState(false);
  const [buttonText, setButtonText] = useState("Create account");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userProfile');
        const storedAvatar = await AsyncStorage.getItem('userAvatar');

        if (storedName) {
          setName(storedName);
          setButtonText("Save changes");
        } else {
          setName("");
          setButtonText("Create account");
        }

        if (storedAvatar) {
          const avatar = AVATAR_IMAGES.find(img => img.id === storedAvatar);
          if (avatar) {
            setSelectedAvatar(avatar.uri);
          } else {
            setSelectedAvatar(AVATAR_IMAGES[0].uri);
          }
        } else {
          setSelectedAvatar(AVATAR_IMAGES[0].uri);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    if (!resetProfile) {
      loadProfile();
    } else {
      handleResetProfile();
    }
  }, [resetProfile]);


  const handleResetProfile = () => {
    setName("");
    setSelectedAvatar(AVATAR_IMAGES[0].uri);
    setButtonText("Create account");
  };

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleSubmit = async () => {
    try {
      const selectedAvatarId = AVATAR_IMAGES.find(img => img.uri === selectedAvatar)?.id;
      await AsyncStorage.setItem('userProfile', name);
      await AsyncStorage.setItem('userAvatar', selectedAvatarId || '1');
      console.log('User profile saved successfully!');
      setButtonText("Save changes");
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const toggleAvatarSelection = () => {
    setShowAvatars(!showAvatars);
  };

  const handleAvatarSelect = (avatarUri) => {
    setSelectedAvatar(avatarUri);
    setShowAvatars(false);
  };

  const renderAvatarItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleAvatarSelect(item.uri)} style={styles.avatarOption}>
      <Image source={item.uri} style={styles.avatarImage} />
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.upperContainer}>
            <Text style={styles.title}>Account</Text>
            <TouchableOpacity onPress={toggleAvatarSelection} style={styles.avatarPlaceholder}>
              <Image source={selectedAvatar} style={styles.avatarImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnChangeAvatar} onPress={toggleAvatarSelection}>
              <Text style={styles.btnText}>Change avatar</Text>
            </TouchableOpacity>
            {showAvatars ? (
              <FlatList
                data={AVATAR_IMAGES}
                renderItem={renderAvatarItem}
                keyExtractor={item => item.id}
                numColumns={4}
                style={styles.avatarList}
              />
            ) : (
              <View style={styles.inputContainer}>
                <TextInput
                  value={name}
                  placeholder="Enter your name"
                  placeholderTextColor="#ccc"
                  onChangeText={handleNameChange}
                  style={styles.input}
                />
                <View style={{ width: "100%" }}>
                  <TouchableOpacity style={styles.btnCreate} onPress={handleSubmit}>
                    <Text style={styles.btnText}>{buttonText}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};



const styles = {
    container: {
        padding: 15,
        flexDirection: "column", 
        justifyContent: "start",
        alignItems: "center",
        width: "100%",
        height: "57%",
        backgroundColor: "white",
        borderRadius: 15
    },

    upperContainer: {
      marginTop: 10,
      width: "100%",
      padding: 20,
      alignItems: "center"
    }, 

    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: height * 0.03
    },

    avatarPlaceholder: {
      width: height * 0.13,
      height: height * 0.13,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 100,
    },

    inputContainer: {
      width: "100%",
      justifyContent: "space-between"
    },

    input: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginVertical: 30,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 10,
      width: "100%",
      fontSize: 17
    },

    btnContainer: {
      width: "100%",
      padding: 40,
      alignItems: "center"
    },

    btnCreate: {
      width: "100%",
      alignItems: "center",
      padding: 12,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 20,
      marginBottom: 10,
    },

    btnReset: {
      width: "100%",
      alignItems: "center",
      padding: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 20,
    },
    btnText: {
      fontSize: 16
    },

    avatarImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover'
    },

    avatarList: {
      marginTop: 20,
      height: "49%"
    },

    avatarOption: {
      margin: 5,
      width: 60,
      height: 60,
      borderRadius: 40,
      overflow: 'hidden',
    },
    btnChangeAvatar: {
      marginTop: 10
    }
};

export default UserProfile;