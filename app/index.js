import { StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
  return (
    <View>
      <View>
        <Text style={styles.title}> Hi there! Modification number 2 </Text>
      </View>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  title: { fontSize: 24, textAlign: 'center', color: '#08e6ffa5'}
});
