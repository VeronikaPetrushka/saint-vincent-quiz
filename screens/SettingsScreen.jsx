import { SafeAreaView, View } from "react-native"
import Settings from "../components/Settings"
import MenuPanel from "../components/MenuPanel";

const SettingsScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Settings />
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
        justifyContent: "space-between"
    },

    menu: {
        position: 'fixed',
        width: "100%",
        top: -160
    }
}

export default SettingsScreen;