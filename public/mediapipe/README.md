# MediaPipe files for in-browser background removal

The LinkedIn graphics editor's "Remove background" button loads these files from this site only when someone uses it. Photos are processed in the browser and never uploaded.

- `wasm/vision_wasm_internal.{js,wasm}` and `wasm/vision_wasm_nosimd_internal.{js,wasm}`: copied unchanged from the npm package `@mediapipe/tasks-vision` 0.10.35 (https://www.npmjs.com/package/@mediapipe/tasks-vision), Apache License 2.0. Copyright Google LLC.
- `selfie_segmenter.tflite`: MediaPipe Selfie Segmenter, float16, downloaded 2026-11-13 from https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite (SHA-256 191ac9529ae506ee0beefa6b2c945a172dab9d07d1e802a290a4e4038226658b). Apache License 2.0 per the MediaPipe Selfie Segmentation model card. Copyright Google LLC.
- `LICENSE.txt`: the Apache License, Version 2.0 text that covers both.

When you upgrade `@mediapipe/tasks-vision` in package.json, copy the matching wasm files here again: the JavaScript API and the wasm runtime must be the same version.
