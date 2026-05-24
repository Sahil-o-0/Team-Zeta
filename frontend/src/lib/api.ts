const API_BASE = "http://localhost:8000/api/v1";

export function getToken() {
  return localStorage.getItem("zeta_token");
}

export function setToken(token: string) {
  localStorage.setItem("zeta_token", token);
}

export function clearToken() {
  localStorage.removeItem("zeta_token");
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    clearToken();
    window.location.reload();
  }
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export const api = {
  login: async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    
    const response = await fetch(`${API_BASE}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Invalid credentials");
    }
    
    const data = await response.json();
    setToken(data.access_token);
    return data;
  },
  
  getTasks: async () => {
    return fetchWithAuth("/tasks");
  },
  
  getEscalations: async () => {
    return fetchWithAuth("/escalations");
  },
  
  resolveEscalation: async (id: number, status: "Approved" | "Dismissed", notes: string = "") => {
    return fetchWithAuth(`/escalations/${id}/resolve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, notes, reviewer_name: "Admin" }),
    });
  },

  getCandidates: async () => {
    return fetchWithAuth("/candidates");
  },

  getAnalyticsROI: async () => {
    return fetchWithAuth("/analytics/roi");
  },

  getEmployees: async () => {
    return fetchWithAuth("/employees");
  },

  getPolicies: async () => {
    return fetchWithAuth("/policies");
  },

  searchPolicies: async (query: string) => {
    return fetchWithAuth(`/policies/semantic-query?query=${encodeURIComponent(query)}`);
  },

  getEmployeeGraph: async (id: number) => {
    return fetchWithAuth(`/employees/${id}/relationship-graph`);
  }
};
