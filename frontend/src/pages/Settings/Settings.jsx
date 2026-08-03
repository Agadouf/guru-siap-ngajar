import { useState } from "react";
import toast from "react-hot-toast";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import AdminLayout from "../../components/Layout/AdminLayout";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { changePassword } from "../../services/auth.service";

export default function Settings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.currentPassword ||
      !form.newPassword ||
      !form.confirmPassword
    ) {
      return toast.error("All fields are required.");
    }

    if (form.newPassword.length < 8) {
      return toast.error(
        "Password must be at least 8 characters."
      );
    }

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      const res = await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      toast.success(res.message);

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>

      <div className="max-w-xl mx-auto">

        <Card>

          <div className="flex items-center gap-3 mb-8">
            <FaLock className="text-blue-600 text-3xl" />

            <h1 className="text-3xl font-bold">
              Change Password
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Current Password */}

            <div>

              <label className="block mb-2 font-semibold">
                Current Password
              </label>

              <div className="relative">

                <input
                  type={showCurrent ? "text" : "password"}
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrent(!showCurrent)
                  }
                  className="absolute right-4 top-4"
                >
                  {showCurrent ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* New Password */}

            <div>

              <label className="block mb-2 font-semibold">
                New Password
              </label>

              <div className="relative">

                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-4"
                >
                  {showNew ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* Confirm Password */}

            <div>

              <label className="block mb-2 font-semibold">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                  className="absolute right-4 top-4"
                >
                  {showConfirm ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </Button>

          </form>

        </Card>

      </div>

    </AdminLayout>
  );
}