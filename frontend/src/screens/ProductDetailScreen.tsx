import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen({ route }: Props) {
  const { productId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Détail du produit {productId}</Text>
      <Text style={styles.subtext}>Écran complété à l'étape 4</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  subtext: {
    fontSize: 13,
    color: '#adb5bd',
    marginTop: 6,
  },
});
