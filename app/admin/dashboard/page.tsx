import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background text-white">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-surface-border p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm">Total Memories</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-surface border border-surface-border p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm">Photo Albums</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-surface border border-surface-border p-6 rounded-xl">
            <h3 className="text-gray-400 text-sm">Unread Messages</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>
      </main>
    </div>
  );
}
