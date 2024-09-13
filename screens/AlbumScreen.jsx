import React from 'react';
import { SafeAreaView, View } from "react-native";
import Album from '../components/Album';
import MenuPanel from '../components/MenuPanel';

const AlbumScreen = () => {


    return (
        <SafeAreaView style={styles.container}>
            <Album />
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
        top: -160
    }
}

export default AlbumScreen;
