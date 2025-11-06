import { StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> RunConnect </Text>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  title: { fontSize: 34, textAlign: 'center', color: '#991F26', fontWeight: 800},
  container: { flex: 1, justifyContent: 'center', alignItems: 'center'}
});
