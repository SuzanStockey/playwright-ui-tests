import { test, expect } from "@playwright/test";

// Selectors for TodoMVC
const newTodo = 'input.new-todo, input[placeholder="What needs to be done?"]';
const todoItems = ".todo-list li";
const toggleAll = 'label[for="toggle-all"]';
const clearCompleted = "button.clear-completed";

test.beforeEach(async ({ page }) => {
  await page.goto("/todomvc/#/");
  await expect(page.locator(newTodo)).toBeVisible();
});

test("should add a new task", async ({ page }) => {
  await page.locator(newTodo).fill("Buy milk");
  await page.keyboard.press("Enter");

  const items = page.locator(todoItems);
  await expect(items).toHaveCount(1);
  await expect(items.nth(0)).toContainText("Buy milk");
});

test("should delete a task", async ({ page }) => {
  // add two tasks
  for (const t of ["Task A", "Task B"]) {
    await page.locator(newTodo).fill(t);
    await page.keyboard.press("Enter");
  }
  const items = page.locator(todoItems);
  await expect(items).toHaveCount(2);

  // delete the first task (destroy button appears on hover)
  const first = items.nth(0);
  await first.hover();
  await first.locator("button.destroy").click();

  await expect(items).toHaveCount(1);
  await expect(items.nth(0)).toContainText("Task B");
});

test("should not allow adding empty task", async ({ page }) => {
  const items = page.locator(todoItems);
  const before = await items.count();

  await page.locator(newTodo).fill("   ");
  await page.keyboard.press("Enter");

  await expect(items).toHaveCount(before);
});

test("should persist tasks after reload", async ({ page }) => {
  await page.locator(newTodo).fill("Persist me");
  await page.keyboard.press("Enter");

  // mark as completed
  const first = page.locator(todoItems).nth(0);
  await first.locator("input.toggle").check();

  // reload page
  await page.reload();

  const items = page.locator(todoItems);
  await expect(items).toHaveCount(1);
  await expect(items.nth(0)).toContainText("Persist me");
  await expect(items.nth(0)).toHaveClass(/completed/);
});

test("should toggle all and clear completed tasks", async ({ page }) => {
  for (const t of ["One", "Two", "Three"]) {
    await page.locator(newTodo).fill(t);
    await page.keyboard.press("Enter");
  }
  // mark all as completed
  await page.locator(toggleAll).click();
  await expect(page.locator(`${todoItems}.completed`)).toHaveCount(3);

  // clear completed
  await page.locator(clearCompleted).click();
  await expect(page.locator(todoItems)).toHaveCount(0);
});
