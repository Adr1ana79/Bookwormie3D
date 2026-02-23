<img src="frontend/assets/images/logo/bookwormie-logo.png" alt="Bookwormie3D Logo" width="48" align="left" />

# Bookwormie3D

An interactive 3D virtual library built with Blender and Python.

Users can create profiles and design virtual bookshelves by adding books with customizable colors, sizes, and titles. The project features interactive visualization, including zooming into specific shelves, and showcases work with 3D objects, animations, UI, and basic data management.

## Features
- User profile registration and management
- Creation and customization of 3D shelves
- Data backup and recovery
- Management of visual modes of the interface

## Technologies
- Blender
- Python

## Installation and Setup

The system is divided into a **Frontend** (client-side) and a **Backend** (server-side), which are started independently.

### Backend Installation and Startup

#### 1. Clone or Download the Project
Download the project source code from the version control system (Git).

#### 2. Create a Virtual Environment (Recommended)
Run the following command to create a virtual environment:

python -m venv venv


Activate the environment:

Windows:
venv\Scripts\activate

macOS/Linux:
source venv/bin/activate


#### 3. Install Dependencies
Install the required packages using pip:

pip install -r requirements.txt
Key dependencies include: FastAPI, SQLAlchemy, psycopg2, python-jose, passlib, and uvicorn.



#### 4. Database Configuration
Create a PostgreSQL database.

Configure the connection string in the configuration file (e.g., database.py).

Verify the connection to the server.



#### 5. Start the Server
Run the backend using Uvicorn:

uvicorn app.main:app --reload
Default Server URL: http://127.0.0.1:8000

Interactive API Documentation: http://127.0.0.1:8000/docs





### Frontend Installation and Startup
The Frontend is built with Vanilla JavaScript and does not require external package managers.

#### 1. Start a Local Server
You can serve the frontend using one of the following methods:

VS Code: Use the Live Server extension.

Python Simple Server:

python -m http.server 5500

Any built-in IDE web server.



#### 2. Access in Browser
Once the server is running, open your browser at:
http://localhost:5500



#### 3. Connecting to the Backend
The Frontend communicates with the Backend via REST API requests to http://localhost:8000.

Note: Ensure the Backend server is running before using the application.



#### Additional Configurations
CORS: Middleware must be configured on the backend to allow the local origin.

WebGL: Ensure WebGL is enabled in your web browser.

Database: The database service must be active before starting the backend server.
