// Shared singletons between the boot, motion and GL chunks (one module instance).
export const bus: {
  lenis: any | null;
  field: any | null;
  rm: boolean;
  record: false | 'home' | 'nav' | 'case';
  onPage: Set<() => void>;
  onSwap: Set<() => void>;
} = { lenis: null, field: null, rm: false, record: false, onPage: new Set(), onSwap: new Set() };
