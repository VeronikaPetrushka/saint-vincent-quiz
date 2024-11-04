import React from 'react';
import { View } from "react-native";
import QuizExpert from '../components/QuizExpert';
import MenuPanel from "../components/MenuPanel"

const QuizExpertScreen = () => {


    return (
        <View style={styles.container}>
            <QuizExpert />
            <View style={styles.menu}>
                <MenuPanel />
            </View>
        </View>
    );
};

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },

    menu: {
        position: 'absolute',
        width: "100%",
        bottom: 15
    }
}

export default QuizExpertScreen;
