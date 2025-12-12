# Virtual Pet Frontend

A React-based frontend for the Virtual Pet application, built with Vite for fast development and Bootstrap for responsive UI.

## Features

- **Pet Management**: View and interact with virtual pets
- **User Authentication**: Login and signup functionality
- **Pet Nicknames**: Customize pet names with persistent storage
- **Theme Support**: Light and dark mode themes
- **Responsive Design**: Mobile-friendly interface using Bootstrap

## Technologies Used

- **React**: UI library for building user interfaces
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Bootstrap**: CSS framework for responsive design
- **Axios/Fetch**: HTTP client for API communication
- **Local Storage**: Client-side data persistence

## Installation

1. Ensure you have Node.js (v16 or higher) installed.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

2. Build for production:
   ```bash
   npm run build
   ```

3. Preview the production build:
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components (Home, Login, etc.)
├── assets/             # Static assets (images, icons)
├── styles/             # CSS stylesheets
├── utils/              # Utility functions
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── ThemeContext.jsx    # Theme provider
```

## API Integration

The frontend communicates with the backend API at `http://localhost:8081`. Key endpoints:

- `POST /signup` - User registration
- `POST /login` - User authentication
- `GET /pets` - Fetch all pets
- `GET /user` - Get user profile
- `PUT /user/pet-nickname` - Update pet nickname

## Environment Variables

Create a `.env` file in the root directory if needed for custom configurations.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
