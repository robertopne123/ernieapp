import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.ernie.london",
  appName: "ernieapp",
  webDir: "out",
  server: {
    androidScheme: "https",
    iosScheme: "https",
  },
};

export default config;
