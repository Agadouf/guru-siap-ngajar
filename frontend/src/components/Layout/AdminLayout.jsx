import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-100">

        <Navbar />

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}