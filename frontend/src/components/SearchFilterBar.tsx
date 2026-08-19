import React from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function SearchFilterBar({
  search,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <FontAwesome5 name="search" size={14} color="#adb5bd" />
        <TextInput
          style={styles.input}
          placeholder="Rechercher un produit..."
          placeholderTextColor="#adb5bd"
          value={search}
          onChangeText={onSearchChange}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <FontAwesome5 name="times-circle" size={16} color="#adb5bd" solid />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsRow}
        contentContainerStyle={styles.chipsContent}
      >
        <TouchableOpacity
          style={[styles.chip, selectedCategory === null && styles.chipActive]}
          onPress={() => onCategoryChange(null)}
        >
          <Text style={[styles.chipText, selectedCategory === null && styles.chipTextActive]}>
            Toutes
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.chip, selectedCategory === category && styles.chipActive]}
            onPress={() => onCategoryChange(category)}
          >
            <Text style={[styles.chipText, selectedCategory === category && styles.chipTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#212529',
  },
  chipsRow: {
    flexGrow: 0,
  },
  chipsContent: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  chipActive: {
    backgroundColor: '#0d6efd',
    borderColor: '#0d6efd',
  },
  chipText: {
    fontSize: 13,
    color: '#495057',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#ffffff',
  },
});
