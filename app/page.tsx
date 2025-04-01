
'use client';
import { useState, useEffect } from 'react';
import AppSelector from '@/components/AppSelector';
import LayoutEditor from '@/components/LayoutEditor';
import ProfileManager from '@/components/ProfileManager';
import { pipe } from '@screenpipe/browser';
import type { WorkspaceProfile } from '@/types';


export default function WorkspaceOrchestrator() {
  const [aiCommand, setAiCommand] = useState('');
  const [profiles, setProfiles] = useState<WorkspaceProfile[]>([]);
  const [windows, setWindows] = useState<WindowLayout[]>([]);
  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [scheduleTime, setScheduleTime] = useState<string>(''); // format: HH:MM
  const [repeatDaily, setRepeatDaily] = useState<boolean>(false);
  const [urls, setUrls] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState<string>('');


  // Fetch installed applications
  useEffect(() => {
    const fetchInstalledApps = async () => {
      try {
        const response = await fetch('/api/getInstalledApps');
        if (!response.ok) throw new Error('Failed to fetch installed apps');
        const apps = await response.json();
        setInstalledApps(apps);
      } catch (error) {
        console.error('Error fetching installed apps:', error);
        alert('Could not fetch installed applications.');
      }
    };

    fetchInstalledApps();
  }, []);

  // Apply a workspace profile immediately
  const applyProfile = async (profile: WorkspaceProfile) => {
    console.log("Applying profile:", profile);
  
    const apps = Array.isArray(profile.apps) ? profile.apps : [];
    const urls = Array.isArray(profile.urls) ? profile.urls : [];
  
    // Open Applications
    for (const app of apps) {
      try {
        console.log("Opening app:", app);
        await pipe.operator.openApplication(`/Applications/${app}.app`);
        // await pipe.operator.openApplication(app);
        await new Promise(resolve => setTimeout(resolve, 10000));
      } catch (err) {
        console.error(`Failed to open app "${app}":`, err);
      }
    }
  
    // Open URLs (in parallel)
    await Promise.all(urls.map(async (url) => {
      try {
        console.log("Opening URL:", url);
        await pipe.operator.openUrl(url);
      } catch (err) {
        console.error(`Failed to open URL "${url}":`, err);
      }
    }));
  
    // Arrange windows
    if (profile.windowLayout && pipe.operator.arrangeWindows) {
      try {
        await pipe.operator.arrangeWindows(profile.windowLayout);
      } catch (err) {
        console.error('Failed to arrange windows:', err);
      }
    }

    // Send desktop notification
    try {
        await pipe.sendDesktopNotification({
        title: "Workspace Launched",
        body: `Your '${profile.name}' workspace is ready 🚀`
        });
    } catch (err) {
        console.warn("Failed to send desktop notification:", err);
    }
  };
  

  // Schedule app opening
  const scheduleAppOpening = (profile: WorkspaceProfile) => {
    if (!profile.schedules || profile.schedules.length === 0) return;

    for (const sched of profile.schedules) {
      const now = new Date();
      const [hour, minute] = sched.time.split(':').map(Number);
      const scheduledTime = new Date();
      scheduledTime.setHours(hour, minute, 0, 0);

      // If the time has passed for today, schedule for tomorrow
      if (scheduledTime < now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const delay = scheduledTime.getTime() - now.getTime();
      console.log(`Scheduling app launch in ${delay / 1000}s`);

      setTimeout(() => {
        applyProfile(profile);
        if (sched.repeatDaily) {
          setInterval(() => applyProfile(profile), 24 * 60 * 60 * 1000); // Every 24 hours
        }
      }, delay);
    }
  };

  const saveProfile = (profileInfo: {
    name: string;
    description?: string;
    apps?: string[];
    urls?: string[];
  }) => {
    const newProfile: WorkspaceProfile = {
      name: profileInfo.name,
      description: profileInfo.description || '',
      apps: profileInfo.apps ?? windows.map(w => w.app),
      urls: profileInfo.urls ?? [],
      windowLayout: windows,
      schedules: scheduleTime
        ? [{ time: scheduleTime, repeatDaily }]
        : [],
    };
  
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    localStorage.setItem('workspace-profiles', JSON.stringify(updated));
    setWindows([]);
    setUrls([]);
    setNewUrl('');
    setScheduleTime('');
    setRepeatDaily(false);
  };
  



// handle ai
const handleAiCommand = async () => {
    if (!aiCommand.trim()) return;
  
    try {
      const response = await fetch("/api/ai/generate-profile", {
        method: "POST",
        body: JSON.stringify({ prompt: aiCommand }),
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.json();
  
      const installedLower = installedApps.map(app => app.toLowerCase());
  
      const apps: string[] = [];
      const urls: string[] = [];
  
      for (const entry of data.entries || []) {
        const entryLower = entry.toLowerCase();
  
        const matchedApp = installedApps.find(app => app.toLowerCase() === entryLower);
  
        if (matchedApp) {
          apps.push(matchedApp); // preserve original casing
        } else {
          const cleanUrl = entry.startsWith("http") ? entry : `https://${entryLower}.com`;
          urls.push(cleanUrl);
        }
      }
  
      console.log("🧠 Final apps:", apps);
      console.log("🧠 Final urls:", urls);
  
      saveProfile({
        name: data.name || "AI Workspace",
        description: `Auto-generated from: "${aiCommand}"`,
        apps,
        urls,
      });
  
      setAiCommand('');
    } catch (err) {
      console.error("Failed to generate profile:", err);
      alert("Something went wrong while generating the profile.");
    }
  };
  
  
  

  // Load profiles from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('workspace-profiles');
    if (stored) {
      const parsed: WorkspaceProfile[] = JSON.parse(stored);
      setProfiles(parsed);
      parsed.forEach(scheduleAppOpening); // Schedule on load
    }
  }, []);

  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      <div className="col-span-1">
      <ProfileManager
        profiles={profiles}
        onApply={applyProfile}
        onSave={saveProfile}
        onDelete={(profileName) => {
            const updated = profiles.filter(p => p.name !== profileName);
            setProfiles(updated);
            localStorage.setItem('workspace-profiles', JSON.stringify(updated));
        }}
        />

        { /* 🧠 AI Profile Generator goes here */}
      <div className="mt-6 space-y-2">
        <label className="block text-sm font-medium">🧠 Create Profile with AI</label>
        <input
          type="text"
          placeholder='e.g. "Create workspace for editing: Photoshop, YouTube, Notion"'
          value={aiCommand}
          onChange={(e) => setAiCommand(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleAiCommand}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Generate Profile
        </button>
      </div>

        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium">Schedule Time:</label>
          <input
            type="time"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={repeatDaily}
              onChange={(e) => setRepeatDaily(e.target.checked)}
              className="mr-2"
            />
            Every day
          </label>
        </div>
      </div>

      <div className="col-span-2">
        <AppSelector
          apps={installedApps}
          onAppSelect={(app) => {
            setWindows((prev) => [
              ...prev,
              { app, position: { x: 0, y: 0, width: 400, height: 300 } },
            ]);
          }}
        />
        <LayoutEditor
          windows={windows}
          onChange={setWindows}
        />
        <input
          type="text"
          value={windows.map((window) => window.app).join(', ') || 'No apps selected'}
          readOnly
          className="w-full p-2 border rounded mb-4"
          placeholder="Selected apps will appear here..."
        />
        {/* URL Input */}
        <div className="mt-6">
        <label className="block mb-2 text-sm font-medium">Add URL:</label>
        <div className="flex space-x-2 mb-2">
            <input
            type="text"
            placeholder="https://example.com"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="w-full p-2 border rounded"
            />
            <button
            onClick={() => {
                if (newUrl.trim()) {
                setUrls([...urls, newUrl.trim()]);
                setNewUrl('');
                }
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded"
            >
            Add
            </button>
        </div>

        {/* Show added URLs */}
        <ul className="text-sm space-y-1">
            {urls.map((url, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span className="truncate max-w-[80%]">{url}</span>
                <button
                onClick={() => {
                    setUrls(urls.filter((_, i) => i !== index));
                }}
                className="text-red-500 text-xs hover:underline"
                >
                Remove
                </button>
            </li>
            ))}
        </ul>
        </div>

      </div>
    </div>
  );
}

type WindowLayout = {
  app: string;
  position: { x: number; y: number; width: number; height: number };
};

type WorkspaceProfile = {
    name: string;
    description?: string; // ✅ Add this
    apps: string[];
    urls: string[];
    windowLayout?: WindowLayout[];
    schedules?: {
      time: string;
      repeatDaily: boolean;
    }[];
  };
  