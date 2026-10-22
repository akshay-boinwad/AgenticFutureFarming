# 🌱 Agentic Future Farming – Smart Agriculture Ecosystem

An AI-powered smart agriculture project designed to help farmers access crop health analysis and digital farming services through a mobile application.

The project uses **React Native with Expo** for the mobile application, **Node.js and Express** for backend APIs, and **Python with FastAPI** for the machine learning service.

> **Project status:** In development. The Crop Doctor image-upload pipeline is integrated and tested. A trained crop disease classification model is the next major milestone.

## 📌 Table of Contents

* [Overview](#-overview)
* [Objectives](#-objectives)
* [Features](#-features)
* [Technology Stack](#-technology-stack)
* [System Architecture](#-system-architecture)
* [Project Structure](#-project-structure)
* [Prerequisites](#-prerequisites)
* [Installation and Setup](#-installation-and-setup)
* [API Endpoints](#-api-endpoints)
* [Crop Doctor Workflow](#-crop-doctor-workflow)
* [Current Status](#-current-status)
* [Future Enhancements](#-future-enhancements)
* [Troubleshooting](#-troubleshooting)
* [Contributors](#-contributors)
* [License](#-license)

## 🌾 Overview

Agentic Future Farming is a smart agriculture ecosystem project intended to bring digital farming tools into a single mobile application.

The system follows a modular architecture that separates the mobile interface, backend API, and machine learning service.

The current Crop Doctor workflow allows users to select a crop image or capture a photograph, upload it through the backend, and validate the image using the Python service.

Actual disease classification will be added by integrating a trained machine learning model.

## 🎯 Objectives

* Develop a mobile-first smart agriculture application.
* Provide an interface for submitting crop and leaf images.
* Establish communication between the mobile application and backend APIs.
* Integrate a Python-based machine learning service.
* Prepare the system for crop disease classification.
* Create a foundation for future farming tools and services.

## ✨ Features

### Implemented

* Mobile application developed with React Native and Expo.
* Crop Doctor screen with image preview.
* Crop image selection from the phone's gallery.
* Camera access for capturing crop photographs.
* Image upload using multipart form data.
* Node.js and Express backend API.
* Python FastAPI machine learning service.
* Image file validation.
* JSON responses and error handling.
* Health-check endpoints for backend services.

### In Development

* Integration of a trained crop disease classification model.
* Disease prediction and confidence reporting.
* Disease-specific recommendations.
* Additional smart agriculture features.

**Note:** Image validation is working, but the current system does not yet produce actual crop disease predictions.

## 🛠️ Technology Stack

| Component                   | Technology                                                     |
| --------------------------- | -------------------------------------------------------------- |
| Mobile application          | React Native                                                   |
| Mobile development platform | Expo                                                           |
| Navigation                  | Expo Router                                                    |
| Image selection and camera  | Expo Image Picker                                              |
| Backend                     | Node.js                                                        |
| Backend framework           | Express                                                        |
| Machine learning API        | Python, FastAPI                                                |
| API server                  | Uvicorn                                                        |
| Image validation            | Pillow                                                         |
| Database                    | MongoDB planned or to be integrated into the verified workflow |
| Development environment     | Visual Studio Code                                             |
| Version control             | Git and GitHub                                                 |

## 🏗️ System Architecture

The application is divided into three primary components.

```text
              ANDROID MOBILE APP
             React Native + Expo
                      |
                      | HTTP multipart upload
                      v
               NODE.JS BACKEND
                 Express :5000
                      |
                      | Forward image
                      v
              PYTHON ML SERVICE
                 FastAPI :8000
                      |
                      v
                IMAGE VALIDATION
                      |
                      v
               JSON RESPONSE
                      |
                      v
                MOBILE APP
```

The backend and ML service currently run on the development computer.

The mobile application communicates with the backend using the computer's reachable local network IP address.

## 📂 Project Structure

```text
AgenticFutureFarming/
│
├── mobile/
│   ├── src/
│   │   └── app/
│   │       └── crop-doctor.tsx
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── server.js
│   └── ...
│
├── ml-service/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── README.md
└── .gitignore
```

The structure above highlights the main project components. Additional files may exist in each directory.

## ⚙️ Prerequisites

Install the following before running the project:

* Node.js and npm
* Python 3
* Git
* Visual Studio Code
* Expo Go on an Android phone, or a supported emulator

The phone and development computer should be able to communicate over the local network when testing through Expo Go.

## 🚀 Installation and Setup

### 1. Clone the repository

After uploading this project to GitHub, clone it using:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Replace the placeholder with your repository's actual URL.

Move into the project directory:

```bash
cd AgenticFutureFarming
```

### 2. Set up the mobile application

Open a terminal in the `mobile` directory:

```bash
cd mobile
npm install
```

Start Expo:

```bash
npx expo start
```

If necessary, clear the Metro cache:

```bash
npx expo start --clear
```

Scan the displayed QR code with Expo Go.

### 3. Set up the Node.js backend

Open a separate terminal:

```bash
cd backend
npm install
```

Start the backend using the start script defined in `backend/package.json`, if one exists. For example, if the project uses `server.js` directly:

```bash
node server.js
```

The backend is configured to listen on port `5000`.

Do not start another copy if the backend is already running.

### 4. Set up the Python ML service

Open another terminal:

```bash
cd ml-service
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it in Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI service:

```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

The Python service is configured to listen on port `8000`.

If the environment is already configured, activate the existing virtual environment rather than recreating it.

### 5. Configure the mobile API address

The Crop Doctor screen sends image uploads to the backend.

The current development endpoint is configured in `mobile/src/app/crop-doctor.tsx`:

```text
http://10.178.139.87:5000/api/crop/analyze
```

This IP address is specific to the current development network and may change.

Before running the application on a phone:

1. Find the development computer's current Wi-Fi IPv4 address.
2. Update the API address in the mobile application.
3. Ensure the phone and computer can communicate over the network.
4. Allow the required development ports through the firewall if necessary.

Do not use the computer's `localhost` address in the phone's API URL. On the phone, `localhost` refers to the phone itself.

For production deployment, use an appropriately secured, publicly reachable API endpoint rather than a local development IP.

## 🔌 API Endpoints

The following endpoints are part of the current integration.

| Service           | Method | Endpoint            | Purpose                                                    |
| ----------------- | ------ | ------------------- | ---------------------------------------------------------- |
| Python ML service | GET    | `/health`           | Check ML service health                                    |
| Python ML service | POST   | `/api/crop/analyze` | Receive and validate a crop image                          |
| Node.js backend   | GET    | `/api/health`       | Check backend health and its configured service dependency |
| Node.js backend   | POST   | `/api/crop/analyze` | Receive an image and forward it to the Python service      |

### Crop analysis request

The upload endpoint expects multipart form data with the field name:

```text
image
```

Supported image formats and size limits are validated by the current service implementation.

The backend forwards the uploaded image to the Python ML service and returns the resulting JSON response.

### Current analysis response

The Python service currently returns a response similar to:

```json
{
  "success": true,
  "message": "Image received and validated successfully.",
  "prediction": null,
  "model_connected": false,
  "next_step": "Connect a trained crop disease classification model to generate real predictions."
}
```

This indicates successful image validation, not successful disease classification.

## 🔬 Crop Doctor Workflow

The current workflow is:

1. Open the Crop Doctor screen.
2. Select a crop image or capture a photograph.
3. Preview the image.
4. Tap **Analyze Crop**.
5. The mobile application uploads the image to the Node.js backend.
6. The backend forwards the image to the Python FastAPI service.
7. The Python service validates the image.
8. The response travels back to the mobile application.
9. The application displays the upload result.

A trained disease classification model must be integrated before the application can identify actual diseases.

## 📊 Current Status

| Module                                | Status         |
| ------------------------------------- | -------------- |
| Mobile application setup              | Working        |
| Crop Doctor interface                 | Implemented    |
| Gallery image selection               | Implemented    |
| Camera capture                        | Implemented    |
| Mobile-to-backend communication       | Tested         |
| Backend-to-Python communication       | Tested         |
| Image validation                      | Working        |
| Trained disease classification model  | Pending        |
| Real disease predictions              | Pending        |
| Prediction confidence                 | Pending        |
| Disease-specific recommendations      | Pending        |
| MongoDB integration for this workflow | To be verified |

## 🔮 Future Enhancements

* Integrate a trained crop disease classification model.
* Return disease labels and confidence scores.
* Add disease-specific prevention and treatment information.
* Store previous analyses and retrieve analysis history.
* Integrate weather information and crop advisory features.
* Add agricultural marketplace functionality.
* Explore agent-based assistance for farming tasks.
* Improve testing, deployment, and application security.

These are planned enhancements and are not represented as completed features.

## 🧰 Troubleshooting

### Mobile application cannot connect to the backend

* Verify the computer's current Wi-Fi IPv4 address.
* Update the API URL in the mobile application.
* Check that the Node.js backend is running.
* Confirm that the phone and computer can communicate over the network.
* Check firewall rules and network isolation.

### Port 5000 or 8000 is already in use

A backend service may already be running on that port.

Check the existing terminal or running process before starting another server. Avoid running duplicate instances unintentionally.

### Image upload fails

* Confirm that the backend health endpoint responds.
* Confirm that the Python health endpoint responds.
* Check the multipart field name.
* Check the image format and size.
* Inspect the mobile, backend, and Python terminal logs.

### The image uploads but no disease is detected

This is expected in the current development version. The Python service validates images, but a trained classification model has not yet been connected.

## 👥 Contributors

Add the final project team members and their responsibilities here.

* Aryan
* Akshay
* Sahil
* Pawan

## 📄 License

This project is being developed as an academic final-year project.

Choose and add an appropriate open-source license before granting others permission to reuse, modify, or distribute the project. Until then, no license has been specified.

````

## Step 2: Create a `.gitignore` file

In the root `AgenticFutureFarming` folder, create a file named `.gitignore`.

Copy and paste this:

```gitignore
# Dependencies
node_modules/
**/node_modules/

# Python virtual environments
.venv/
venv/
env/

# Python cache
__pycache__/
*.py[cod]

# Environment variables and secrets
.env
.env.*
!.env.example

# Logs
*.log
npm-debug.log*

# Operating system
.DS_Store
Thumbs.db
desktop.ini

# Editors
.vscode/
.idea/

# Build outputs
dist/
build/
.expo/

# Test and coverage outputs
coverage/

# Local files
*.local
````

**Important:** If Git is already tracking a file, adding it to `.gitignore` alone will not remove it from version control. Check for secrets before uploading.

## Step 3: Upload the project to GitHub

Open the VS Code terminal at the main project folder.

First, check whether Git is already initialized:

```powershell
git status
```

### If Git is already initialized

Run:

```powershell
git add README.md .gitignore
git add mobile backend ml-service
git status
```

Review the files listed before committing. Make sure `.env` files, passwords, API keys, virtual environments, and `node_modules` are not being uploaded.

Then commit:

```powershell
git commit -m "docs: add project README and gitignore"
```

### If Git is not initialized

Run:

```powershell
git init
git add README.md .gitignore
git add mobile backend ml-service
git status
```

Review the files before committing, then run:

```powershell
git commit -m "Initial commit: Agentic Future Farming"
```

### Connect to your GitHub repository

Create an empty repository on [GitHub](https://github.com?utm_source=chatgpt.com).

Do not initialize the GitHub repository with a second README if you already created one locally.

Copy your repository's HTTPS URL, then run the following, replacing the placeholder:

```powershell
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

If `origin` already exists, inspect it with:

```powershell
git remote -v
```

If it points to the correct repository, do not add it again.

---

## Step 4: Final checks before taking your break

* [ ] `README.md` is in the root folder.
* [ ] `.gitignore` is in the root folder.
* [ ] No passwords, tokens, or private environment files are being committed.
* [ ] No `node_modules` or `.venv` folders are being committed.
* [ ] The README accurately describes the model as pending.
* [ ] The repository has been pushed to GitHub.
* [ ] The GitHub page displays the README correctly.

**My recommendation:** Complete the README and upload first. Once the repository is pushed, you'll have a backup of the current project before we continue integrating the trained crop disease model.

If you encounter a Git error, copy the exact terminal message and I can help you resolve it.
