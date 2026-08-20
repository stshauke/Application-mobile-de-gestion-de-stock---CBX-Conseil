import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { getProductById, createProduct, updateProduct } from '../services/api';
import FormField from '../components/FormField';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductForm'>;

interface FormState {
  name: string;
  reference: string;
  category: string;
  description: string;
  quantity: string;
  alert_threshold: string;
}

interface FormErrors {
  name?: string;
  reference?: string;
  category?: string;
  quantity?: string;
  alert_threshold?: string;
}

const initialState: FormState = {
  name: '',
  reference: '',
  category: '',
  description: '',
  quantity: '',
  alert_threshold: '',
};

export default function ProductFormScreen({ route, navigation }: Props) {
  const productId = route.params?.productId;
  const isEditing = productId !== undefined;

  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: isEditing ? 'Modifier le produit' : 'Nouveau produit' });
  }, [navigation, isEditing]);

  useEffect(() => {
    if (!isEditing || productId === undefined) return;
    getProductById(productId)
      .then((product) => {
        setForm({
          name: product.name,
          reference: product.reference,
          category: product.category,
          description: product.description || '',
          quantity: String(product.quantity),
          alert_threshold: String(product.alert_threshold),
        });
      })
      .catch((err) => {
        Alert.alert('Erreur', err instanceof Error ? err.message : 'Erreur inconnue');
        navigation.goBack();
      })
      .finally(() => setLoading(false));
  }, [isEditing, productId, navigation]);

  const setField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = 'Le nom est obligatoire';
    if (!form.reference.trim()) newErrors.reference = 'La référence est obligatoire';
    if (!form.category.trim()) newErrors.category = 'La catégorie est obligatoire';

    if (form.quantity.trim()) {
      const q = Number(form.quantity);
      if (!Number.isInteger(q) || q < 0) newErrors.quantity = 'Doit être un entier positif';
    }

    if (form.alert_threshold.trim()) {
      const t = Number(form.alert_threshold);
      if (!Number.isInteger(t) || t < 0) newErrors.alert_threshold = 'Doit être un entier positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        reference: form.reference.trim(),
        category: form.category.trim(),
        description: form.description.trim() || undefined,
        quantity: form.quantity.trim() ? Number(form.quantity) : undefined,
        alert_threshold: form.alert_threshold.trim() ? Number(form.alert_threshold) : undefined,
      };

      if (isEditing && productId !== undefined) {
        await updateProduct(productId, payload);
      } else {
        await createProduct(payload as Required<typeof payload>);
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered} edges={['bottom']}>
        <ActivityIndicator size="large" color="#0d6efd" />
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <FormField
            label="Nom du produit"
            required
            value={form.name}
            onChangeText={(v) => setField('name', v)}
            error={errors.name}
            placeholder="Ex: Casque audio Bluetooth"
          />
          <FormField
            label="Référence"
            required
            value={form.reference}
            onChangeText={(v) => setField('reference', v)}
            error={errors.reference}
            placeholder="Ex: AUD-001"
            autoCapitalize="characters"
          />
          <FormField
            label="Catégorie"
            required
            value={form.category}
            onChangeText={(v) => setField('category', v)}
            error={errors.category}
            placeholder="Ex: Audio"
          />
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <FormField
                label={isEditing ? 'Quantité' : 'Quantité initiale'}
                value={form.quantity}
                onChangeText={(v) => setField('quantity', v.replace(/[^0-9]/g, ''))}
                error={errors.quantity}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.rowItem}>
              <FormField
                label="Seuil d'alerte"
                value={form.alert_threshold}
                onChangeText={(v) => setField('alert_threshold', v.replace(/[^0-9]/g, ''))}
                error={errors.alert_threshold}
                placeholder="5"
                keyboardType="numeric"
              />
            </View>
          </View>
          <FormField
            label="Description"
            value={form.description}
            onChangeText={(v) => setField('description', v)}
            placeholder="Description libre du produit"
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.disabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <FontAwesome5 name={isEditing ? 'save' : 'plus'} size={16} color="#ffffff" />
                <Text style={styles.submitText}>
                  {isEditing ? 'Enregistrer les modifications' : 'Créer le produit'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#ffffff',
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0d6efd',
    paddingVertical: 14,
    borderRadius: 12,
  },
  submitText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  disabled: {
    opacity: 0.6,
  },
});
