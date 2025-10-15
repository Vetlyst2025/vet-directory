'use client';

export default function SetupInstructions() {
  const sql = `-- Create appointment_requests table
CREATE TABLE IF NOT EXISTS appointment_requests (
  id SERIAL PRIMARY KEY,
  clinic_id INTEGER,
  clinic_name TEXT,
  clinic_email TEXT,
  pet_owner_name TEXT NOT NULL,
  pet_owner_email TEXT NOT NULL,
  pet_owner_phone TEXT NOT NULL,
  pet_name TEXT,
  pet_type TEXT,
  preferred_date TEXT,
  preferred_time TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add columns to clinics_madison_wi table
ALTER TABLE clinics_madison_wi 
ADD COLUMN IF NOT EXISTS accepts_appointments BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Update first 5 clinics to accept appointments (for demo/testing)
UPDATE clinics_madison_wi 
SET accepts_appointments = true, is_featured = true 
WHERE id IN (1, 2, 3, 4, 5);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sql);
    alert('SQL copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Supabase Database Setup</h1>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">📋 Instructions:</h2>
              <ol className="list-decimal list-inside space-y-2 text-slate-700">
                <li>Go to your <a href="https://supabase.com/dashboard/project/qklnxfkwjpdboqawxpts/editor" target="_blank" className="text-blue-600 hover:underline">Supabase SQL Editor</a></li>
                <li>Click &quot;SQL Editor&quot; in the left sidebar</li>
                <li>Click &quot;New Query&quot;</li>
                <li>Copy the SQL below and paste it into the editor</li>
                <li>Click &quot;Run&quot; or press Ctrl+Enter</li>
              </ol>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">SQL to Run:</h2>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📋 Copy SQL
                </button>
              </div>
              
              <pre className="bg-slate-900 text-slate-100 p-6 rounded-lg overflow-x-auto text-sm">
                <code>{sql}</code>
              </pre>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">✅ What this does:</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li><strong>Creates appointment_requests table</strong> - Stores all appointment requests from pet owners</li>
                <li><strong>Adds accepts_appointments column</strong> - Marks which clinics accept online requests</li>
                <li><strong>Adds is_featured column</strong> - Marks premium/featured listings</li>
                <li><strong>Updates 5 clinics</strong> - Sets them as featured for testing</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">🎉 After running the SQL:</h2>
              <p className="text-slate-700 mb-2">Your website will automatically show:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>✨ &quot;Featured&quot; badges on the first 5 clinics</li>
                <li>🎯 &quot;Accepts Requests&quot; badges</li>
                <li>&quot;Request Appointment&quot; buttons on those clinics</li>
                <li>Working appointment request form</li>
              </ul>
            </div>

            <div className="text-center pt-4">
              <a 
                href="/"
                className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                ← Back to Directory
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
