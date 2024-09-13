import { SafeAreaView, View } from "react-native"
import Results from "../components/Results"
import MenuPanel from "../components/MenuPanel";

const ResultsScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Results />
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

export default ResultsScreen;