'use client';

import React, { createContext, useContext } from 'react';

interface TabsContextValue {
  activeValue: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabListProps {
  activeValue: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function TabList({
  activeValue,
  onChange,
  children,
  className = '',
}: TabListProps) {
  return (
    <TabsContext.Provider value={{ activeValue, onChange }}>
      <div
        role="tablist"
        className={`inline-flex gap-1 border-b border-gray-200 ${className}`}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tab({ value, children, disabled = false, className = '' }: TabProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab must be used within a TabList');
  }

  const isActive = context.activeValue === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => context.onChange(value)}
      className={`
        relative px-4 py-2.5 text-sm font-medium transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${
          isActive
            ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
