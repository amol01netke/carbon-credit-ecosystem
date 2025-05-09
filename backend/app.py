import requests
from PIL import Image
import numpy as np
from io import BytesIO
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/calculate-ndvi',methods=['POST'])
def calculate_ndvi():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']
    image = Image.open(file).convert('RGB')

    # Convert image to NumPy array
    np_img = np.array(image).astype(float)

    # Dummy NDVI logic (placeholder)
    # Assume NIR = Red channel, Red = Green channel for simplification
    nir = np_img[:, :, 0]
    red = np_img[:, :, 1]
    
    # NDVI formula
    ndvi = (nir - red) / (nir + red + 1e-5)  # Add small epsilon to avoid division by zero
    mean_ndvi = float(np.mean(ndvi))

    return jsonify({"ndvi": round(mean_ndvi, 4)})

@app.route('/api/estimate-co2',methods=['POST'])
def estimate_co2():
    data = request.get_json()
    ndvi = data.get('ndvi')  # Extract the NDVI value from request body

    print(f"Received NDVI: {ndvi}")  # Optional: log to console

    # Ensure NDVI is a non-negative float
    safe_ndvi = max(0.0, float(ndvi))

    # Scale NDVI to an integer CO₂ sequestration value (0–10), then ensure minimum 1
    estimated_co2 = max(1, round(safe_ndvi * 10))

    return jsonify({
        "amount": estimated_co2,
        "credits": estimated_co2
    })

@app.route('/')
def index():
    return "Server is running"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
