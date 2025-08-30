import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    backgroundColor: disabled ? 'var(--purple-light)' : 'var(--purple-primary)',
    border: 'none',
    outline: 'none',
    ...style
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = 'var(--purple-deep)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = 'var(--purple-primary)';
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`mt-6 w-full text-white py-2 rounded transition-all duration-200 ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
