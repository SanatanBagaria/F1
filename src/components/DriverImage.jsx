// components/DriverImage.jsx
import { useState } from 'react';

const DriverImage = ({ 
  driverName, 
  className = "w-12 h-12 rounded-full",
  size = 200 
}) => {
  const [imageError, setImageError] = useState(false);

  // Generate initials from driver name
  const getInitials = (name) => {
    if (!name) return 'DR';
    
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on driver name
  const getDriverColor = (name) => {
    if (!name) return '#EF4444';
    
    const colors = [
      '#EF4444', '#F97316', '#F59E0B', '#EAB308', 
      '#84CC16', '#22C55E', '#10B981', '#14B8A6',
      '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
      '#8B5CF6', '#A855F7', '#D946EF', '#EC4899',
      '#F43F5E', '#E11D48', '#BE185D', '#A21CAF'
    ];
    
    // Create a hash from the driver name for consistent colors
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // If image failed to load, show initials avatar
  if (imageError) {
    const initials = getInitials(driverName);
    const backgroundColor = getDriverColor(driverName);
    
    return (
      <div 
        className={`${className} flex items-center justify-center text-white font-semibold text-sm select-none`}
        style={{ backgroundColor }}
        title={driverName}
      >
        {initials}
      </div>
    );
  }

  // Try to load the placeholder image first
  return (
    <img
      src={`/placeholder.svg?height=${size}&width=${size}&text=${encodeURIComponent(driverName)}`}
      alt={driverName}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default DriverImage;
