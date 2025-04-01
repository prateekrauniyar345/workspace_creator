'use client';
import ProfilePreviewModal from './ProfilePreviewModal';
import { useState } from 'react';
import type { WorkspaceProfile } from '@/types';


export default function ProfileManager({
  profiles,
  onApply,
  onSave,
  onDelete,
}: {
  profiles: WorkspaceProfile[];
  onApply: (profile: WorkspaceProfile) => void;
  onSave: (profileInfo: { name: string; description?: string }) => void;
  onDelete: (profileName: string) => void;
}) {
  const [newProfileName, setNewProfileName] = useState('');
//   const [newProfileName, setNewProfileName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [previewProfile, setPreviewProfile] = useState<WorkspaceProfile | null>(null);



  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Profiles</h2>

      {/* Display Existing Profiles */}
      <div className="space-y-2 mb-6">
      {profiles.map((profile, i) => (
        <div key={i} className="p-2 border rounded flex justify-between items-center">
            <span
            className="cursor-pointer underline truncate max-w-[50%]"
            onClick={() => setPreviewProfile(profile)}
            >
            {profile.name}
            </span>
            <div className="flex space-x-2">
            <button
                onClick={() => onApply(profile)}
                className="text-blue-500 hover:underline"
            >
                Apply
            </button>
            <button
                onClick={() => onDelete(profile.name)}
                className="text-red-500 hover:underline"
            >
                Delete
            </button>
            </div>
        </div>
        ))}

      </div>

      {previewProfile && (
        <ProfilePreviewModal
            profile={previewProfile}
            onClose={() => setPreviewProfile(null)}
        />
        )}


      {/* Create New Profile */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Profile name"
          value={newProfileName}
          onChange={(e) => setNewProfileName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
            placeholder="Profile description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            rows={2}
        />
        <button
            disabled={!newProfileName.trim()}
            onClick={() => {
                onSave({
                name: newProfileName.trim(),
                description: newDescription.trim(),
                });
                setNewProfileName('');
                setNewDescription('');
            }}
            className={`w-full p-2 rounded text-white ${
                newProfileName.trim() ? 'bg-green-500' : 'bg-gray-400 cursor-not-allowed'
            }`}
            >
            Save Profile
            </button>

      </div>
    </div>
  );
}

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
  