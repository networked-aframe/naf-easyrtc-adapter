# Networked-AFrame 0.7.1(!) OPEN-EasyRTC Adapter

Network adapter for [networked-aframe](https://github.com/networked-aframe/networked-aframe) that uses EasyRTC for the WebRTC framework.

As of 0.7, the existing easyrtc adapter was deprecated in favor of a raw-webrtc implementation that was build in. Unfortunately, that adapter is deeplly problematic to the point of being completely dysfunctional. Doubly unfortunately, the project thereafter immediately lost its maintainer.

This fork implements the updates given by [open-easyrtc](https://github.com/open-easyrtc/naf-easyrtc-adapter/tree/open-easyrtc) in an [unaccepted pull request](https://github.com/networked-aframe/naf-easyrtc-adapter/pull/2), and then goes and updates the demo which was severely out of date (like, 3 years out of date) to work with modern aframe (1.0.4) and networked aframe (0.7.1).

## What have I changed?

Not much, in the demo you'll find:

- this is the current basic-audio demo from the networked-aframe main master repo demos from 0.7.1,
- with aframe bumped up from 1.0.3 to 1.0.4,
- with open-easyrtc added as per the pull request on the easyrtc adapter,
- with the socket.io source from the same pull request included,
- and with the adapter switched to 'easyrtc'

## See an example on glitch

https://naf-071-openeasyrtc.glitch.me/

## Running the Example locally

```
git clone https://github.com/networked-aframe/naf-easyrtc-adapter
cd naf-easyrtc-adapter
npm install # or use yarn
npm run dev # Start the local development server
```

With the server running, browse the example at http://localhost:8080. Open another browser tab and point it to the same URL to see the other client.

### Running on Glitch.com

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/naf-071-openeasyrtc)

### Running your own server

You can deploy the included websocket server to Heroku using the button below.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Then include and configure `naf-easyrtc-adapter`.

```html
<html>
<head>
  <script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
  <script src="https://unpkg.com/networked-aframe/dist/networked-aframe.min.js"></script>
  <!-- Include naf-easyrtc-adapter *after* networked-aframe -->
  <script src="https://unpkg.com/naf-easyrtc-adapter/dist/naf-easyrtc-adapter.min.js"></script> 
</head>
<body>
    <!-- Set adapter to easyrtc and serverURL to the url of your Heroku server. -->
   <a-scene networked-scene="
        adapter: easyrtc;
        serverURL: ws://localhost:8080;
    ">
  </a-scene>
</body>
</html>
```
