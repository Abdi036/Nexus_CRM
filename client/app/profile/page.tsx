"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User as UserIcon, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarUrl(user.avatarUrl ?? "");
    }
  }, [isAuthenticated, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateProfile({
      name,
      password: password || undefined,
      avatarUrl: avatarUrl || undefined,
    });

    if (!result.success) {
      toast({
        title: "Update failed",
        description: result.message ?? "Could not update your profile",
        variant: "destructive",
      });
      return;
    }

    setPassword("");
    toast({
      title: "Profile updated",
      description: "Your changes have been saved",
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl border-white/15 bg-white/5 text-white shadow-2xl shadow-emerald-500/10">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() => router.push("/dashboard")}
            >
              Back to dashboard
            </Button>
          </div>
          <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/10 text-white shadow-md shadow-emerald-500/20">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Profile avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="h-10 w-10" />
            )}
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <label className="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white shadow-sm shadow-emerald-500/10 transition hover:bg-white/15">
              <Upload className="h-4 w-4" />
              <span>Upload photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
            {avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setAvatarUrl("")}
              >
                Remove
              </Button>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="Leave blank to keep current password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Role</span>
                <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] uppercase tracking-wide">
                  {user.role.replace("_", " ")}
                </span>
              </div>
              <p className="text-white/80">
                Contact an admin to change your role.
              </p>
            </div>

            <Button type="submit" className="w-full">
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
