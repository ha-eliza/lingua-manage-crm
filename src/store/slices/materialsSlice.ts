import type { StateCreator } from 'zustand';
import type { Material } from '../../types';
import { mockMaterials } from '../../types/mockData';
import type { AppState } from '../useAppStore';

export interface MaterialsSlice {
  materials: Material[];
}

export const createMaterialsSlice: StateCreator<AppState, [['zustand/persist', unknown]], [], MaterialsSlice> = () => ({
  materials: mockMaterials,
  
});
