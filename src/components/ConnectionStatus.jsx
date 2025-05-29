const ConnectionStatus = ({ status, latency, isLive }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'connected': return isLive ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
      case 'disconnected': return 'text-gray-500 dark:text-gray-400'
      case 'error': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-500 dark:text-gray-400'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'connected': return isLive ? 'Live' : 'Connected'
      case 'disconnected': return 'Offline'
      case 'error': return 'Error'
      default: return 'Unknown'
    }
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${
        status === 'connected' && isLive 
          ? 'bg-green-600 animate-pulse' 
          : status === 'connected' 
            ? 'bg-blue-600' 
            : 'bg-gray-400'
      }`}></div>
      <span className={`font-light ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      {latency && status === 'connected' && (
        <span className="text-gray-500 dark:text-gray-400">({latency}ms)</span>
      )}
    </div>
  )
}

export default ConnectionStatus
