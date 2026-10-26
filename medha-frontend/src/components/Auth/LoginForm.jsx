import React from "react";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Alert, AlertDescription } from "@/components/UI/alert";
import { Button } from "@/components/UI/button";
import { cn } from "@/lib/utils";

const LoginForm = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
          <AlertDescription className="text-sm font-bold text-center">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-sm font-bold text-foreground/70">
          Email Address
        </Label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@university.edu"
          required
          className="h-12 rounded-xl bg-muted/50 border-border text-foreground placeholder:text-muted-foreground font-medium focus-visible:ring-primary/20 focus-visible:border-primary hover:border-primary/50 transition-all"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-sm font-bold text-foreground/70">
          Password
        </Label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
          className="h-12 rounded-xl bg-muted/50 border-border text-foreground placeholder:text-muted-foreground font-medium focus-visible:ring-primary/20 focus-visible:border-primary hover:border-primary/50 transition-all"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full h-12 font-bold text-base shadow-xl shadow-primary/20 cursor-pointer"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
