import React from 'react';

const badgeVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
};

const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const variantClasses = badgeVariants[variant] || badgeVariants.default;
  
  return (
    <div 
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Badge };