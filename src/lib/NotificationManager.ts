import { error } from "console";
import { promises } from "dns";

export interface NotificationOption {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    redirectUrl?: string;
}

class NotificationManager {
    private swRegistration: ServiceWorkerRegistration | null = null;

    //inisialisasi service worker
    async initialize(): Promise<boolean> {
        if (!('serviceWorker' in navigator) || !('Notification' in window)) {
            console.warn('Service Worker atau Notification tidak didukung browser ini');
            return false;
        }

        try {
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('Service Worker registered successfully:', this.swRegistration);

            //tunggu hingga service aktif
            await navigator.serviceWorker.ready;

            return true;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return false;
        }
    }

    //request permission untuk notifikasi 
    async requestPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            console.warn('Notification tidak di dukung');
            return 'denied';
        }

        if (Notification.permission === 'granted') {
            return 'granted';
        }

        if (Notification.permission === 'denied') {
            const permission = await Notification.requestPermission();
            return permission;
        }

        return Notification.permission;
    }

    //cek apakah notifikasi sudah di izinkan 
    isPermissionGranted(): boolean {
        return 'Notification' in window && Notification.permission === 'granted';
    }

    //kirim notifikasi
    async sendNotification(option: NotificationOption): Promise<void> {
        if (!this.isPermissionGranted()) {
            console.warn('Permission untuk notifikasi belum diberikan');
            return;
        }

        if (!this.swRegistration) {
            await this.initialize();
        }

        if (!this.swRegistration) {
            console.error('Service Worker tidak tersedia');
            return;
        }

        try {
            const notificationOption: NotificationOption & { data?: { url: string } } = {
                title: option.title,
                body: option.body,
                icon: option.icon || '/icon-192x192.png',
                badge: option.badge || '/badge-72x72.png',
                data: {
                    url: option.redirectUrl || window.location.pathname
                }
            };

            await this.swRegistration.showNotification(option.title, notificationOption);
        } catch (error) {
            console.error('Error mengirim notifikasi:', error);
        }
    }

    //Helper untuk unregister service worker (untuk development/debugging)
    async unregister(): Promise<boolean> {
        if (!this.swRegistration) {
            return false;
        }

        try {
            const result = await this.swRegistration.unregister();
            this.swRegistration = null;
            return result;
        } catch (error) {
            console.error('Error Unregistering Worker:', error);
            return false;
        }
    }
}

//export singleton instance
export const notificationManager = new NotificationManager();