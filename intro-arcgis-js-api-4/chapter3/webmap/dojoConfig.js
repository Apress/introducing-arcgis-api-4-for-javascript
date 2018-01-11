var locationPath = location.pathname.replace(/\/[^\/]+$/, "/");
window.dojoConfig = {
	deps: ["app/main"],
	packages: [
		{
			name: "app",
			location: locationPath + "dist/app"
		}
	]
};