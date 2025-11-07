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
          { id: "1", name: "Sibongile Sikhosana", phone: "0754813435", address: "22 Ngwenya Str", joined_date: "2025-08-15", is_active: true },
          { id: "2", name: "Busisiwe Ndlovu", phone: "0819373825", address: "383 Ncwana Str", joined_date: "2025-08-15", is_active: true },
          { id: "3", name: "Lungile Khumalo", phone: "0617534272", address: "143 Ndlovu Str", joined_date: "2025-08-15", is_active: true },
          { id: "4", name: "Lindiwe Sibanyoni", phone: "0710864675", address: "48 Masina Str", joined_date: "2025-08-15", is_active: true },
          { id: "5", name: "Dorothy Kubheka", phone: "07823457423", address: "501 Monyane Str", joined_date: "2025-08-15", is_active: true },
          { id: "6", name: "Eva Mkhize", phone: "0819075357", address: "66 Lehoasa Str", joined_date: "2025-08-15", is_active: true },
          { id: "7", name: "Victoria Sikhakhane", phone: "0673357367", address: "1245 Masina Str", joined_date: "2025-08-15", is_active: true },
          { id: "8", name: "Palesa Hlatshwayo", phone: "0653267786", address: "667 Ncwana Str", joined_date: "2025-08-15", is_active: true },
          { id: "9", name: "Thabile Khoza", phone: "0762121345", address: "99 Masina Str", joined_date: "2025-08-15", is_active: true },
          { id: "10", name: "Agnes Mabaso", phone: "0818908643", address: "462 Ndlovu Str", joined_date: "2025-08-15", is_active: true },
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
