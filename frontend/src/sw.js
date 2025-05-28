self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: data.icon || '/assets/icons/icon-192x192.png',
      badge: data.badge || '/assets/icons/badge-72x72.png',
      tag: data.tag || 'quote-notification',
      requireInteraction: data.requireInteraction || false,
      actions: data.actions || [],
      data: {
        url: data.url || '/user/quotes',  // Use the URL from notification or default
        timestamp: Date.now()
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Récupère l'URL depuis les données de la notification
  const notificationData = event.notification.data || {};
  let targetUrl = notificationData.url || '/user/quotes';

  // Si l'URL est relative, la transforme en absolue pour localhost
  if (targetUrl.startsWith('/')) {
    targetUrl = `http://localhost:4200${targetUrl}`;
  }

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      // Essayer de trouver un onglet existant
      for (const client of clientList) {
        if (client.url.includes('/user/quotes') && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Si aucun onglet trouvé, ouvrir une nouvelle fenêtre
      return clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});