import type { StateCreator } from 'zustand';
import type { Material } from '../../types';
import type { AppState } from '../useAppStore';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export interface MaterialsSlice {
  materials: Material[];
  fetchMaterials: () => Promise<void>;
  addMaterial: (materialData: Omit<Material, 'id'>) => void;
  deleteMaterial: (id: string) => void;
}

export const createMaterialsSlice: StateCreator<AppState, [['zustand/persist', unknown]], [], MaterialsSlice> = (set, get) => ({
  materials: [],

  fetchMaterials: async () => {
    const querySnapshot = await getDocs(collection(db, "materials"));
    const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Material[];
    set({ materials: list });
  },

  // Функция добавления
  addMaterial: async (materialData) => {
      const newId = `m_${Date.now()}`;
      const newMaterial: Material = {
        id: newId,
        ...materialData
      }
      await setDoc(doc(db, "materials", newId), newMaterial);
      const current = get().materials || [];
      set({ materials: [...current, newMaterial] })
    },

  // Функция удаления
  deleteMaterial: async (id) => {
    await deleteDoc(doc(db, "materials", id)) // Удаление из Firebase
    const current = get().materials || [];
    set({ materials: current.filter((m) => m.id !== id) });
  }
});
