import { io } from 'socket.io-client';
import useNotificationStore from '../store/notificationStore';

const SOCKET_URL = 'http://localhost:5000'; // Replace with your actual socket server URL

class SocketService {
  constructor() {
    this.socket = null;
    this.notificationStore = useNotificationStore.getState();
  }

  connect(userId, userType) {
    this.socket = io(SOCKET_URL, {
      auth: { userId, userType }
    });

    this.setupListeners();
  }

  setupListeners() {
    // Common notifications
    this.socket.on('notification', (data) => {
      this.notificationStore.addNotification(data);
    });

    // Mentor-specific events
    this.socket.on('newQuery', (data) => {
      this.notificationStore.addNotification({
        message: `New query received: ${data.title}`,
        type: 'query'
      });
    });

    this.socket.on('queryTransferred', (data) => {
      this.notificationStore.addNotification({
        message: `Query transferred to you: ${data.title}`,
        type: 'transfer'
      });
    });

    // Student-specific events
    this.socket.on('queryResponse', (data) => {
      this.notificationStore.addNotification({
        message: `Mentor responded to your query: ${data.title}`,
        type: 'response'
      });
    });

    this.socket.on('queryResolved', (data) => {
      this.notificationStore.addNotification({
        message: `Your query has been resolved: ${data.title}`,
        type: 'resolved'
      });
    });
  }

  // Mentor actions
  transferQuery(queryId, toMentorId) {
    this.socket.emit('transferQuery', { queryId, toMentorId });
  }

  sendQueryResponse(queryId, response) {
    this.socket.emit('sendResponse', { queryId, response });
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService();