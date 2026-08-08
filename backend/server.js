import { app, PORT } from "./app.js";
import { hasCredentials } from "./config/firebaseadmin.js";

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  if (!hasCredentials) {
    console.warn("⚠  Firebase admin not configured — auth endpoints disabled");
  }
});
