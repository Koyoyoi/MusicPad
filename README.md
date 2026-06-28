# MusicPad

MusicPad is a browser-based music creation tool built with p5.js, featuring a step sequencer, drum machine, and piano interface for real-time music composition.

Live Demo: https://koyoyoi.git.io/MusicPad

---

## Features

- Step sequencer for drum programming
- Piano keyboard for melody input
- Chord display mode
- BPM and volume control (drag interaction)
- Loop-based playback engine
- Multiple instrument/synth support
- Scale and key switching

---

## Tech Stack

- JavaScript (ES6)
- p5.js
- p5.sound
- HTML5 Canvas

---

## Technical Highlights

MusicPad focuses on real-time audio interaction and time-synchronized visual sequencing.

- Built a custom step sequencer using a grid-based state system
- Implemented BPM-driven timing control using asynchronous loop scheduling
- Audio triggering system based on per-step state detection
- Real-time interaction handling for BPM and volume via mouse drag
- Canvas-based UI rendering with continuous draw loop (p5.js render cycle)
- Multi-instrument sample bank management with dynamic switching

This project demonstrates integration of UI interaction, timing systems, and audio playback synchronization in a browser environment without external frameworks.

---

## Core Concept

A grid-based sequencer where each active step triggers audio samples in sync with BPM timing, enabling real-time rhythm and melody creation.

---
