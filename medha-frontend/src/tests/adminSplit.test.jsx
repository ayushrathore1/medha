import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AdminDashboard from "../pages/AdminDashboard";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../components/Common/Loader", () => ({
  default: () => <div>Loading admin</div>,
}));

describe("AdminDashboard permission split", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue("test-token");
  });

  it("redirects away when check-admin says the user is not an admin", async () => {
    axios.get.mockResolvedValue({ data: { isAdmin: false } });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

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

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Messages & Feedback")).toBeInTheDocument();
    expect(screen.getByText("Email Console")).toBeInTheDocument();
  });
});
