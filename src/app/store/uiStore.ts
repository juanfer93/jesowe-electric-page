import { create } from "zustand";

export type ContactStatus = "idle" | "sending" | "sent" | "error";

type UIState = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  contactStatus: ContactStatus;
  contactError: string;
  setContactStatus: (s: ContactStatus) => void;
  setContactError: (msg: string) => void;
  resetContactStatus: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  contactStatus: "idle",
  contactError: "",
  setContactStatus: (contactStatus) => set({ contactStatus }),
  setContactError: (contactError) => set({ contactError }),
  resetContactStatus: () => set({ contactStatus: "idle", contactError: "" })
}));
