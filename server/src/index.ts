import "dotenv/config";

import Application from "./application";

export const app = new Application();

(async () => {
  await app.init();
})();
