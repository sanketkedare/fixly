import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ToastState {
  message: string;
  type: "success" | "error" | "info" | "loading";
  isVisible: boolean;
  isPersistent?: boolean;
}

export interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  actionType?: "danger" | "primary";
  onConfirmId?: string; // ID to identify which action to trigger
}

interface UiState {
  toast: ToastState;
  modal: ModalState;
}

const initialState: UiState = {
  toast: {
    message: "",
    type: "info",
    isVisible: false,
    isPersistent: false,
  },
  modal: {
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    actionType: "primary",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ message: string; type: ToastState["type"]; isPersistent?: boolean }>) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type,
        isVisible: true,
        isPersistent: action.payload.isPersistent || action.payload.type === "loading",
      };
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
    },
    showModal: (state, action: PayloadAction<Omit<ModalState, "isOpen">>) => {
      state.modal = {
        ...action.payload,
        isOpen: true,
      };
    },
    hideModal: (state) => {
      state.modal.isOpen = false;
    },
  },
});

export const { showToast, hideToast, showModal, hideModal } = uiSlice.actions;
export default uiSlice.reducer;
