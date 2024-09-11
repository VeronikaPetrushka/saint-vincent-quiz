import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AboutModal from '../components/AboutModal';

const MainMenu = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
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
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: '-50%',
    textAlign: 'center',
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
    fontSize: 18,
  },
});

export default MainMenu;
