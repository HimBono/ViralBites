# ViralBites 🌮🔥

## use your gemini API for it to work

**Discover the hype.** ViralBites is an AI-powered, map-first web application designed to help users discover trending, viral, and "aesthetic" food spots that standard review apps often miss.

Instead of relying solely on historical star ratings, ViralBites uses **Google Gemini 2.5 Flash** equipped with **Search Grounding** and **Google Maps** tools to synthesize a "Viral Score"—aggregating sentiment from TikTok, Instagram, food blogs, and standard reviews in real-time.

<img width="1424" height="1027" alt="image" src="https://github.com/user-attachments/assets/d3e2cdd9-7d11-4105-bce1-e80dc7b293eb" />


## ✨ Key Features

- **🗺️ Interactive Map-First UI**: Seamless exploration with a responsive Leaflet map and synchronized list view.
- **🤖 AI-Powered Discovery**: specific algorithms utilizing Gemini 2.5 Flash to identify "trending" spots based on web sentiment, not just star count.
- **🔥 Must-Try Recommendations**: The AI identifies the specific dish that made the place famous (e.g., "The Strawberry Croissant").
- **⭐ Aggregated Ratings**: Displays a composite score combining Google Maps ratings with a calculated "Web Sentiment" score.
- **📱 Fully Responsive**: Optimized for desktop exploration and mobile on-the-go discovery.
- **🔍 Smart Filtering**: Filter by specific vibes (Street Food, Aesthetics, Viral Cafes), price, and operating hours.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet, React-Leaflet, OpenStreetMap
- **AI & Data**: Google GenAI SDK (`@google/genai`)
- **Models**: `gemini-2.5-flash` with Grounding (Google Search & Maps Tools)
- **Icons**: Lucide React

## 🧠 How It Works

ViralBites is not just a wrapper around the Places API. It acts as an **AI Agent**:

1.  **Geolocation**: The app captures the user's viewport or coordinates.
2.  **Prompt Engineering**: We construct a complex system instruction that asks Gemini to find places based on specific "Viral" criteria (aesthetic, trending, highly discussed).
3.  **Tool Use**:
    *   **Google Maps Tool**: Verifies location existence, coordinates, and operational status.
    *   **Google Search Tool**: Scours the web for mentions, blog posts, and "best of" lists to validate the "hype."
4.  **Data Synthesis**: The AI returns a structured JSON object containing a calculated "Web Rating", specific "Must Try" items, and descriptive tags, which is then rendered on the map.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A Google Cloud Project with the **Gemini API** enabled.
- A valid API Key.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/viralbites.git
    cd viralbites
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    # You must use a paid tier key for Google Search/Maps grounding tools
    API_KEY=your_google_genai_api_key_here
    ```

4.  **Run the application**
    ```bash
    npm start
    ```

## 📸 Screen Overview

| Map View | Place Details | Mobile View |
|----------|---------------|-------------|
| *Pins with price indicators* | *AI-generated descriptions & "Must Try" items* | *Bottom sheet list & toggle* |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built with ❤️ and 🤖 using the Google Gemini API.*
