import React from 'react'
import { Switch } from './ui/switch';

export const NotificationCardItem = ({
    title,
    description,
    icon: Icon,
    enabled,
    onChange,
  }:{
    title: string;
    description: string;
    icon: any;
    enabled: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-card hover:bg-accent/5 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} />
    </div>
  );