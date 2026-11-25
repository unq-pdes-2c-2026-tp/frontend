// @ts-check
import { test, expect } from "@playwright/test";

test("Comprar paquete de Puerto Iguazú", async ({ page }) => {
  await page.goto("http://localhost:5173/login");

  // Iniciar sesión con usuario estándar
  await page.getByRole("textbox", { name: "E-mail" }).fill("user@gmail.com");
  await page.getByRole("textbox", { name: "Contraseña" }).fill("user");
  await page.getByRole("button", { name: "Ingresar" }).click();

  // Verificar catálogo de paquetes y abrir el de Puerto Iguazú
  await expect(page.getByRole("heading", { name: "Paquetes" })).toBeVisible();
  await page
    .getByRole("article")
    .filter({ hasText: "Puerto Iguazú te espera" })
    .getByRole("button")
    .click();

  // Confirmar compra del paquete
  await page.getByRole("button", { name: "Comprar paquete" }).click();
  await page.getByRole("button", { name: "Comprar", exact: true }).click();

  // Verificar confirmación y redirección a "Mis compras"
  await expect(page.getByText("Compraste el paquete")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Mis compras" }),
  ).toBeVisible();
});
