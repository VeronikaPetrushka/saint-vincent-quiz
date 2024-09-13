import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, View, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AboutModal from '../components/AboutModal';

const MainMenu = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <ImageBackground
    source={require('../assets/background/genius.jpg')}
    style={styles.backgroundImage}
    resizeMode="cover"
>
    <View style={styles.overlay}>

    <SafeAreaView style={styles.container}>
      <Text style={styles.name}>{`Saint-Vincent \n Valley Adventures`}</Text>
      <View style={styles.btnsContainer}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('NewGameScreen')}>
          <Text style={styles.btnText}>New Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('DailyQuizScreen')}>
          <Text style={styles.btnText}>Daily tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={openModal}>
          <Text style={styles.btnText}>About</Text>
        </TouchableOpacity>
      </View>

      <AboutModal visible={modalVisible} onClose={closeModal} />
    </SafeAreaView>
    </View>
        </ImageBackground>

  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  backgroundImage: {
    width: '100%',
    height: '110%',
    justifyContent: 'center',
},
overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
},
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: '-50%',
    textAlign: 'center',
    color: 'white'
  },
  btnsContainer: {
    width: '100%',
    marginTop: '-40%',
  },
  btn: {
    padding: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
  },
  btnText: {
    fontSize: 20,
    color: 'white'
  },
});

export default MainMenu;
