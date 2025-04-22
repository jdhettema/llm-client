import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = '#0066cc' }) => {
  const sizes = {
    small: '20px',
    medium: '30px',
    large: '40px'
  };
  
  const spinnerStyle = {
    width: sizes[size] || sizes.medium,
    height: sizes[size] || sizes.medium,
    borderRadius: '50%',
    border: `3px solid rgba(0, 0, 0, 0.1)`,
    borderTopColor: color,
    animation: 'spin 1s infinite linear',
    display: 'inline-block'
  };
  
  return (
    <div className="loading-spinner-container">
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle} />
    </div>
  );
};

export default LoadingSpinner;