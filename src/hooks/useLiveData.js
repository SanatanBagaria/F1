"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { socketService } from "../services/socketService"
import { SOCKET_EVENTS } from "../utils/socketEvents"

export const useLiveData = () => {
  const [liveData, setLiveData] = useState({
    drivers: [],
    intervals: [],
    carData: [],
    sessions: [],
    currentSession: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [latency, setLatency] = useState(null)
  
  const pingIntervalRef = useRef(null)

  const connect = useCallback(() => {
    const socket = socketService.connect()

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected successfully')
      setConnectionStatus('connected')
      setError(null)
      
      // Join live timing room
      socket.emit(SOCKET_EVENTS.JOIN_LIVE_TIMING)
      
      // Start ping interval for latency measurement
      pingIntervalRef.current = setInterval(() => {
        const pingTime = Date.now()
        socket.emit(SOCKET_EVENTS.PING, { timestamp: pingTime })
      }, 30000)
    })

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
      setConnectionStatus('disconnected')
      setIsLive(false)
      
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current)
        pingIntervalRef.current = null
      }
    })

    // ✅ Enhanced error handling
    socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message)
      setConnectionStatus('error')
      setError(`Connection failed: ${error.message}`)
    })

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts')
      setConnectionStatus('connected')
      setError(null)
    })

    socket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection failed:', error.message)
      setConnectionStatus('error')
      setError('Reconnection failed')
    })

    // Data events
    socket.on(SOCKET_EVENTS.LIVE_DATA_UPDATE, (data) => {
      console.log('📡 Received live data update:', data)
      
      setLiveData(prevData => ({
        ...prevData,
        drivers: data.drivers || [],
        intervals: data.intervals || [],
        carData: data.carData || [],
        currentSession: data.currentSession || prevData.currentSession,
        sessions: data.currentSession ? [data.currentSession] : prevData.sessions
      }))
      setIsLive(data.isLive || false)
      setLoading(false)
    })

    socket.on(SOCKET_EVENTS.SESSION_INFO, (data) => {
      console.log('📋 Received session info:', data)
      setLiveData(prevData => ({
        ...prevData,
        currentSession: data.currentSession,
        sessions: [data.currentSession]
      }))
      setIsLive(data.isLive || false)
      setLoading(false)
    })

    socket.on(SOCKET_EVENTS.ERROR, (error) => {
      console.error('❌ Socket error:', error)
      setError(error.message || 'Unknown error')
    })

    socket.on(SOCKET_EVENTS.PONG, (data) => {
      const latency = Date.now() - data.timestamp
      setLatency(latency)
    })

  }, [])

  const disconnect = useCallback(() => {
    socketService.disconnect()
    
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current)
      pingIntervalRef.current = null
    }
    
    setConnectionStatus('disconnected')
    setIsLive(false)
  }, [])

  const refetch = useCallback(() => {
    if (connectionStatus !== 'connected') {
      connect()
    }
  }, [connectionStatus, connect])

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    liveData,
    loading,
    error,
    isLive,
    connectionStatus,
    latency,
    refetch,
    disconnect
  }
}
