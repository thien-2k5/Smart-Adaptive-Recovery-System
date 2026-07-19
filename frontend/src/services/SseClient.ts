import { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const useSseClient = (customerId: number) => {
  const { triggerAlert } = useNotification();

  useEffect(() => {
    if (!customerId) return;

    console.log(`Connecting to SSE for customer ${customerId}...`);
    const eventSource = new EventSource(`${API_URL}/notifications/stream/${customerId}`);

    eventSource.addEventListener('DELAY_DETECTED', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received DELAY_DETECTED event:', data);
        triggerAlert({
          caseId: data.caseId,
          title: data.title,
          message: data.message
        });
      } catch (err) {
        console.error('Error parsing SSE event data', err);
      }
    });

    eventSource.onerror = (err) => {
      console.error('SSE Connection error, attempting to reconnect...', err);
      eventSource.close();
      // Browser's EventSource will automatically reconnect, but we close to reset
    };

    return () => {
      console.log('Closing SSE connection');
      eventSource.close();
    };
  }, [customerId, triggerAlert]);
};
