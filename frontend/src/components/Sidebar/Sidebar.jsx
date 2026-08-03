import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaChartPie,
  FaBook,
  FaChalkboardTeacher,
  FaComments,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();

  const links = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaChartPie />,
    },
    {
      name: "Modules",
      path: "/admin/modules",
      icon: <FaBook />,
    },
    {
      name: "Lessons",
      path: "/admin/lessons",
      icon: <FaChalkboardTeacher />,
    },
    {
      name: "Expressions",
      path: "/admin/expressions",
      icon: <FaComments />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <FaCog />,
    },
  ];

  async function handleLogout() {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("token");

    Swal.fire({
      icon: "success",
      title: "Logged out",
      text: "You have been logged out successfully.",
      timer: 1500,
      showConfirmButton: false,
    });

    setTimeout(() => {
      navigate("/admin");
    }, 1500);
  }

  return (
    <div className="w-64 min-h-screen bg-slate-800 text-white flex flex-col">

      <div className="text-2xl font-bold p-6 border-b border-slate-700">
        Guru Siap Ngajar
      </div>

      <div className="flex-1 flex flex-col gap-2 p-4">

        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-700"
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}

      </div>

      <div className="p-4 border-t border-slate-700">

        <button
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            bg-red-600
            hover:bg-red-700
            transition
            rounded-lg
            py-3
            font-semibold
          "
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </div>
  );
}