import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface PendingCollection {
  id: string;
  memberName: string;
  phone: string;
  day: string;
  date: string;
  time: string;
  synced: boolean;
}

const STORAGE_KEY = "veggie_track_pending_collections";
const COLLECTIONS_KEY = "veggie_track_collections";

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);

  // Load pending collections from localStorage
  const loadPendingCollections = useCallback((): PendingCollection[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading pending collections:", error);
      return [];
    }
  }, []);

  // Save pending collections to localStorage
  const savePendingCollections = useCallback((collections: PendingCollection[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
      setPendingCount(collections.filter(c => !c.synced).length);
    } catch (error) {
      console.error("Error saving pending collections:", error);
    }
  }, []);

  // Load all collections from localStorage
  const loadCollections = useCallback(() => {
    try {
      const stored = localStorage.getItem(COLLECTIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading collections:", error);
      return [];
    }
  }, []);

  // Save all collections to localStorage
  const saveCollections = useCallback((collections: any[]) => {
    try {
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
    } catch (error) {
      console.error("Error saving collections:", error);
    }
  }, []);

  // Add a collection (works offline)
  const addCollection = useCallback((collection: Omit<PendingCollection, 'synced'>) => {
    const newCollection: PendingCollection = {
      ...collection,
      synced: isOnline,
    };

    const pending = loadPendingCollections();
    const updated = [...pending, newCollection];
    savePendingCollections(updated);

    // Also add to main collections
    const allCollections = loadCollections();
    saveCollections([newCollection, ...allCollections]);

    if (!isOnline) {
      toast.info("Collection saved offline. Will sync when online.");
    }

    return newCollection;
  }, [isOnline, loadPendingCollections, savePendingCollections, loadCollections, saveCollections]);

  // Sync pending collections when back online
  const syncPendingCollections = useCallback(async () => {
    const pending = loadPendingCollections();
    const unsynced = pending.filter(c => !c.synced);

    if (unsynced.length === 0) return;

    // In a real app, you would send these to your backend API
    // For now, we'll just mark them as synced
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const updated = pending.map(c => ({ ...c, synced: true }));
      savePendingCollections(updated);

      toast.success(`Synced ${unsynced.length} collection(s)`);

      // Clear synced items after a delay
      setTimeout(() => {
        savePendingCollections([]);
      }, 5000);
    } catch (error) {
      console.error("Error syncing collections:", error);
      toast.error("Failed to sync collections");
    }
  }, [loadPendingCollections, savePendingCollections]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back online! Syncing data...");
      syncPendingCollections();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("You're offline. Changes will be saved locally.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial sync if online
    if (isOnline) {
      const pending = loadPendingCollections();
      setPendingCount(pending.filter(c => !c.synced).length);
      if (pending.some(c => !c.synced)) {
        syncPendingCollections();
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [syncPendingCollections, loadPendingCollections, isOnline]);

  return {
    isOnline,
    pendingCount,
    addCollection,
    loadCollections,
    saveCollections,
    syncPendingCollections,
  };
}
