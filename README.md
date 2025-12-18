Stonic AI – Real-Time SHM Dashboard

This repository contains the web dashboard for Stonic AI, an edge-deployed Structural Health Monitoring (SHM) system that performs real-time anomaly detection using time-series machine learning and streams results live via WebSockets.

The dashboard is built using Next.js and Tailwind CSS, and connects to an ESP32-based edge inference system to visualize continuous structural health metrics.

Project Overview

Stonic AI is designed to detect early structural anomalies by analyzing multivariate time-series data using a CNN–LSTM autoencoder deployed at the edge.
This repository focuses on the frontend and real-time communication layer, enabling:

Live visualization of anomaly scores

Continuous 24/7 monitoring

Low-latency updates via WebSockets

Scalable, modern web interface

The system achieved 94% anomaly detection accuracy and enables over 90% cost reduction compared to traditional SHM systems.

Tech Stack

Framework: Next.js (App Router)

Styling: Tailwind CSS

Real-Time Communication: WebSockets

Language: JavaScript

Backend Integration: ESP32 edge device (WebSocket server)

ML Backend: CNN–LSTM time-series autoencoder (TensorFlow)

Getting Started

First, install the dependencies:

npm install
# or
yarn install
# or
pnpm install


Then, run the development server:

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


Open the application in your browser:

http://localhost:3000


The page will automatically reload as you edit the source files.

Project Structure
app/
 ├── page.js            # Main dashboard UI
 ├── layout.js          # Root layout
 ├── components/        # Reusable UI components
 ├── styles/            # Global styles
public/
 ├── assets/            # Images and static files

WebSocket Integration

The dashboard establishes a persistent WebSocket connection with the ESP32 edge device.

Receives real-time anomaly scores and sensor data

Updates the UI instantly without polling

Supports continuous streaming for long-running monitoring sessions

WebSockets are preferred over HTTP polling to ensure low latency and efficient real-time updates.

Machine Learning Context (High Level)

The edge device runs a CNN–LSTM autoencoder trained on time-series sensor data:

CNN encoder extracts local temporal features

LSTM decoder models structure-specific temporal behavior

Anomalies are detected using reconstruction error

This dashboard visualizes the output of the edge ML inference, not the raw training pipeline.

Deployment

The dashboard can be deployed using Vercel or any standard Node.js hosting platform.

To deploy on Vercel:

Push this repository to GitHub

Import the project into Vercel

Configure environment variables (if required)

Deploy

For more details, refer to the official documentation:
https://nextjs.org/docs/app/building-your-application/deploying

Learn More

To learn more about the technologies used:

Next.js Documentation: https://nextjs.org/docs

WebSockets Guide: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

Tailwind CSS: https://tailwindcss.com/docs

Project Recognition

This project secured 3rd Prize at Vision 2047, a national-level hackathon organized by FlairX Networks, Google Developer Groups RVCE, and RV College of Engineering.

Team

Raju Dhangar

Ismail Warsi

Harsh Dubey

Om Patil

Hamaas Shabir

License

This project is for academic and research purposes.
