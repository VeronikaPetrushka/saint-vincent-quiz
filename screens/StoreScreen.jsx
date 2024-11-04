import React from 'react';
import { View } from "react-native";
import Store from '../components/Store';
import MenuPanel from '../components/MenuPanel';

const StoreScreen = () => {

    return (
        <View style={styles.container}>
            <Store />
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

export default StoreScreen;
