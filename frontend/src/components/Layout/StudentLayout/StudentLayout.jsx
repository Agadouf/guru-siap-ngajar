import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";

export default function StudentLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {children}
      </main>

      <Footer />

    </div>
  );
}