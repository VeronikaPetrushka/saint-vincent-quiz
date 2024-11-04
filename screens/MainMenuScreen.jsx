import { View } from "react-native"
import MainMenu from "../components/MainMenu"
import MenuPanel from "../components/MenuPanel"

const MainMenuScreen = () => {
    return (
        <View style={styles.container}>
            <MainMenu />
            <View style={styles.menu}>
                <MenuPanel />
            </View>
        </View>
    )
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

export default MainMenuScreen;