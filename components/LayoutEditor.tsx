'use client';
import { useEffect, useRef } from 'react';

export default function LayoutEditor({ windows, onChange }: {
  windows: WindowLayout[];
  onChange: (layouts: WindowLayout[]) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent, app: string) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onChange([
      ...windows,
      {
        app,
        position: {
          x: (x / rect.width) * 100, // Percentage
          y: (y / rect.height) * 100,
          width: 30, // Default size
          height: 30
        }
      }
    ]);
  };

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Window Layout</h2>
      <div
        ref={canvasRef}
        className="w-full h-96 bg-gray-100 relative rounded"
        onDrop={(e) => handleDrop(e, e.dataTransfer.getData('app'))}
        onDragOver={(e) => e.preventDefault()}
      >
        {windows.map((win, i) => (
          <div
            key={i}
            className="absolute border-2 border-blue-500 bg-blue-100 p-2"
            style={{
              left: `${win.position.x}%`,
              top: `${win.position.y}%`,
              width: `${win.position.width}%`,
              height: `${win.position.height}%`
            }}
          >
            {win.app}
            <button
              onClick={() => onChange(windows.filter((_, idx) => idx !== i))}
              className="absolute top-0 right-0 text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}