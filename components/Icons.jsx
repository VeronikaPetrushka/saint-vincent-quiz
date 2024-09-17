import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Icons = ({ type }) => {

  let imageSource;
  let iconStyle = styles.icon;

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
    case 'gift':
      imageSource = require('../assets/quiz/gift.png');
      break;
    case 'plus':
      imageSource = require('../assets/quiz/plus.png');
      iconStyle = styles.plusIcon;
      break;
  }

  return (
    <Image 
      source={imageSource} 
      style={iconStyle} 
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 28,
    height: 28,
  },
  plusIcon: {
    width: 55,
    height: 55,
  },
});

export default Icons;
