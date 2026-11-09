import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../AuthContext";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

describe("Production smoke", () => {
  it("renders the public coming-soon home", async () => {
    const ComingSoon = (await import("../pages/ComingSoon")).default;
    render(
      <AuthContext.Provider value={{ user: null, login: vi.fn(), logout: vi.fn() }}>
        <MemoryRouter>
          <ComingSoon />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByRole("heading", { name: /coming soon/i })).toBeInTheDocument();
    expect(screen.getByText(/medha got a new home/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up on medha/i })).toHaveAttribute(
      "href",
      "/register"
    );
    expect(screen.getByRole("link", { name: /medha revision home/i })).toHaveAttribute(
      "href",
      "/"
    );
    expect(
      screen.getByRole("link", { name: "www.shopcampuskart.in" })
    ).toHaveAttribute("href", "https://www.shopcampuskart.in");
  });

  it("renders the signed-in coming-soon experience", async () => {
    const MemberComingSoon = (await import("../pages/MemberComingSoon")).default;
    render(
      <AuthContext.Provider
        value={{
          user: { name: "Ayush Rathore", email: "ayush@example.com" },
          login: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <MemoryRouter>
          <MemberComingSoon />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByRole("heading", { name: /your seat is saved/i })).toBeInTheDocument();
    expect(screen.getByText(/welcome in, ayush/i)).toBeInTheDocument();
  });
});
