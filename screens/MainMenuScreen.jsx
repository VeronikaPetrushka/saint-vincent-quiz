// App name

// Background image

// MainMenu component 

// Menu panel fixed

import { SafeAreaView, View } from "react-native"
import MainMenu from "../components/MainMenu"
import MenuPanel from "../components/MenuPanel"

const MainMenuScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <MainMenu />
            <View style={styles.menu}>
                <MenuPanel />
            </View>
        </SafeAreaView>
    )
}; 

const styles = {
    container: {
        width: "100%",
        height: "100%",
    },

    menu: {
        position: 'fixed',
        width: "100%",
        top: -80
    }
}

export default MainMenuScreen;