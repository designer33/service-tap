import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { Capacitor } from '@capacitor/core';

const SECURE_KEY = 'st_biometric_credentials';

export const isBiometricAvailable = async () => {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { isAvailable } = await NativeBiometric.isAvailable();
    return isAvailable;
  } catch (err) {
    console.error('Biometric check failed:', err);
    return false;
  }
};

export const hasBiometricCredentials = async () => {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { value } = await SecureStoragePlugin.get({ key: SECURE_KEY });
    return !!value;
  } catch {
    return false;
  }
};

export const saveBiometricCredentials = async (email, password) => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const credentials = JSON.stringify({ email, password });
    await SecureStoragePlugin.set({ key: SECURE_KEY, value: credentials });
    return true;
  } catch (err) {
    console.error('Save biometric credentials failed:', err);
    return false;
  }
};

export const getBiometricCredentials = async () => {
  if (!Capacitor.isNativePlatform()) return null;
  try {
    // 1. Authenticate user
    await NativeBiometric.verifyIdentity({
      reason: 'Authenticate to sign in to Service Knock',
      title: 'Biometric Login',
      subtitle: 'Use Face ID / Fingerprint',
      description: 'Please authenticate to continue'
    });

    // 2. Retrieve from secure storage
    const { value } = await SecureStoragePlugin.get({ key: SECURE_KEY });
    return JSON.parse(value);
  } catch (err) {
    console.error('Biometric authentication failed:', err);
    return null;
  }
};

export const clearBiometricCredentials = async () => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await SecureStoragePlugin.remove({ key: SECURE_KEY });
  } catch (err) {
    console.error('Clear biometric credentials failed:', err);
  }
};
