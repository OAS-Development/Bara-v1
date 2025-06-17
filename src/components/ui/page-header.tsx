import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, icon, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          {icon}
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}