import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Icons = ({ type }) => {

  let imageSource;

  switch (type) {
    case 'home':
      imageSource = require('../assets/panel/home.png');
      break;
    case 'settings':
      imageSource = require('../assets/panel/settings.png');
      break;
    case 'shop':
      imageSource = require('../assets/panel/shop.png');
      break;
    case 'gallery':
      imageSource = require('../assets/panel/gallery.png');
      break;
    case 'results':
      imageSource = require('../assets/panel/growth.png');
      break;
      case 'balance':
        imageSource = require('../assets/quiz/coin.png');
        break;
  }

  return (
    <Image 
      source={imageSource} 
      style={styles.icon} 
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 28,
    height: 28,
  },
});

export default Icons;
