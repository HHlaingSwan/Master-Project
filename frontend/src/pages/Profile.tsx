import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Lock, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/lib/toast";

const Profile: React.FC = () => {
  const { authUser, updateNameAndEmail, changePassword } = useAuthStore();
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const canChangePassword = useMemo(() => {
    if (!authUser?.lastPasswordChange) return true;
    const timeSinceLastChange = Date.now() - new Date(authUser.lastPasswordChange).getTime();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    return timeSinceLastChange >= fortyEightHours;
  }, [authUser?.lastPasswordChange]);

  const passwordHoursRemaining = useMemo(() => {
    if (!authUser?.lastPasswordChange) return 0;
    const timeSinceLastChange = Date.now() - new Date(authUser.lastPasswordChange).getTime();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    const remaining = fortyEightHours - timeSinceLastChange;
    return remaining > 0 ? Math.ceil(remaining / (1000 * 60 * 60)) : 0;
  }, [authUser?.lastPasswordChange]);

  const canUpdateProfile = useMemo(() => {
    if (!authUser?.lastProfileUpdate) return true;
    const timeSinceLastUpdate = Date.now() - new Date(authUser.lastProfileUpdate).getTime();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    return timeSinceLastUpdate >= fortyEightHours;
  }, [authUser?.lastProfileUpdate]);

  const profileHoursRemaining = useMemo(() => {
    if (!authUser?.lastProfileUpdate) return 0;
    const timeSinceLastUpdate = Date.now() - new Date(authUser.lastProfileUpdate).getTime();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    const remaining = fortyEightHours - timeSinceLastUpdate;
    return remaining > 0 ? Math.ceil(remaining / (1000 * 60 * 60)) : 0;
  }, [authUser?.lastProfileUpdate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameAndEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateNameAndEmail(formData);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await changePassword(passwordData);
      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Store
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
              <p className="text-sm text-slate-500">
                Manage your account settings
              </p>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!canUpdateProfile ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800">
                    You can update your profile again in {profileHoursRemaining} hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNameAndEmail} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="name@example.com"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!canChangePassword ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800">
                    You can change your password again in {passwordHoursRemaining} hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
