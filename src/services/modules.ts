export async function fetchModules() {
  const token = sessionStorage.getItem("token");

  const res = await fetch("/api/modules", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch modules");
  }

  return res.json(); // modules array
}

export async function createModule(moduleData: {
  code: string;
  name: string;
  description?: string;
}) {
  const token = sessionStorage.getItem("token");

  const res = await fetch("/api/modules", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(moduleData),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.message || "Failed to create module");
  }

  return res.json();
}

export async function deleteModule(module_id: number) {
  const token = sessionStorage.getItem("token");

  const res = await fetch(`/api/modules/${module_id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete module");
  }

  return res.json();
}
