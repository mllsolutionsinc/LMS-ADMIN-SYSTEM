export interface TutorData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function registerTutor(data: TutorData) {
  const token = sessionStorage.getItem("token");

  const res = await fetch("/api/tutors/register", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.message || "Failed to register tutor");
  }

  return res.json();
}

export async function fetchTutors() {
  const token = sessionStorage.getItem("token");
  
  const res = await fetch("/api/tutors", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tutors");
  }

  return res.json();
}