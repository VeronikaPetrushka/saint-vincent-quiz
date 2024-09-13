import React from 'react';
import { SafeAreaView, View } from "react-native";
import Store from '../components/Store';
import MenuPanel from '../components/MenuPanel';

const StoreScreen = () => {

    return (
        <SafeAreaView style={styles.container}>
            <Store />
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
        justifyContent: "space-between"
    },

    menu: {
        position: 'fixed',
        width: "100%",
        top: -150
    }
}

export default StoreScreen;
