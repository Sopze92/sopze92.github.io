function syncDelay(milliseconds)
{
  var start = new Date().getTime();
  var end=0;
  while( (end-start) < milliseconds)
  {
    end = new Date().getTime();
  }
}

var uInstance;

var buildUrl = "Build";
var loaderUrl = buildUrl + "/build_webgl.loader.js";
var config = 
{
  dataUrl: buildUrl + "/build_webgl.data",
  frameworkUrl: buildUrl + "/build_webgl.framework.js",
  codeUrl: buildUrl + "/build_webgl.wasm",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "Sergio Sopze",
  productName: "JessCreationMugPreview",
  productVersion: "1.0",
};

var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) 
{
  container.className = "unity-mobile";
  config.devicePixelRatio = 1;
}
else
{
  canvas.style.width = "1280px";
  canvas.style.height = "900px";
}

var script = document.createElement("script");

script.src = loaderUrl;
script.onload = () => 
{
  createUnityInstance(canvas, config, null).then((unityInstance) => 
  { 
	uInstance= unityInstance;
	  
    container.addEventListener('dragover', (event) =>
	{
      event.preventDefault();
    });
	
    container.addEventListener('drop', (event) =>
	{
      event.preventDefault();
	  
      const file = event.dataTransfer.file[0];
	  
      unityInstance.SendMessage("JessApp_MugPreview", "FileReceived", window.URL.createObjectURL(file), file);
    });

	//canvas.style.opacity = "0.0";
	
	//syncDelay(6000);
	
	//canvas.style.opacity = "1.0";
	
  }).catch((message) => 
  {
    alert(message);
  });
};

document.body.appendChild(script);