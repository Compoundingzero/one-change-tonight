# Squoosh audit

Inspected 2026-09-07: initial mobile and desktop; built-in sample, working editor, completed MozJPEG result and download at 390 × 844. The observed sample reported 862 kB and 69% reduction from a 2.79 MB source. No private file was uploaded.

## First view and model

Squoosh begins with a huge Drop/Paste target and four concrete sample images. Action dominates; “Small,” “Simple” and “Secure” explanations sit below. The privacy claim is specific: images never leave the device because processing is local. Sign-up is not required; an optional Install control is secondary.

The editor is an upload-and-result comparison workspace. A draggable split keeps original and compressed output in the same visual field. On mobile, compact result panels overlay the bottom of the image, while codec and advanced settings remain collapsible.

## Feedback and control

Input acceptance is immediate: the route changes to `/editor` and the sample fills the canvas. The result panel changes from a processing ellipsis to codec, output size, savings percentage and a distinct download control. Back is visible. Users can choose codecs, change quality, enable edits and reveal advanced settings without needing them for first success.

## Accessibility and mobile

Samples, codec selectors, quality slider, panels and downloads were named in the accessibility tree. The mobile result remains usable but is dense and image-dependent; a nonvisual user cannot obtain the same before/after insight from the image alone. This reinforces the need for complete textual clues in One Change Tonight.

## Transfer

- Put action before explanation and provide a no-risk example/uncertainty path.
- State local processing in direct language near the task.
- Make result completion visible and quantify only facts the system actually knows.

## Do not import

- Do not import a comparison slider, image-canvas layout, playful blobs or bright pink/blue palette.
- Do not hide safety-critical information inside advanced panels.
- Do not show technical result metrics that could be mistaken for a medical score.
