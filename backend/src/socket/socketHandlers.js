const logger = require('../utils/logger');
const { SOCKET_EVENTS } = require('../utils/socketEvents');


class SocketHandlers {
  constructor(io, f1DataService) {
    this.io = io;
    this.f1DataService = f1DataService;
  }

  handleConnection(socket) {
    // Join live timing room by default
    socket.join('live-timing');
    
    // Send current session info immediately
    this.sendCurrentSessionInfo(socket);

    // Handle client events
    socket.on(SOCKET_EVENTS.JOIN_LIVE_TIMING, () => {
      socket.join('live-timing');
      logger.info(`Client ${socket.id} joined live-timing room`);
      this.sendCurrentSessionInfo(socket);
    });

    socket.on(SOCKET_EVENTS.LEAVE_LIVE_TIMING, () => {
      socket.leave('live-timing');
      logger.info(`Client ${socket.id} left live-timing room`);
    });

    socket.on(SOCKET_EVENTS.REQUEST_SESSION_HISTORY, async (data) => {
      try {
        const history = await this.f1DataService.getSessionHistory(data?.limit || 10);
        socket.emit(SOCKET_EVENTS.SESSION_HISTORY, history);
      } catch (error) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to fetch session history' });
      }
    });

    socket.on(SOCKET_EVENTS.PING, () => {
      socket.emit(SOCKET_EVENTS.PONG, { timestamp: new Date().toISOString() });
    });

    socket.on('disconnect', (reason) => {
      logger.info(`Client ${socket.id} disconnected: ${reason}`);
    });
  }

  async sendCurrentSessionInfo(socket) {
    try {
      const currentSession = await this.f1DataService.getCurrentSession();
      if (currentSession) {
        socket.emit(SOCKET_EVENTS.SESSION_INFO, {
          currentSession,
          isLive: this.f1DataService.isLive,
          sessionKey: this.f1DataService.currentSessionKey
        });
      }
    } catch (error) {
      logger.error('Error sending current session info:', error);
    }
  }
}

module.exports = SocketHandlers;
