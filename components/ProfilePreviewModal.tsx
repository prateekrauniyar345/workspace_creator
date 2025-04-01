'use client';
import React from 'react';
import type { WorkspaceProfile } from '@/types';


type ProfilePreviewModalProps = {
  profile: WorkspaceProfile;
  onClose: () => void;
};

export default function ProfilePreviewModal({ profile, onClose }: ProfilePreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-2">{profile.name}</h2>
        {profile.description && (
          <p className="mb-4 text-gray-700">{profile.description}</p>
        )}
        <div className="mb-4">
          <h3 className="font-semibold">Apps:</h3>
          <ul className="list-disc ml-5">
            {profile.apps.map((app, i) => <li key={i}>{app}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">URLs:</h3>
          <ul className="list-disc ml-5">
            {profile.urls.map((url, i) => <li key={i}>{url}</li>)}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
