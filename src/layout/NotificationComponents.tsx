"use client";

import { useEffect, createContext, useContext, ReactNode } from "react";
import { notificationManager, NotificationOption } from "@/lib/NotificationManager";

interface NotificationContextType {
    sendNotification: (option: NotificationOption) => Promise<void>;
    requestPermission: () => Promise<NotificationPermission>;
    isPermissionGranted: () => boolean;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({children}: {children: ReactNode}) {
    useEffect(() => {
        const initServerWorker = async () => {
            const initialized = await notificationManager.initialize();
            if (initialized) {
                console.log("Service Worker for notification initialized.")
            }
        };

        initServerWorker();
    }, []);

    const contextValue: NotificationContextType = {
        sendNotification: (option: NotificationOption) => notificationManager.sendNotification(option),
        requestPermission: () => notificationManager.requestPermission(),
        isPermissionGranted: () => notificationManager.isPermissionGranted(),

    };

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
}

//Custom hook untuk menggunakan context notifikasi
export function useNotification() {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }

    return context;
}

