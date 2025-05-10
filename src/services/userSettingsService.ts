'use server'; // Although this runs on client, marking for consistency if ever used by server actions

import type { UserSettings } from '@/types';
import { getItem, setItem } from '@/lib/localStorageClient';
import { USER_SETTINGS_KEY_PREFIX } from '@/constants/storageKeys';
import { getCurrentUser } from './authService';

/**
 * Retrieves user settings for the current user.
 * @returns A Promise that resolves to UserSettings or default settings if none found.
 */
export async function getUserSettings(): Promise<UserSettings> {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    // Return default settings if no user is logged in, or handle as an error
    return {
      theme: 'system',
      emailNotifications: true,
      pushNotifications: false,
      shareData: true,
    };
  }
  const settingsKey = `${USER_SETTINGS_KEY_PREFIX}${currentUser.username}`;
  const savedSettings = getItem<UserSettings>(settingsKey);
  
  const defaultSettings: UserSettings = {
    theme: 'system',
    emailNotifications: true,
    pushNotifications: false,
    shareData: true,
  };

  return { ...defaultSettings, ...savedSettings };
}

/**
 * Saves user settings for the current user.
 * @param settings The UserSettings object to save.
 * @returns A Promise that resolves when settings are saved.
 */
export async function saveUserSettings(settings: UserSettings): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    // Optionally throw an error or handle silently
    console.warn('Cannot save settings: No user logged in.');
    return;
  }
  const settingsKey = `${USER_SETTINGS_KEY_PREFIX}${currentUser.username}`;
  setItem(settingsKey, settings);
}
