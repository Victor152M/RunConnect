import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  const tabs = [
    { name: 'Home', path: '/'},
    { name: 'Map', path: '/map'},
  ];

  return (
    <View style={styles.navbarContainer}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.navbar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              onPress={() => router.push(tab.path)}
              style={[
                styles.tab,
                pathname === tab.path && styles.activeTab
              ]}
            >
              <Text style={[
                styles.tabText,
                pathname === tab.path && styles.activeTabText
              ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  safeArea: {
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#991F26',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#991F26',
    fontWeight: 'bold',
  },
});

export default Navbar;