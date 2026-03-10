# Smart Canteen Demand Predictor

A modern, simple, and highly user-friendly static website designed to help canteen managers efficiently predict the number of meals to prepare to avoid food waste and shortages.

## Features
- **Clean and Accessible Interface**: Designed thoughtfully with large typography, high-contrast colors, and simple step-by-step guidance making it accessible for older users and anyone with moderate technical skills.
- **Rule-based Prediction**: A built-in logic algorithm that calculates expected food demand based on day of the week, meal time, weather, and special events.
- **Visual Analytics**: Interactive data visualization using `Chart.js` to recommend "Expected Demand", "Safety Buffer (10%)", and "Total to Prepare".
- **Completely Responsive**: Fully works across mobile browsers, tablets, and desktop devices.
- **Frontend Only**: No backend needed at this stage. It works natively in the browser.

## Project Structure
- `index.html` - The main structure of the single-page application (SPA).
- `style.css` - Custom styling focusing on aesthetics, spacing, responsive layout, and intuitive coloring.
- `script.js` - Contains simple frontend logic for page navigation, prediction calculation, animations, and graph rendering.
- `assets/` - Folder reserved for future media elements (e.g. offline images or logos). Currently utilizing CDN for fonts and icons.

## How to Run Locally

You don't need to install any heavy dependencies or build tools to run this application.

1. **Extract/Download** the folder containing these files.
2. **Double click on `index.html`** or simply right-click it and choose **Open with > Google Chrome** (or your preferred web browser).
3. The app will boot immediately and works absolutely offline (with exception to the chart generation which relies on the Chart.js CDN—so internet access is preferable).

*(Optional)* If you use modern code editors like Visual Studio Code:
- Open the folder in VS Code.
- Install the `Live Server` extension.
- Click `Go Live` at the bottom right corner of the window.
- The web browser will pop up running it on a local `http` server (e.g. `http://localhost:5500`).

## Future Scalability
The frontend is logically cleanly separated and heavily relies on DOM elements. In the future, modifying the event listener to push/pull values to a database (like **Firebase**) will only take replacing the standalone calculations with an API call.
