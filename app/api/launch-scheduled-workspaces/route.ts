import { NextResponse } from 'next/server';

export async function GET() {
  const stored = localStorage.getItem('workspace-profiles');
  if (!stored) return NextResponse.json({ message: "No profiles found" });

  const profiles = JSON.parse(stored);
  const now = new Date();
  const nowHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  for (const profile of profiles) {
    for (const sched of profile.schedules || []) {
      if (sched.time === nowHHMM) {
        // Trigger the profile launch logic here
        console.log(`⏰ Launching scheduled profile: ${profile.name}`);
        // Ideally: applyProfile(profile) or some dispatch to the pipe.operator
      }
    }
  }

  return NextResponse.json({ message: "Checked scheduled tasks" });
}
