// @ts-check
import { test, expect } from "@playwright/test";

test("Admin login", async ({ page }) => {
  // Registracion unica por si se repite el test para nosotros
  const uniqueEmail = `admin_${Date.now()}@admin.com`;

  await page.goto("http://localhost:5173/login");

  // Ir al formulario de registro
  await page.getByRole("button", { name: "Registrarme" }).click();

  // Completar formulario de registro
  await page.getByTestId("register-name").fill("admin");
  await page.getByTestId("register-email").fill(uniqueEmail);
  await page.getByTestId("register-password").fill("admin");
  await page.locator("#RegisterConfirmPassInput").fill("admin");
  await page
    .locator("#RegisterUserType")
    .selectOption({ label: "Administrador" });
  await page.getByTestId("register-button").click();

  // Completar formulario de login
  await page.locator("#login-email").fill(uniqueEmail);
  await page.locator("#login-password").fill("admin");
  await page.getByRole("button", { name: "Ingresar" }).click();

  // Assert de landing page
  await expect(page).toHaveURL(/.*admin-home/);
});
