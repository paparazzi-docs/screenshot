# @paparazzi-docs/screenshot

Paparazzi Docs keeps your software docs up-to-date, automating screenshot updates and transforming documentation maintenance from a chore to a breeze!
Automating the process of updating guides or documentation with new screenshots can significantly improve efficiency and reduce the likelihood of errors.

# Let's start!

Paparazzi docs has been tested to work with E2E tests tools that allow automatic screenshots such as Cypress.
If you need assistance with implementation, please do not hesitate to contact us at [connect@paparazzidocs.com](mailto:connect@paparazzidocs.com).

# Cypress Implementation

## Install the package

You can find the package here: [https://www.npmjs.com/package/@paparazzi-docs/screenshot](https://www.npmjs.com/package/@paparazzi-docs/screenshot)

Add the package in your project:&#x20;

```bash
npm i @paparazzi-docs/screenshot
```

## Cypress.config.ts

Configure Cypress to upload every screenshot taken with *cy.screenshot().*

Use the following code snippet to implement Paparazzi Docs in Cypress.
Cypress config file *cypress.config.ts* is usually located in the root folder.

```ts
// cypress.config.ts

import PaparazziDocs from "@paparazzi-docs/screenshot";
import { defineConfig } from "cypress";
import { loadEnvConfig } from "@next/env";

// Retireve env variables
const { combinedEnv } = loadEnvConfig(process.cwd());

export default defineConfig({
  env: {
    paparazzidocs_api_key: combinedEnv.PAPARAZZIDOCS_API_KEY, // Api Key you just created
    paparazzidocs_project_id: combinedEnv.PAPARAZZIDOCS_PROJECT_ID, // Id of the project you just created
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      on("after:screenshot", (details) => {
        /*
         * This function is called when a screenshot is taken.
         * It uploads the screenshot to PaparazziDocs.
         */
        const apiKey = config.env.paparazzidocs_api_key;
        const project_id = config.env.paparazzidocs_project_id;

        const { path, name } = details; // Cypress path and name of the screenshot

        // Initialize Paparazzi Docs SDK
        const paparazzidocsConfig = {
          apiKey,
          project_id,
        };
        const paparazzi = new PaparazziDocs(paparazzidocsConfig);

        // Read Cypress screenshot
        fs.readFile(path, (err, data) => {
          if (err) throw new Error("Error reading screenshot file", err);
          // Upload Cypress screenshot to Paparazzi Docs cloud
          paparazzi
            .uploadScreenshot(data, name, {})
            .then((res) => {
              console.log("[Paparazzi Docs] Screenshot uploaded:", name);
            })
            .catch((err) => {
              console.error("[Paparazzi Docs] Error uploading screenshot:", err);
              throw new Error("Error uploading screenshot:", err);
            });
        });
      });
    },
  },
});

```

## E2E Test File

In the example below, the test case, named "should navigate primary pages" performs the following actions:

1. Navigates to the "/documents" page of the application using *cy.visit().*
2. Waits for an element with the data attribute *data-cy="async-data-title"* to become visible, ensuring the page has loaded properly.
3. Takes a screenshot of the page and saves it with the name "documents". This screenshot is automatically uploaded to a cloud storage thanks to configuration settings specified in the *cypress.config.ts* file and our npm package.

```ts
// cypress/e2e/app.cy.ts
describe("Test Navigation", function () {
  it("should navigate primary pages", () => {
    // Visit page
    cy.visit("/documents");
    // Wait page to load -> you want to wait until some elements are visible in your page before taking the screenshot
    cy.get('[data-cy="async-data-title"]').should("be.visible"); 
    // Take the screenshot -> this is enought to upload the screenshot to our Cloud, thanks to our npm package and configuration in cypress.config.ts
    cy.screenshot("documents");
  });
  /* other test cases */
});

// Prevent TypeScript from reading file as legacy script
export {};
```

## Upload screenshots

Every time your E2E tests are executed all the defined screenshots for your project will be taken and uploaded to Paparazzi Docs cloud.
All the documents and guides that contain a screenshot will display the updated version of it.

# Conclusions

We are delighted to have you onboard with Paparazzi Docs for your documentation needs.&#x20;
If you require any assistance or have questions, please don't hesitate to contact us at [connect@paparazzidocs.com]().&#x20;
We're here to help and ensure your experience with our services is seamless and satisfactory.
