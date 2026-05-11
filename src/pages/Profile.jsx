import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import api from "../api/axios";
import {
  User,
  Mail,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("profile");

  // Change‑password form state
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChanging, setIsChanging] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Password change handler ──────────────────────────────────────────
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordErrors({});

    // Client‑side validation
    const errs = {};
    if (!passwordForm.old_password) errs.old_password = "Current password is required";
    if (!passwordForm.new_password) errs.new_password = "New password is required";
    else if (passwordForm.new_password.length < 4)
      errs.new_password = "Password must be at least 4 characters";
    if (!passwordForm.confirm_password)
      errs.confirm_password = "Please confirm your new password";
    else if (passwordForm.new_password !== passwordForm.confirm_password)
      errs.confirm_password = "Passwords do not match";

    if (Object.keys(errs).length) {
      setPasswordErrors(errs);
      return;
    }

    setIsChanging(true);
    try {
      await api.post("auth/change-password/", {
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
        confirm_password: passwordForm.confirm_password,
      });
      showToast("Password changed successfully!", "success");
      setPasswordForm({ old_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      const data = error.response?.data;
      if (data) {
        // Backend may return field‑level errors
        const backendErrors = {};
        if (data.old_password) backendErrors.old_password = Array.isArray(data.old_password) ? data.old_password[0] : data.old_password;
        if (data.new_password) backendErrors.new_password = Array.isArray(data.new_password) ? data.new_password[0] : data.new_password;
        if (data.confirm_password) backendErrors.confirm_password = Array.isArray(data.confirm_password) ? data.confirm_password[0] : data.confirm_password;
        if (data.detail) backendErrors.old_password = data.detail;
        if (data.error) backendErrors.old_password = data.error;

        if (Object.keys(backendErrors).length) {
          setPasswordErrors(backendErrors);
        } else {
          showToast("Failed to change password.", "error");
        }
      } else {
        showToast("Something went wrong. Please try again.", "error");
      }
    } finally {
      setIsChanging(false);
    }
  };

  // ── Helper: initials avatar ──────────────────────────────────────────
  const initials = (user?.name || user?.username || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ── Tabs ─────────────────────────────────────────────────────────────
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-500 mt-1">
            Manage your profile and account settings
          </p>
        </div>

        {/* User banner */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-600/20">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.name || user?.username || "User"}
              </h2>
              <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                {user?.email}
              </p>
            </div>
          </div>
        </Card>

        {/* Tab bar */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Profile Tab ─────────────────────────────────────────────── */}
        {activeTab === "profile" && (
          <Card className="p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                <User className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Profile Information
              </h3>
            </div>

            <div className="space-y-5">
              {/* ID */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium text-gray-900 mt-0.5">
                    #{user?.id}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                  <Check className="w-3 h-3" />
                  Verified
                </span>
              </div>

              {/* Name */}
              <div className="py-3 border-b border-gray-100">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900 mt-0.5">
                  {user?.name || user?.username || "—"}
                </p>
              </div>

              {/* Email */}
              <div className="py-3">
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900 mt-0.5">
                  {user?.email || "—"}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* ── Security Tab ────────────────────────────────────────────── */}
        {activeTab === "security" && (
          <Card className="p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                <KeyRound className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Change Password
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Update your password to keep your account secure
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-5">
              {/* Old password */}
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showOld ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={passwordForm.old_password}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      old_password: e.target.value,
                    }))
                  }
                  error={passwordErrors.old_password}
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showOld ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>

              <div className="border-t border-gray-100" />

              {/* New password */}
              <div className="relative">
                <Input
                  label="New Password"
                  type={showNew ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={passwordForm.new_password}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      new_password: e.target.value,
                    }))
                  }
                  error={passwordErrors.new_password}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNew ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>

              {/* Confirm password */}
              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  value={passwordForm.confirm_password}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirm_password: e.target.value,
                    }))
                  }
                  error={passwordErrors.confirm_password}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full py-3 text-base"
                  isLoading={isChanging}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
