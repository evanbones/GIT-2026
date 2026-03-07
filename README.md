# GIT Hackathon 2026 Project

[![Build Status](https://github.com/evanbones/GIT-2026/actions/workflows/ci.yml/badge.svg)](https://github.com/evanbones/GIT-2026/actions)
[![Python Version](https://img.shields.io/badge/python-3.11-red)](https://www.python.org/)
[![React Version](https://img.shields.io/badge/react-v19.2-blue)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/evanbones/GIT-2026/blob/main/LICENSE)

## About The Project

> TODO: write description of problem and our solution n' stuff yeah

### Tech Stack

- **Frontend:** React 19/Vite, Leaflet
- **Backend:** Python 3.11, Flask
- **Infrastructure:** Docker & Docker Compose
- **CI/CD:** GitHub Actions

## Team Members

- Evan Bowness
- Graeme Bradford
- Patrick Rinn
- Patrik Balazsy
- Amber Hawker

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

You will need Docker installed on your machine.

- [Get Docker](https://docs.docker.com/get-docker/)

### Installation & Running Locally

1. **Clone the repository**

```bash
git clone https://github.com/evanbones/GIT-2026.git
cd GIT-2026
```

2. **Start the development environment**
   Run the following command from the root directory to build and spin up both the Flask backend and React frontend:

```bash
docker-compose up --build
```

3. **View the application**

- Frontend (Vite/React): Open `http://localhost:5173` in your browser.
- Backend (Flask API): Available at `http://localhost:8000`.
