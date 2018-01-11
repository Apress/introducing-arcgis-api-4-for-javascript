var locationPath = location.pathname.replace(/\/[^\/]+$/, "/");
window.dojoConfig = {
	has: {
		"esri-promise-compatibility": 1
	},
	deps: ["app/main"],
	packages: [
		{
			name: "app",
			location: locationPath + "dist/app"
		}
	]
};