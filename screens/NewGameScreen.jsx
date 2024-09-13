import { SafeAreaView, View } from "react-native"
import NewGame from "../components/NewGame"
import MenuPanel from "../components/MenuPanel";

const NewGameScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <NewGame />
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

export default NewGameScreen;