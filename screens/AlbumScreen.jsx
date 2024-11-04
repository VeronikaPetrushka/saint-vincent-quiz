import React from 'react';
import { View } from "react-native";
import Album from '../components/Album';
import MenuPanel from '../components/MenuPanel';

const AlbumScreen = () => {


    return (
        <View style={styles.container}>
            <Album />
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

export default AlbumScreen;
