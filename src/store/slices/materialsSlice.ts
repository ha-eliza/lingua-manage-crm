import type { StateCreator } from 'zustand';
import type { Material } from '../../types';
import type { AppState } from '../useAppStore';
import { MATERIALS } from '../../data/materials';

export interface MaterialsSlice {
  materials: Material[];
  addMaterial: (materialData: Omit<Material, 'id'>) => void;
  deleteMaterial: (id: string) => void;
}

export const createMaterialsSlice: StateCreator<AppState, [['zustand/persist', unknown]], [], MaterialsSlice> = (set, get) => ({
  materials: MATERIALS,

  // Функция добавления
  addMaterial: (materialData) => {
      const newId = `m_${Date.now()}`;
      const newMaterial: Material = {
        id: newId,
        ...materialData
      }
      const current = get().materials || [];
      set({ materials: [...current, newMaterial] })
    },

  // Функция удаления
  deleteMaterial: (id) => {
    const current = get().materials || [];
    set({ materials: current.filter((m) => m.id !== id) });
  }
});
