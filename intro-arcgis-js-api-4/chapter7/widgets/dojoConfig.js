var locationPath = location.pathname.replace(/\/[^\/]+$/, "");
window.dojoConfig = {
  packages: [
    {
      name: "app",
      location: locationPath + "app"
    }
  ]
};