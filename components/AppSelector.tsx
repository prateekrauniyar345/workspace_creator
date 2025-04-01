'use client';
import { useState } from 'react';

export default function AppSelector({ apps }: { apps: string[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = apps.filter(app =>
    app.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onDragStart = (e: React.DragEvent, app: string) => {
    e.dataTransfer.setData('app', app);
  };

  return (
    <div className="border rounded-lg p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4">Installed Applications</h2>
      <input
        type="text"
        placeholder="Search applications..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      {/* Scrollable Container for Apps */}
      <div
        className="max-h-60 overflow-y-auto border rounded-lg p-2"
        style={{ maxHeight: '15rem' }} // Optional inline style for precise height control
      >
        <div className="flex flex-wrap gap-2">
          {filteredApps.map((app) => (
            <div
              key={app}
              draggable
              onDragStart={(e) => onDragStart(e, app)}
              className="px-3 py-1 bg-gray-200 rounded cursor-move"
            >
              {app}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// 'use client';
// import { useState } from 'react';

// export default function AppSelector({ apps }: { apps: string[] }) {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedApp, setSelectedApp] = useState('');

//   // Filter apps based on the search term
//   const filteredApps = apps.filter((app) =>
//     app.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Handle selection change
//   const handleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedApp(e.target.value);
//   };

//   return (
//     <div className="border rounded-lg p-4 mt-4">
//       <h2 className="text-xl font-semibold mb-4">Installed Applications</h2>

//       {/* Search Input */}

//       {/* Dropdown for Applications */}
//       <div>
//         <label htmlFor="app-dropdown" className="block text-sm font-medium mb-2">
//           Select an Application:
//         </label>
//         <select
//           id="app-dropdown"
//           value={selectedApp}
//           onChange={handleSelection}
//           className="w-full p-2 border rounded"
//         >
//           <option value="">-- Select an Application --</option>
//           {filteredApps.map((app) => (
//             <option key={app} value={app}>
//               {app}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Display Selected Application */}
//       {selectedApp && (
//         <div className="mt-4">
//           <p className="font-semibold">Selected Application:</p>
//           <p>{selectedApp}</p>
//         </div>
//       )}
//     </div>
//   );
// }

