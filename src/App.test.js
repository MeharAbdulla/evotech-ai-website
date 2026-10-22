import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Aeromek LLC brand", () => {
  render(<App />);
  expect(screen.getAllByText(/Aeromek LLC/i).length).toBeGreaterThan(0);
});
