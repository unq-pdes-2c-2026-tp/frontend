// @ts-check
import { test, expect } from "@playwright/test";

test("Crear paquete con hotel y vuelos en Puerto Iguazú", async ({ page }) => {
  await page.goto("http://localhost:5173/login");

  // Iniciar sesión con cuenta de agencia
  await page.getByRole("textbox", { name: "E-mail" }).fill("agency@gmail.com");
  await page.getByRole("textbox", { name: "Contraseña" }).fill("agency");
  await page.getByRole("button", { name: "Ingresar" }).click();

  // Navegar a la creación de paquetes y completar datos básicos
  await page.getByRole("link", { name: "Crear paquete" }).click();
  await page.getByRole("textbox", { name: "Nombre" }).fill("Paquete de prueba");

  // Seleccionar el primer hotel que contenga "Iguazú"
  const hotelSelect = page.getByLabel("Hotel");
  const iguazuHotelValue = await hotelSelect
    .locator("option", { hasText: /Iguazú/i })
    .first()
    .getAttribute("value");
  expect(iguazuHotelValue, "No se encontró un hotel con 'Iguazú'").toBeTruthy();
  await hotelSelect.selectOption(iguazuHotelValue);

  // Completar precio y rango de fechas amplio (2010 - 2030)
  await page.getByRole("textbox", { name: "Precio" }).fill("1000000,00");
  await page.getByRole("textbox", { name: "Desde" }).fill("2010-01-01");
  await page.getByRole("textbox", { name: "Hasta" }).fill("2030-12-31");
  await page.getByRole("button", { name: "Buscar" }).click();

  // Seleccionar vuelo de ida: "Buenos Aires - Puerto Iguazú"
  const outboundFlightSelect = page.getByLabel("Vuelo de ida");
  const outboundFlightValue = await outboundFlightSelect
    .locator("option", { hasText: /Buenos Aires\s*-\s*Puerto Iguazú/i })
    .first()
    .getAttribute("value");
  expect(
    outboundFlightValue,
    "No se encontró vuelo de ida 'Buenos Aires - Puerto Iguazú'",
  ).toBeTruthy();
  await outboundFlightSelect.selectOption(outboundFlightValue);

  // Seleccionar vuelo de vuelta: "Puerto Iguazú - Buenos Aires"
  const returnFlightSelect = page.getByLabel("Vuelo de vuelta");
  const returnFlightValue = await returnFlightSelect
    .locator("option", { hasText: /Puerto Iguazú\s*-\s*Buenos Aires/i })
    .first()
    .getAttribute("value");
  expect(
    returnFlightValue,
    "No se encontró vuelo de vuelta 'Puerto Iguazú - Buenos Aires'",
  ).toBeTruthy();
  await returnFlightSelect.selectOption(returnFlightValue);

  // Enviar formulario y verificar confirmación
  await page.getByRole("button", { name: "Crear paquete" }).click();
  await expect(page.getByText("Paquete creado correctamente")).toBeVisible();
});
