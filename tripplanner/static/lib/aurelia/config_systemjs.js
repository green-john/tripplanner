System.config({
  transpiler: "plugin-babel",
  devConfig: {
    "map": {
      "plugin-babel": "babel:systemjs-plugin-babel@0.0.12"
    }
  },
  paths: {
    "babel:": "/static/lib/aurelia/babel/"
  },
  packageConfigPaths: [
    "babel:@*/*.json",
    "babel:*.json"
  ],
  packages: {
    "static/js": {
      defaultJSExtensions: true,
      defaultExtension: "js"
    }
  }
});
