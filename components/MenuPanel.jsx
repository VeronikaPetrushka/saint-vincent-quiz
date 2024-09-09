import { SafeAreaView, TouchableOpacity } from "react-native"
import Icons from "./Icons";

const MenuPanel = () => {

    const home = 'home';
    const settings = 'settings';
    const shop = 'shop';
    const gallery = 'gallery';
    const results = 'results';


    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity>
                <Icons type={shop}/>
            </TouchableOpacity>
            <TouchableOpacity>
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
        backgroundColor: '#ccc',
        alignSelf: "center",
        borderRadius: 50
    },
}

export default MenuPanel;