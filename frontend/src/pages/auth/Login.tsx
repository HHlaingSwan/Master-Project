import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import axiosInstance from "@/api";

const Login: React.FC = () => {
  const { isAuthenticated, login, isLoading, error, initializeAuth } =
    useAuthStore();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (localError) setLocalError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setLocalError("Please fill in all fields");
      return;
    }

    setLocalError("");

    try {
      await login(credentials);
    } catch {
      setLocalError(error || "Login failed. Please check your credentials.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");
    setForgotSuccess(false);

    if (!forgotEmail) {
      setForgotError("Please enter your email address");
      return;
    }

    setForgotLoading(true);
    try {
      await axiosInstance.post("/forgot-password", { email: forgotEmail });
      setForgotSuccess(true);
      setForgotMessage(
        "If an account exists with this email, a password reset link will be sent."
      );
    } catch (err: any) {
      setForgotError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const openForgotDialog = () => {
    setForgotEmail(credentials.email);
    setIsForgotOpen(true);
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 px-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <LogIn className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-base">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleLogin} className="space-y-4">
            {displayError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {displayError}
              </div>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="pl-10 h-11 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="pl-10 h-11 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={openForgotDialog}
                className="text-sm text-primary hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
          </form>
          <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
            <DialogTrigger asChild>
              <span />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Reset Password
                </DialogTitle>
                <DialogDescription>
                  Enter your email address and we'll send you a link to reset
                  your password.
                </DialogDescription>
              </DialogHeader>
              {forgotSuccess ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Check Your Email
                  </h3>
                  <p className="text-slate-600 text-sm">{forgotMessage}</p>
                  <Button
                    className="mt-6"
                    onClick={() => {
                      setIsForgotOpen(false);
                      setForgotSuccess(false);
                      setForgotMessage("");
                    }}
                  >
                    Back to Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {forgotError && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {forgotError}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label
                      htmlFor="forgot-email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="forgot-email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="pl-10 h-11 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsForgotOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={forgotLoading}
                    >
                      {forgotLoading ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Link
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pt-2">
          <Button
            className="w-full h-11 font-medium"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
          <p className="text-sm text-slate-600 text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
