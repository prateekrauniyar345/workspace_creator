export type WindowLayout = {
    app: string;
    position: { x: number; y: number; width: number; height: number };
  };
  
  export type WorkspaceProfile = {
    name: string;
    description?: string;
    apps: string[];
    urls: string[];
    windowLayout?: WindowLayout[];
    schedules?: {
      time: string;
      repeatDaily: boolean;
    }[];
  };
  