# NutriScan 🍏 — AI-Powered Nutrition Scanner

## NutriScan turns any phone into a smart nutrition scanner. Point your camera at a food barcode and instantly get:
	•	🍽️ Calories, macronutrients, and ingredients
	•	🅰️🅱️🅲 NutriScore health ratings
	•	🥬 Veg / non-veg indicators
	•	🌍 Origin & manufacturing details
	•	🏷️ Food labels like Organic, Gluten-Free, Vegan

Built using OpenFoodFacts API, TailwindCSS, and modern browser APIs like HTML5 QR Scanner & BarcodeDetector.

⸻

🚀 Live Demo

🔗 Launch the app:
https://syrthax.github.io/NutriScan/

⸻

📂 Project Structure

NutriScan/
│
├── app/
│   └── web/
│       ├── index.html      # Main application UI
│       ├── styles.css      # All custom styling
│       └── script.js       # Scanner + API logic
│
├── LICENSE                 # MIT License
└── README.md               # Documentation
├── index.html              # Landing page
├── style.css               # Landing page styles
└── script.js               # Scripts for landing page


⸻

🛠️ Tech Stack
	•	HTML5 + TailwindCSS
	•	Vanilla JavaScript
	•	html5-qrcode for live camera scanning
	•	BarcodeDetector API (fallback detection)
	•	OpenFoodFacts REST API
	•	GitHub Pages for hosting

⸻

✨ Features

📸 Smart Barcode Scanning
	•	Live camera scanning
	•	Manual barcode entry
	•	Upload-from-gallery scanning
	•	Flashlight + zoom controls
	•	Scan animation & clean UI

🧪 Nutrition Analysis

Displays:
	•	Energy (kcal)
	•	Sugar
	•	Fat
	•	Protein

🥬 Dietary Indicators
	•	Veg / Non-Veg badges
	•	Organic / Vegan / Gluten-free tags

🌍 Product Metadata
	•	Brand
	•	Image preview
	•	Origin & manufacturing country
	•	Ingredient list

⚠️ Error Handling
	•	No-product fallback
	•	Internet unavailable warning
	•	Retry flow

⸻

📦 Installation (Local Development):
## This app is a web app and needs no installation currently however if you want to launch it instantly you can add it to homescreen through chrome menus

(For local development)
	1.	Clone the repo

git clone https://github.com/Syrthax/NutriScan

	2.	Navigate to the web app folder

cd NutriScan/app/web

	3.	Open in browser
Just double-click index.html
(or run a simple localhost server)


⸻

📝 License

This project is licensed under the MIT License — free for personal & commercial use.

⸻

👤 Author

Sarthak Ghosh
