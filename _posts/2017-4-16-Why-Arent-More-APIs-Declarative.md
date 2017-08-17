Ever since re-writing the frontend of a webapp at work, I have been completely bowled over by what the combination of a declarative UI (provided by React) in combination with a purely functional state management solution (Redux) can provide you with.

This has started me thinking on why more APIs aren't declarative.

To those of you now clearing your throats to remark: but what React gives you is a way to specify UI declartively; the real React API is still imperative.

Sure, I get that. However, the primary interaction with the ReactJS API is just giving the React render function a tree of components you want rendered. That is to say, you give the library a piece of data, and it does what it needs to render the DOM with that data.

Note that declarative UIs have been around for quite a while and were prevalent outside the web application development context. For eg. the first declarative UI I had the pleasure of programming was not React, but QtQuick - a native application frontend framework.

## 3D Graphics - Where are the declarative rendering engines?

My first job as a programmer was as a programmer at a game development studio. Having worked on a number of gaming engines a few years in the past, I expected game engines to have embraced a declarative paradigm in all this time. It seems that has not happened.

3D graphics to me seems to be a field that almost perfect for declarative APIs to rule the roost.

Consider the following code snippet from BabylonJS, [a 3D WebGL based rendering engine](https://playground.babylonjs.com):

```js
function createScene() {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    sphere.position.y = 1;

    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

    return scene;
}
```

Now, consider a (hypothetical) declarative counterpart of the above:

```json
const scenegraph = {
    scenes: {
        "scene.001": {
            "nodes": {
                "light1": {
                    "type": "light.HEMISPHERIC"
                    "pos": [0.0, 1.0, 0.0],
                    "intensity": 0.7
                }
                "sphere1": {
                    "type": "mesh.SPHERE",
                    "pos": [10.0, 0, 5]
                },
                "ground": {
                    "type": "mesh.GROUND",
                    "pos": [0, 0, 0]
                },
                "camera1": {
                    "type": "camera.FREE_CAMERA",
                    "pos": [0, 10, 0],
                    "look_at": [0, 0, 0],
                    "up": [0, 0, 1]
                }
            }
        }
    }
};
babylonjs.render(scenegraph);
```

So, what? Just a data structure passed to a function?

Yes! Exactly!

## Wait, but why?

If you aren't already bowled over by the simplicity inherent in the declarative version, let me point out some of the reasons why I think the latter version is better:

- **The easiest API is no API at all**: Data is easy to explain. Data is almost always self evident to people working in a specific domain. For eg. nearly every graphics programmer would find the above scenegraph trivial to understand. APIs on the other hand take learning.
- **Relinquishing control of state**: Ultimately, the configuration of the scene above is the "state" in your application. In more complex applications, the scene is just a part of a much larger overall state of the full application. Ideally, you want to have only one copy of this state. Libraries with imperative APIs keep a copy of this state (or some transformation of it) in memory managed by the library's code. Note that as the application developer, I will certainly want to maintain my own copy of this state anyway. Libraries that provide declarative APIs do not need to store this state at all. Instead, they need to process it only when it changes.
- **Declarative describes what you want**: Data is all I need to tell the library what I want it to do. Imperative APIs on the other hand force me to describe to the library __how__ to do that as well. Why do I need to break that down into simpler instructions?
- **Avoiding stateful bugs**: Consider this function call in the above snippet:
    ```js
    camera.attachControl(canvas, true);
    ```
I have never actually used the BabylonJS API so I am guessing it binds the newly created camera to the framebuffer. What happens if I had missed calling that function? More interestingly, what if I created 2 cameras and called the same function on both of them?
Both the abovementioned cases would occur when the user of the API introduces a bug in her/his application. However, this becomes remarkably insidious to track down. In a declarative UI, which camera is bound to explicitly visible to the API user. It also allows the API provider an easy way to check if there is only a single camera that has been bound to the current canvas, and to give the user a helpful assert/error if this condition is violated.

## Should All APIs be declarative?

Certainly not. APIs that are not stateful cannot be made declarative. Most (all?) stateful APIs however, should be.

## Declarative API Wishlist

While I used graphics APIs to make my case for declarative APIs, there are several areas of application programming that would benefit greatly from declarative libraries. Here's a list of declarative libraries I wish existed:

- A Declarative Canvas API (I think there are a few of these already)
- A Declarative 2D Map API (a declarative OpenLayers alternative)
- A Declarative 3D GIS API (a declarative Cesium alternative)
- A Declarative Libraray for Buffer Management for Vim (think of the plugin possibilities!)
