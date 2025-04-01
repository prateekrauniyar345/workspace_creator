import { exec } from 'child_process';
import { promisify } from 'util';
import type { NextApiRequest, NextApiResponse } from 'next';

const execPromise = promisify(exec);

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch installed applications using macOS Spotlight
    const { stdout } = await execPromise('mdfind \'kMDItemKind == "Application"\'');
    
    // Parse the output into an array of application paths
    const apps = stdout
      .split('\n') // Split by newline
      .filter(Boolean) // Remove empty lines
      .map(appPath => appPath.split('/').pop()?.replace('.app', '') || '') // Extract app names
      .filter(appName => appName.trim() !== ''); // Remove any empty or invalid app names

    // Use a Set to remove duplicates
    const uniqueApps = Array.from(new Set(apps));

    // Return the list of unique apps as JSON
    return new Response(JSON.stringify(uniqueApps), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching installed apps:', (error as Error).message);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch installed applications' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}