# Stonic AI – Real-Time SHM Dashboard

This repository contains the web dashboard for **Stonic AI**, an edge-deployed Structural Health Monitoring (SHM) system. It performs real-time anomaly detection using time-series machine learning and streams results live via WebSockets. 

Built using Next.js and Tailwind CSS, the dashboard connects to an ESP32-based edge inference system to visualize continuous structural health metrics.

## Project Overview

Stonic AI is designed to detect early structural anomalies by analyzing multivariate time-series data using a CNN–LSTM autoencoder deployed at the edge. This repository focuses on the frontend and real-time communication layer, enabling:

* Live visualization of anomaly scores
* Continuous 24/7 monitoring
* Low-latency updates via WebSockets
* A scalable, modern web interface

**Performance:** The system achieved a **94% anomaly detection accuracy** and enables an **over 90% cost reduction** compared to traditional SHM systems.

## Tech Stack

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **Real-Time Communication:** WebSockets
* **Language:** JavaScript
* **Backend Integration:** ESP32 edge device (WebSocket server)
* **ML Backend:** CNN–LSTM time-series autoencoder (TensorFlow)

## Getting Started

### Installation
First, install the project dependencies using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Running the Development Server
Once dependencies are installed, start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application. The page will automatically reload as you edit the source files.

## Project Structure

```text
app/
├── page.js            # Main dashboard UI
├── layout.js          # Root layout
├── components/        # Reusable UI components
└── styles/            # Global styles
public/
└── assets/            # Images and static files
```

## System Architecture 

### WebSocket Integration
The dashboard establishes a persistent WebSocket connection with the ESP32 edge device. WebSockets are preferred over standard HTTP polling to ensure low latency and highly efficient updates.

* Receives real-time anomaly scores and sensor data.
* Updates the UI instantly without the need for constant polling.
* Supports continuous streaming for long-running monitoring sessions.

### Machine Learning Context (High Level)
The edge device runs a CNN–LSTM autoencoder trained on time-series sensor data. 

* **CNN encoder:** Extracts local temporal features.
* **LSTM decoder:** Models structure-specific temporal behavior.
* **Detection:** Anomalies are flagged based on the reconstruction error.

*Note: This dashboard visualizes the output of the edge ML inference; it does not contain the raw training pipeline.*

## Deployment

The dashboard can be easily deployed using Vercel or any standard Node.js hosting platform. 

**To deploy on Vercel:**
1. Push this repository to GitHub.
2. Import the project into your Vercel dashboard.
3. Configure your environment variables (if required).
4. Click Deploy.

For more details, refer to the official [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Learn More

To learn more about the underlying technologies used in this project:
* [Next.js Documentation](https://nextjs.org/docs)
* [WebSockets API Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
* [Tailwind CSS](https://tailwindcss.com/docs)

## License

This project is intended for academic and research purposes.
