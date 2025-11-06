import { usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";


const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname(); // current path

    const tabs = [
        { name: 'Home', path: '/'},
        { name: 'Map', path: '/map'},
    ];

    return (
        <View>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.name}
                    onPress={ () => router.push(tab.path)}
                >
                    <Text>
                        {tab.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}


export default Navbar;