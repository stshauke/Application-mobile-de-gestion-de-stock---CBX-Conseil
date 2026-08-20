import { Platform } from 'react-native';
import { Product } from '../types';

let Notifications: typeof import('expo-notifications') | null = null;

try {
  Notifications = require('expo-notifications');
  Notifications?.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch {
  Notifications = null;
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Notifications) return false;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    return finalStatus === 'granted';
  } catch {
    return false;
  }
}

export async function notifyOutOfStockProducts(products: Product[]): Promise<void> {
  if (!Notifications) return;

  const outOfStock = products.filter((p) => p.quantity === 0);
  if (outOfStock.length === 0) return;

  try {
    const granted = await requestNotificationPermissions();
    if (!granted) return;

    const title = outOfStock.length === 1 ? '1 produit en rupture de stock' : `${outOfStock.length} produits en rupture de stock`;
    const names = outOfStock.map((p) => p.name).join(', ');

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: names,
      },
      trigger: null,
    });
  } catch {
    return;
  }
}
