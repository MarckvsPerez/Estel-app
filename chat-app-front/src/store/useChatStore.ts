import { create } from "zustand";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import axiosInstance from "../lib/axios";

import { User } from "../types/User";
import { useAuthStore } from "./useAuthStore";
import { getStoredTokens } from "../lib/utils";

interface Message {
    _id: string;
    text: string;
    image: string | null;
    senderId: string;
    createdAt: string;
}

interface MessageData {
    text: string;
    image: string | null;
}

interface ChatStore {
    messages: Message[];
    users: User[];
    chats: User[];
    selectedUser: User | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;

    getUsers: () => Promise<void>;
    getChats: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    sendMessage: (messageData: MessageData) => Promise<void>;
    setSelectedUser: (selectedUser: User | null) => void;
    subscribeToMessages: () => void;
    unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],
    users: [],
    chats: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const options = {
                headers: {
                    Authorization: `Bearer ${getStoredTokens()}`,
                },
            };
            const res = await axiosInstance.get("/message/users", options);
            set({ users: res.data });
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "An error occurred");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getChats: async () => {
        set({ isUsersLoading: true });
        try {
            const options = {
                headers: {
                    Authorization: `Bearer ${getStoredTokens()}`,
                },
            };
            const res = await axiosInstance.get("/message/chats", options);
            
            set({ chats: res.data });
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "An error occurred");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true });
        try {
            const options = {
                headers: {
                    Authorization: `Bearer ${getStoredTokens()}`,
                },
            };
            const res = await axiosInstance.get(`/message/${userId}`, options);
            set({ messages: res.data });
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "An error occurred");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            set({ isMessagesLoading: false });
            const users = get().users;
            const updatedUsers = users.map(user => 
                user._id === userId 
                    ? { ...user, newMessage: false }
                    : user
            );
            set({ users: updatedUsers });
        }
    },
    sendMessage: async (messageData: MessageData) => {
        const { selectedUser, messages, chats } = get();
        try {
            const options = {
                headers: {
                    Authorization: `Bearer ${getStoredTokens()}`,
                },
            };
            const res = await axiosInstance.post(`/message/send/${selectedUser?._id}`, messageData, options);
            set({ messages: [...messages, res.data] });
            if (selectedUser) {
                set({ chats: [...chats, selectedUser] });
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "An error occurred");
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();

        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser?._id;
            if (isMessageSentFromSelectedUser) {
                set({
                    messages: [...get().messages, newMessage],
                });
            } else {
                const users = get().users;
                const updatedUsers = users.map(user => 
                    user._id === newMessage.senderId 
                        ? { ...user, newMessage: true }
                        : user
                );
                set({ users: updatedUsers });
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));