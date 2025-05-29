const SOCKET_EVENTS = {
  // Client to Server
  JOIN_LIVE_TIMING: 'join_live_timing',
  LEAVE_LIVE_TIMING: 'leave_live_timing',
  REQUEST_SESSION_HISTORY: 'request_session_history',
  PING: 'ping',

  // Server to Client
  LIVE_DATA_UPDATE: 'live_data_update',
  SESSION_INFO: 'session_info',
  SESSION_HISTORY: 'session_history',
  CONNECTION_STATUS: 'connection_status',
  ERROR: 'error',
  PONG: 'pong'
}

module.exports = { SOCKET_EVENTS }
