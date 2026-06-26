import type { StateCreator } from 'zustand';
import type { Material } from '../../types';
import { mockMaterials } from '../../types/mockData';
import type { AppState } from '../useAppStore';

export interface MaterialsSlice {
  materials: Material[];
  addMaterial: (materialData: Omit<Material, 'id'>) => void;
  deleteMaterial: (id: string) => void;
}

export const createMaterialsSlice: StateCreator<AppState, [['zustand/persist', unknown]], [], MaterialsSlice> = (set) => ({
  materials: mockMaterials,

  // Функция добавления
  addMaterial: (materialData) =>
    set((state) => {
      const newId = `m_${Date.now()}`;
      const newMaterial: Material = {
        id: newId,
        ...materialData
      }
      return { materials: [...state.materials, newMaterial] }
    }),

  // Функция удаления
  deleteMaterial: (id) =>
    set((state) => ({
      materials: state.materials.filter((material) => material.id !== id)
    }))
});
