import { SafeAreaView, TouchableOpacity } from "react-native"
import { useNavigation } from '@react-navigation/native';
import Icons from "./Icons";

const MenuPanel = () => {
    const navigation = useNavigation();

    const home = 'home';
    const settings = 'settings';
    const shop = 'shop';
    const gallery = 'gallery';
    const results = 'results';

    const handleNavigateToGallery = () => {
            navigation.navigate('AlbumScreen');
        };

    const handleNavigateToStore= () => {
        navigation.navigate('StoreScreen');
    };


    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleNavigateToStore}>
                <Icons type={shop}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNavigateToGallery}>
                <Icons type={gallery}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Icons type={home}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Icons type={results}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Icons type={settings}/>
            </TouchableOpacity>
        </SafeAreaView>
    )
};

const styles = {

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
        borderRadius: 50
    },
}

export default MenuPanel;