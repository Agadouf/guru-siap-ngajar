import Sidebar from "../Sidebar/Sidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-100">

        <AdminNavbar />

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}