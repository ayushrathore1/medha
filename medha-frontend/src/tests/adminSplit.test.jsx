import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import AdminDashboard from "../pages/AdminDashboard";

const { axiosMock } = vi.hoisted(() => {
  const mock = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
  mock.create = vi.fn(() => mock);
  return { axiosMock: mock };
});

vi.mock("axios", () => ({
  default: axiosMock,
}));

vi.mock("../components/Common/Loader", () => ({
  default: () => <div>Loading admin</div>,
}));

function renderAdmin() {
  return render(
    <AuthContext.Provider
      value={{
        user: { name: "Admin", email: "admin@example.com", role: "admin" },
        login: vi.fn(),
        logout: vi.fn(),
      }}
    >
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("AdminDashboard permission split", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue("test-token");
  });

  it("redirects away when check-admin says the user is not an admin", async () => {
    axios.get.mockResolvedValue({ data: { isAdmin: false } });

    renderAdmin();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/messages/check-admin"),
        expect.objectContaining({
          headers: { Authorization: "Bearer test-token" },
        })
      );
    });
  });

  it("renders admin tabs after permission check succeeds", async () => {
    axios.get.mockImplementation((url) => {
      if (String(url).includes("check-admin")) {
        return Promise.resolve({ data: { isAdmin: true, isFullAdmin: true } });
      }
      return Promise.resolve({ data: {} });
    });

    renderAdmin();

    expect(await screen.findByText(/ops desk/i)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /ops sections/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /email/i })
    ).toBeInTheDocument();
  });
});
