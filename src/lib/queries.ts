import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Bayi, Penimbangan, Imunisasi, Kader } from "./utils-bayi";

// ===== BAYI =====
export function useBayiList() {
  return useQuery({
    queryKey: ["bayi"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bayi").select("*").order("nama");
      if (error) throw error;
      return data as Bayi[];
    },
  });
}

export function useBayi(id: string) {
  return useQuery({
    queryKey: ["bayi", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("bayi").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as Bayi | null;
    },
    enabled: !!id,
  });
}

export function useMyBayi() {
  return useQuery({
    queryKey: ["bayi", "mine"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("bayi")
        .select("*")
        .eq("ortu_user_id", user.id)
        .order("nama");
      if (error) throw error;
      return data as Bayi[];
    },
  });
}

export function useSaveBayi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<Bayi> & { id?: string }) => {
      if (input.id) {
        const { id, ...patch } = input;
        const { error } = await supabase.from("bayi").update(patch).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("bayi").insert(input as never);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bayi"] }),
  });
}

export function useDeleteBayi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bayi").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bayi"] }),
  });
}

// ===== PENIMBANGAN =====
export function usePenimbanganList(bayiId?: string) {
  return useQuery({
    queryKey: ["penimbangan", bayiId ?? "all"],
    queryFn: async () => {
      let q = supabase.from("penimbangan").select("*").order("tanggal", { ascending: false });
      if (bayiId) q = q.eq("bayi_id", bayiId);
      const { data, error } = await q;
      if (error) throw error;
      return data as Penimbangan[];
    },
  });
}

export function useAddPenimbangan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { bayi_id: string; tanggal: string; berat_kg: number; tinggi_cm: number; catatan?: string }) => {
      const { error } = await supabase.from("penimbangan").insert(input);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["penimbangan"] }),
  });
}

// ===== IMUNISASI =====
export function useImunisasiList(bayiId?: string) {
  return useQuery({
    queryKey: ["imunisasi", bayiId ?? "all"],
    queryFn: async () => {
      let q = supabase.from("imunisasi").select("*").order("tanggal", { ascending: false });
      if (bayiId) q = q.eq("bayi_id", bayiId);
      const { data, error } = await q;
      if (error) throw error;
      return data as Imunisasi[];
    },
  });
}

export function useAddImunisasi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { bayi_id: string; jenis: string; tanggal: string }) => {
      const { error } = await supabase.from("imunisasi").insert(input);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["imunisasi"] }),
  });
}

// ===== KADER =====
export function useKaderList() {
  return useQuery({
    queryKey: ["kader"],
    queryFn: async () => {
      const { data, error } = await supabase.from("kader").select("*").order("nama");
      if (error) throw error;
      return data as Kader[];
    },
  });
}

export function useAddKader() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { nama: string; telepon?: string }) => {
      const { error } = await supabase.from("kader").insert({ ...input, aktif: true });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kader"] }),
  });
}

export function useDeleteKader() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("kader").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kader"] }),
  });
}
