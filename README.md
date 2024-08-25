# Geofence Management System

A React-based web application for managing geofences on Google Maps. This application allows users to add, edit, delete, and list geofences with various attributes such as name, border color, fill color, and the coordinates of the geofence's points. The geofences are synchronized across a map view and a list view, with additional features like filtering, pagination, and persistent storage using localStorage.

## Features

### 1. Map Page

- **Add Geofence**:
  - Allows users to draw a polygon on the map and set attributes like name, border color, and fill color.
  - The newly created geofence is stored locally and displayed on the map.
- **Edit Geofence**:

  - Users can select a geofence from the list to edit its shape on the map.
  - Updates are reflected immediately and stored persistently.

- **Delete Geofence**:

  - Users can select and delete a geofence from the map.
  - The deletion is synced with the local storage.

- **Persistent Data**:
  - All geofences are saved in the browser's localStorage and are loaded automatically when the application is launched.

### 2. List Page

- **Geofence Listing**:
  - Displays a paginated list of all geofences with details such as name, border color, fill color, added date, and coordinates.
- **Filter Geofences**:

  - Users can filter geofences by name using a search bar with fuzzy matching.

- **Bulk Delete**:

  - Users can select multiple geofences from the list and delete them in one operation.

- **Display on Map**:
  - Each geofence in the list has a checkbox to toggle its visibility on the map.

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. Version must >= 20.0.0.
- **npm**: Ensure you have npm installed. Version must >= 10.0.0.
- **yarn or pnpm**: Must only use npm, to keep project consistency.
- **Google Maps API Key & Map ID**: Obtain a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/).

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/zrcoy/test.git
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory of your project and add the following:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

This will start the application on `http://localhost:3000`. Open this URL in your browser to access the Geofence Management System.

### Building for Production

To build the project for production, run:

```bash
npm run build
```

This will create an optimized production build in the `out` directory.

To start the production server, run:

```bash
npm run start
```

The production build will be available at `http://localhost:3000`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Google Maps API](https://developers.google.com/maps/documentation/javascript/overview)
- [Ant Design](https://ant.design/) for the UI components
- [Next.js](https://nextjs.org/) for the React framework

---
