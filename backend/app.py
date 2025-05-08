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

@app.route('/api/verify-evidence', methods=['POST'])
def verify_evidence():
    return jsonify({
        "status": "verified",
        "credits": 5,
    })
    
@app.route('/')
def index():
    return "Server is running"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
