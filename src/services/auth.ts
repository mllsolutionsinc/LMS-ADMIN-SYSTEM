
//auth.ts

export async function loginAdmin(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  // if backend returns error (401, 500, etc.)
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.message || "Login failed");
  }

  return res.json(); // returns { token, admin }
}
