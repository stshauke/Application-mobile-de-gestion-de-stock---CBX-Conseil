import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  type: 'IN' | 'OUT';
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  loading?: boolean;
}

export default function StockMovementModal({ visible, type, onClose, onConfirm, loading }: Props) {
  const [value, setValue] = useState('');

  const isIn = type === 'IN';
  const parsed = parseInt(value, 10);
  const isValid = !isNaN(parsed) && parsed > 0;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(parsed);
    setValue('');
  };

  const handleClose = () => {
    setValue('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={[styles.iconCircle, { backgroundColor: isIn ? '#d1e7dd' : '#f8d7da' }]}>
            <FontAwesome5
              name={isIn ? 'arrow-up' : 'arrow-down'}
              size={20}
              color={isIn ? '#198754' : '#dc3545'}
            />
          </View>

          <Text style={styles.title}>{isIn ? 'Entrée de stock' : 'Sortie de stock'}</Text>
          <Text style={styles.subtitle}>
            Indiquez la quantité à {isIn ? 'ajouter' : 'retirer'}
          </Text>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#ced4da"
            value={value}
            onChangeText={(t) => setValue(t.replace(/[^0-9]/g, ''))}
            autoFocus
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                { backgroundColor: isIn ? '#198754' : '#dc3545' },
                (!isValid || loading) && styles.disabled,
              ]}
              onPress={handleConfirm}
              disabled={!isValid || loading}
            >
              <Text style={styles.confirmText}>{loading ? '...' : 'Confirmer'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 12,
    marginBottom: 20,
    color: '#212529',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f1f3f5',
    alignItems: 'center',
  },
  cancelText: {
    color: '#495057',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  disabled: {
    opacity: 0.5,
  },
});
