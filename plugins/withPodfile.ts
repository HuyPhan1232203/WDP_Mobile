const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const withPodfile = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      let podfileContents = fs.readFileSync(podfilePath, "utf-8");

      // Thêm modular headers cho Firebase
      const modularHeadersFix = `
  # Fix for Firebase modular headers
  pod 'GoogleUtilities', :modular_headers => true
  pod 'FirebaseCore', :modular_headers => true
  pod 'FirebaseCoreInternal', :modular_headers => true
  pod 'FirebaseAuth', :modular_headers => true
  pod 'FirebaseAuthInterop', :modular_headers => true
  pod 'FirebaseAppCheckInterop', :modular_headers => true
  pod 'FirebaseCoreExtension', :modular_headers => true
  pod 'RecaptchaInterop', :modular_headers => true
`;

      // Tìm vị trí để chèn code (sau dòng use_expo_modules!)
      const useExpoModulesRegex = /use_expo_modules!/;

      if (!podfileContents.includes("Fix for Firebase modular headers")) {
        podfileContents = podfileContents.replace(
          useExpoModulesRegex,
          `use_expo_modules!\n${modularHeadersFix}`
        );
        fs.writeFileSync(podfilePath, podfileContents);
      }

      return config;
    },
  ]);
};

module.exports = withPodfile;
