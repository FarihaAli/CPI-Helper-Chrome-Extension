var plugin = {
    metadataVersion: "1.0.0",
    id: "unlock",
    name: "Unlock Artifact",
    version: "1.0.0",
    author: "Gregor Schütz, AGILITA AG",
    website: "https://www.agilita.ch/",
    email: "gregor.schuetz@agilita.ch",
    description: "Adds an unlock button to the message sidebar.",
    settings: {
        "icon": { "type": "icon", "src": "/images/plugin_logos/AGILITAAG_Logo.jpg" }
    },
    messageSidebarContent: {
        "static": true,
        "onRender": (pluginHelper) => {
            //prepare button
            var div = document.createElement("div");
            var button = document.createElement("button");
            button.innerHTML = "unlock";

            //removes or rather deletes the lock on this artifact
            button.onclick = async (x) => {
                //prepare unlock
                const urlForResourceId = `/${pluginHelper.urlExtension}odata/api/v1/IntegrationDesigntimeLocks?$format=json`;
                var dataOfDesigntimeLocks = JSON.parse(await makeCallPromise("GET", urlForResourceId, false)).d.results;
                
                var resourceId = dataOfDesigntimeLocks.find(function (a){
                    return a.ArtifactId === pluginHelper.currentArtifactId
                })?.ResourceId;
                
                //unlock artifact if locked
                if(resourceId != undefined){ //undefined means it's not locked
                    location.reload(); //refresh is need because of issues when switching from one CPI tenant to another
                    var urlForUnlock = `/${pluginHelper.urlExtension}odata/api/v1/IntegrationDesigntimeLocks(ResourceId='${resourceId}')`;
                    await makeCallPromise("DELETE", urlForUnlock, false);
                }
            }

            //adds button
            div.appendChild(button)
            return div;
        }
    }
};

pluginList.push(plugin);