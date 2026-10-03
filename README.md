# OptiFlip

**Same World. Different Colors.**

OptiFlip is a browser-based color vision simulator. It reads your webcam, passes every frame through a documented color transform on an HTML canvas, and shows the result live. Shapes, objects and motion are untouched; only pixel colors change.

It is an educational tool, not a diagnostic test.

## Features

- Live webcam simulation (`getUserMedia` → `<video>` → canvas → pixel transform → canvas)
- Five modes: Normal, Protanopia, Deuteranopia, Tritanopia, Achromatopsia
- Intensity slider (0% = original, 100% = full simulation) that updates the output without restarting the camera
- Side-by-side original vs. simulated view, drawn from the same camera frame
- Snapshot preview with separate PNG downloads for the original and simulated frames (nothing is uploaded)
- Start / stop, switch camera (when several are detected), fullscreen (where the browser supports it)
- Honest states for loading, permission denied, no camera, camera in use, and unsupported browsers
- Measured processing FPS and resolution shown while the camera is live
- Learn and About pages with sources; privacy notice; "Color Vision Screening" teaser (roadmap only)

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

Camera access works on `localhost` and on HTTPS origins. It is blocked on plain HTTP.

## Deploy to Vercel

1. Push this folder to a Git repository.
2. In Vercel choose **Add New → Project** and import the repository.
3. Vercel detects Vite automatically (build command `npm run build`, output directory `dist`). No environment variables are needed.
4. Deploy. `vercel.json` rewrites all routes to `index.html`, so refreshing `/simulator`, `/learn` or `/about` works, and sets a `Permissions-Policy` header that allows the camera for your own origin.

Or with the CLI: `npx vercel` (preview) and `npx vercel --prod`.

## How the simulation works

- Dichromacy matrices (protanopia, deuteranopia, tritanopia) at severity 1.0 are from Machado, Oliveira & Fernandes (2009), *A Physiologically-based Model for Simulation of Color Vision Deficiency*, IEEE TVCG 15(6). https://doi.org/10.1109/TVCG.2009.113
- Pixels are converted from sRGB to linear light, multiplied by the 3×3 matrix, clamped, and converted back (lookup tables keep this fast).
- Intensity linearly interpolates between the identity matrix and the full matrix, the same way that paper expresses severity. It is a blend control, not a calibrated clinical severity.
- Achromatopsia is approximated as Rec. 709 luminance in linear light. It does not model glare sensitivity or reduced acuity.
- Frames are downscaled to at most 800 px wide before processing. Snapshots are saved at that processing size.

## Limitations

- Color vision varies between people; every simulation is an approximation.
- Camera auto white balance, display calibration and lighting change what you see.
- Performance depends on your device; the FPS badge shows the rate measured in your browser.
- Processing runs on the main thread (no Web Worker or WebGL path yet).

## Privacy

Camera frames are processed locally in the browser. The app has no backend and sends no camera data anywhere. The camera starts only when you press Start camera, and all tracks are stopped when you stop it or leave the page.

## Structure

```
src/
  components/   UI (CameraView, CameraControls, ModeSelector, IntensitySlider, ComparisonView, SnapshotPreview, ...)
  hooks/        useCamera (stream lifecycle), useSimulation (render loop), useCameraStatus
  pages/        Home, Simulator, Learn, About
  types/        simulation.ts (modes, statuses)
  utils/        colorMatrices, imageProcessor, camera, snapshot
```
