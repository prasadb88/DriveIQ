# DriveIQ - Your Smart Car Marketplace (MERN Stack)

![DriveIQ Logo](https://img.shields.io/badge/DriveIQ-MERN%20Stack-brightgreen?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Framework-Express.js-000000?style=for-the-badge&logo=express)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Runtime-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

Welcome to **DriveIQ**, a modern and intelligent car marketplace built with the MERN (MongoDB, Express.js, React, Node.js) stack. This project aims to provide a seamless experience for both buyers and sellers in the automotive market, incorporating advanced features to enhance usability and efficiency. **Notably, our innovative AI feature allows users to simply upload a car image, and the system automatically extracts all car details, eliminating manual data entry.**

**🌟 To see the project live, visit: [https://drive-iq.vercel.app/](https://drive-iq.vercel.app/) 🌟**

## Table of Contents

* [Project Overview](#project-overview)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
* [Contact](#contact)

## Project Overview

DriveIQ is a full-stack web application designed to revolutionize the car buying and selling process. It leverages the power of the MERN stack to deliver a responsive, scalable, and feature-rich platform. Whether you're looking to list your car for sale or find your next dream vehicle, DriveIQ provides the tools you need.

## Features

This project includes a comprehensive set of features for a modern car marketplace:

### Core Functionality
* **Car Listings:** Users can view detailed listings of cars available for sale.
* **Search & Filter:** Advanced search capabilities based on make, model, year, price, location, and more.
* **User Authentication:** Secure user registration, login, and session management (JWT-based).
* **Profile Management:** Users can manage their personal information and preferences.

### Advanced Features

* **Test Drive Scheduling:**
    * Buyers can easily request test drives for cars they are interested in.
    * Sellers receive immediate notifications and can manage test drive appointments through their dedicated dashboard.
    * An integrated calendar system helps in scheduling and checking availability efficiently.

* **Seller Dashboard:**
    * **Comprehensive Listing Management:** Sellers get a robust dashboard to add, edit, delete, and view the status of their car listings.
    * **Performance Analytics:** View insights into listing views, inquiries, and potential sales leads.
    * **Inquiry & Test Drive Management:** Centralized hub to manage communications with potential buyers and schedule/confirm test drives.
    * **Sales Tracking:** Monitor the progress of sales from inquiry to completion.

* **⚡ AI-Powered Smart Car Detail Extraction ⚡ (Game-Changing Feature)**
    * **Effortless Listing Creation:** Say goodbye to tedious form filling! Sellers simply upload an image of their car.
    * **Automatic Detail Recognition:** Our cutting-edge AI model analyzes the uploaded car image and automatically extracts **ALL relevant car details**, including:
        * Make and Model
        * Year of Manufacture
        * Color
        * Body Type
        * Even specific features visible in the image .
    * **User Convenience:** The system populates the listing form with the detected information, saving sellers significant time and reducing data entry errors. Users only need to confirm or make minor edits.
    
## Technologies Used

### Frontend (Client)
* **React.js:** A JavaScript library for building user interfaces.
* **React Router:** For declarative routing.
* **Redux (or React Context API):** For state management (if applicable).
* **Axios:** For making HTTP requests to the backend.
* **Shadcn UI / Tailwind CSS:**  For styling and responsive design.

### Backend (Server)
* **Node.js:** JavaScript runtime environment.
* **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** NoSQL database for flexible data storage.
* **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
* **JWT (JSON Web Tokens):** For secure authentication and authorization.
* **Bcrypt.js:** For password hashing.
* **Multer / Cloudinary:** For handling file uploads and cloud storage.
* **dotenv:** For managing environment variables.
* **AI Integration:** Gemmni API Integretion

## Getting Started

Follow these steps to set up and run the DriveIQ project on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (LTS version recommended)
* **npm** (Node Package Manager, comes with Node.js) or **Yarn**
* **MongoDB:**
    * A local MongoDB instance running (e.g., via Docker or installed directly).
    * OR a cloud-based MongoDB Atlas cluster (recommended for easier setup and testing).
* **Cloudinary Account:** (Or your chosen image storage service) for image uploads.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/prasadb88/DriveIQ.git](https://github.com/prasadb88/DriveIQ.git)
    cd DriveIQ
    ```

2.  **Install Backend Dependencies:**
    Navigate into the  `backend` directory and install the dependencies:
    ```bash
    cd server # Or 'backend' if that's your folder name
    npm install
    # or
    yarn install
    ```

3.  **Install Frontend Dependencies:**
    Navigate into the  `frontend` directory and install the dependencies:
    ```bash
    cd ../frontend # Go back to root, then into 'client'
    npm install
    # or
    yarn install
    ```

## Contact

For any questions, suggestions, or feedback, please feel free to:

* Open an issue in this GitHub repository.
* **Contact the maintainer:**
    * **Prasad Bhot** - [prasadbhot02@gmail.com](mailto:prasadbhot02@gmail.com)
* **Project Link:** [https://github.com/prasadb88/DriveIQ](https://github.com/prasadb88/DriveIQ)
* **Live Application:** [https://drive-iq.vercel.app/](https://drive-iq.vercel.app/)

---
Developed with ❤️ by Prasad Bhot
