
import { storageService } from './storageService';
import { STORAGE_KEYS } from '../constants';
import type { TryOnState } from '../types';

const VIRTUAL_TRY_ON_KEY = STORAGE_KEYS.VIRTUAL_TRY_ON;

const getInitialState = (): TryOnState => ({
  userImage: null,
  frameX: 50,
  frameY: 50,
  frameScale: 1,
  frameRotation: 0,
});

export const virtualTryOnService = {
  getState(): TryOnState {
    return storageService.getItem<TryOnState>(VIRTUAL_TRY_ON_KEY) ?? getInitialState();
  },

  saveState(state: TryOnState): void {
    storageService.setItem(VIRTUAL_TRY_ON_KEY, state);
  },
  
  clearState(): void {
    storageService.removeItem(VIRTUAL_TRY_ON_KEY);
  }
};
