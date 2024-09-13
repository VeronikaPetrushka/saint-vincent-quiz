import React from 'react';
import { SafeAreaView, View } from "react-native";
import QuizExpert from '../components/QuizExpert';
import MenuPanel from "../components/MenuPanel"

const QuizExpertScreen = () => {


    return (
        <SafeAreaView style={styles.container}>
            <QuizExpert />
            <View style={styles.menu}>
                <MenuPanel />
            </View>
        </SafeAreaView>
    );
};

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },

    menu: {
        position: 'fixed',
        width: "100%",
        top: -140
    }
}

export default QuizExpertScreen;
