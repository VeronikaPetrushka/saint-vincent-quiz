import { View } from "react-native"
import NewGame from "../components/NewGame"
import MenuPanel from "../components/MenuPanel";

const NewGameScreen = () => {
    return (
        <View style={styles.container}>
            <NewGame />
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
        justifyContent: "space-between"
    },

    menu: {
        position: 'absolute',
        width: "100%",
        bottom: 15
    }
}

export default NewGameScreen;