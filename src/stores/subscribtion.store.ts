import { create } from 'zustand';

interface App {
  id: number;
  name: string;
  image: string | null;
}

interface Game {
  id: number;
  name: string;
  image: string | null;
}

// Определение хранилища
export interface SubscriptionStore {
  step: number;
  application: App | null;
  game: Game | null;
  setStep: (step: number) => void;
  setApplication: (application: App) => void;
  setGame: (game: Game) => void;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  step: 1,
  application: null,
  game: null,
  setStep: (step) => set({ step }),
  setApplication: (application) => set({ application }),
  setGame: (game) => set({ game }),
  reset: () => set({ step: 1, application: null, game: null }),
}));