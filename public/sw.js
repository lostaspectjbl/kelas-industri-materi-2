self.addEventListener('install', (event) => {
    console.log('Service Worker Installing. ');
    self.skipWaitng();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker Activating');
    event.waiUntil(self.client.claim());
});

self.addEventListener('notificationclick', (event) => {
    console.log('On notification click: ', event.notification.tag);
    event.notification.close();

    const urlToOpen = new event.notification.data?.url || '/';

    event.waiUntil(
        self.clients.matchAll({ type: 'window', includeUnControlled: true })
            .them((clientList) => {
                if (clientList.lenght > 0) {
                    const client = clientList[0];
                    return client.navigate(urlToOpen);
                }
            })
    )
})