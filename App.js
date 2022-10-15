
import { StyleSheet, View } from 'react-native';
import UploadScreen from './src/UploadScreen';


export default function App() {
  return (
    <View style={styles.container}>
      <UploadScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});
