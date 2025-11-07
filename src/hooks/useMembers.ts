import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Member {
  id: string;
  name: string;
  phone: string;
  address: string;
  joined_date: string;
  is_active: boolean;
}

const STORAGE_KEY = "veggietrack_members";

export const useMembers = (includeDeleted = false) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMembers = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allMembers = JSON.parse(stored) as Member[];
        const filtered = includeDeleted 
          ? allMembers.filter(m => !m.is_active)
          : allMembers.filter(m => m.is_active);
        setMembers(filtered);
      } else {
        // Seed with initial data
        const initialMembers: Member[] = [
          { id: "1", name: "Star Arnold", phone: "0737368007", address: "2100 Soweto", joined_date: "2024-01-15", is_active: true },
          { id: "2", name: "Arnold Zulu", phone: "0814099783", address: "1351", joined_date: "2024-02-20", is_active: true },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMembers));
        setMembers(includeDeleted ? [] : initialMembers);
      }
      setIsLoading(false);
    };

    loadMembers();
  }, [includeDeleted]);

  const addMember = {
    mutate: (newMember: Omit<Member, "id" | "joined_date" | "is_active">, options?: { onSuccess?: () => void }) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allMembers = stored ? JSON.parse(stored) : [];
      
      const member: Member = {
        id: Date.now().toString(),
        ...newMember,
        joined_date: new Date().toISOString().split('T')[0],
        is_active: true,
      };

      const updated = [...allMembers, member];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      
      if (!includeDeleted) {
        setMembers(updated.filter(m => m.is_active));
      }
      
      toast.success("Member added successfully!");
      options?.onSuccess?.();
    }
  };

  const softDeleteMember = {
    mutate: (memberId: string) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allMembers = stored ? JSON.parse(stored) : [];
      
      const updated = allMembers.map((m: Member) => 
        m.id === memberId ? { ...m, is_active: false } : m
      );
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setMembers(updated.filter((m: Member) => includeDeleted ? !m.is_active : m.is_active));
      toast.success("Member moved to deleted list");
    }
  };

  const restoreMember = {
    mutate: (memberId: string) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allMembers = stored ? JSON.parse(stored) : [];
      
      const updated = allMembers.map((m: Member) => 
        m.id === memberId ? { ...m, is_active: true } : m
      );
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setMembers(updated.filter((m: Member) => includeDeleted ? !m.is_active : m.is_active));
      toast.success("Member restored successfully!");
    }
  };

  const permanentDeleteMember = {
    mutate: (memberId: string) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allMembers = stored ? JSON.parse(stored) : [];
      
      const updated = allMembers.filter((m: Member) => m.id !== memberId);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setMembers(updated.filter((m: Member) => includeDeleted ? !m.is_active : m.is_active));
      toast.success("Member permanently deleted");
    }
  };

  return {
    members,
    isLoading,
    addMember,
    softDeleteMember,
    restoreMember,
    permanentDeleteMember,
  };
};
