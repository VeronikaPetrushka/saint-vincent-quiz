import { SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import Icons from "./Icons";

const MenuPanel = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const home = 'home';
    const settings = 'settings';
    const shop = 'shop';
    const gallery = 'gallery';
    const results = 'results';

    const handleNavigateToHome = () => {
        navigation.navigate('MainMenuScreen');
    };

    const handleNavigateToGallery = () => {
        navigation.navigate('AlbumScreen');
    };

    const handleNavigateToStore = () => {
        navigation.navigate('StoreScreen');
    };

    const handleNavigateToResults = () => {
        navigation.navigate('ResultsScreen');
    };

    const handleNavigateToSettings = () => {
        navigation.navigate('SettingsScreen');
    };

    const isCurrent = (screen) => route.name === screen;

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleNavigateToStore} style={[styles.button, isCurrent('StoreScreen') && styles.activeButton]}>
                <Icons type={shop} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNavigateToGallery} style={[styles.button, isCurrent('AlbumScreen') && styles.activeButton]}>
                <Icons type={gallery} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNavigateToHome} style={[styles.button, isCurrent('MainMenuScreen') && styles.activeButton]}>
                <Icons type={home} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNavigateToResults} style={[styles.button, isCurrent('ResultsScreen') && styles.activeButton]}>
                <Icons type={results} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNavigateToSettings} style={[styles.button, isCurrent('SettingsScreen') && styles.activeButton]}>
                <Icons type={settings} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "90%",
        height: 75,
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignSelf: "center",
        borderRadius: 50,
    },
    button: {
        padding: 15,
        borderRadius: 30,
    },
    activeButton: {
        backgroundColor: '#c7d3b8',
    },
});

export default MenuPanel;
