import { useState } from "react";
import { supabase } from "../lib/supabase";

type Mode = "login" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("サインアップ完了。メール確認が必要な設定の場合は受信箱を確認してください。");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage("ログイン成功。");
      }
    } catch (err: any) {
      setMessage(err?.message ?? "認証に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h1 className="text-xl font-semibold mb-4">TaskBoard</h1>

      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-2 rounded-lg text-sm border ${
            mode === "login" ? "bg-slate-800 border-slate-700" : "border-slate-800"
          }`}
          onClick={() => setMode("login")}
          type="button"
        >
          ログイン
        </button>
        <button
          className={`px-3 py-2 rounded-lg text-sm border ${
            mode === "signup" ? "bg-slate-800 border-slate-700" : "border-slate-800"
          }`}
          onClick={() => setMode("signup")}
          type="button"
        >
          サインアップ
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-slate-300">Email</label>
          <input
            className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Password</label>
          <input
            className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </div>

        <button
          className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
          disabled={loading || !email || !password}
        >
          {loading ? "処理中..." : mode === "signup" ? "サインアップ" : "ログイン"}
        </button>

        {message && <p className="text-sm text-slate-300">{message}</p>}
      </form>
    </div>
  );
}
