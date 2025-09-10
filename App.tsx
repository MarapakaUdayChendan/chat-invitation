import { StyleSheet, Text, View } from 'react-native';
import RootStackNavigation from './src/navigation/RootStackNavigation';
import ContactCard from './src/components/contacts/ContactCard';
import ContactHome from './src/screens/ContactHome';

export default function App() {
  return (
    <RootStackNavigation/>  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
