import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.ernie.london",
  appName: "Ernie London",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
