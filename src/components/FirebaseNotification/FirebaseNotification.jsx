'use client';
import React, { useEffect, useState } from 'react';
import FirebaseData from '../../utils/Firebase'; // your FirebaseData file

const PushNotificationLayout = ({ children }) => {
  const [fcmToken, setFcmToken] = useState('');
  const { fetchToken, onMessageListener } = FirebaseData();

  // Fetch FCM token on mount
  useEffect(() => {
    if (!fetchToken) return;
    const handleFetchToken = async () => {
      await fetchToken(setFcmToken);
    };
    handleFetchToken();
  }, [fetchToken]);

  // Show notification on message received
  useEffect(() => {
    if (!onMessageListener) return;
    const result = onMessageListener();
    if (result && typeof result.then === 'function') {
      result
        .then((payload) => {
          if (payload?.notification) {
            const { title, body } = payload.notification;

            if (Notification.permission === 'granted') {
              new Notification(title, {
                body,
              });
            }
          }
        })
        .catch((err) => {
          console.error('Error receiving message:', err);
        });
    }
  }, [onMessageListener]);

  // Register service worker after token received
  useEffect(() => {
    if (fcmToken && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {

        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    }
  }, [fcmToken]);

  return <>{children}</>;
};

export default PushNotificationLayout;
