// NotificationComponent.js
import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Handle notification when the app is running in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NotificationComponent = ({ message }) => {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Register for notifications when the component mounts
    registerForPushNotificationsAsync();

    // Listen to notifications when the app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground: ', notification);
    });

    // Handle the response when a user interacts with the notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('User clicked the notification: ', response);
    });

    // Clean up listeners on unmount
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Trigger the notification whenever message prop is updated
  useEffect(() => {
    if (message) {
      sendNotification(message);
    }
  }, [message]);

  const sendNotification = async (message) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `It's delivery date today!`,
          body: message,
        //   data: { messageData: message },
        },
        trigger: { seconds: 1 }, // Notification triggers after 1 second
      });
      console.log('Notification scheduled successfully');
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  return null; // This component does not need to render anything visually
};

// Register for notifications
async function registerForPushNotificationsAsync() {
  try {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo push token:', token);
    } else {
      alert('Must use a physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
      console.log('Notification channel set for Android');
    }

    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
  }
}

export default NotificationComponent;