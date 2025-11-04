import { StyleSheet, Text, View } from 'react-native';


const HomeScreen = () => {
  return (
    <View>
      <Text style ={styles.title}> Hi there! </Text>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center', color: '#530c0cff'}
})

