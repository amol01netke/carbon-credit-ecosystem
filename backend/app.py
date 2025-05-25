import requests
import datetime
from PIL import Image
import numpy as np
from io import BytesIO
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# @app.route('/api/calculate-ndvi',methods=['POST'])
# def calculate_ndvi():
#     if 'image' not in request.files:
#         return jsonify({"error": "No image uploaded"}), 400

#     file = request.files['image']
#     image = Image.open(file).convert('RGB')

#     # Convert image to NumPy array
#     np_img = np.array(image).astype(float)

#     # Dummy NDVI logic (placeholder)
#     # Assume NIR = Red channel, Red = Green channel for simplification
#     nir = np_img[:, :, 0]
#     red = np_img[:, :, 1]
    
#     # NDVI formula
#     ndvi = (nir - red) / (nir + red + 1e-5)  # Add small epsilon to avoid division by zero
#     mean_ndvi = float(np.mean(ndvi))

#     return jsonify({"ndvi": round(mean_ndvi, 4)})

SENTINEL_CLIENT_ID = "5e7e03a3-b600-4bcc-acbb-45ec190c64f4"
SENTINEL_CLIENT_SECRET = "i2VhNI7uokGfDXhubyYNZsEkXv2qBtGy"
SENTINEL_BASE_URL = "https://services.sentinel-hub.com/oauth/token"

def get_sentinel_access_token():
    response = requests.post(SENTINEL_BASE_URL, data={
        'client_id': SENTINEL_CLIENT_ID,
        'client_secret': SENTINEL_CLIENT_SECRET,
        'grant_type': 'client_credentials'
    })
    response.raise_for_status()
    return response.json()['access_token']

@app.route('/api/calculate-ndvi', methods=['POST'])
def calculate_ndvi():
    data = request.get_json()
    bounds = data.get('bounds')
    print(bounds)
    
    if not bounds or len(bounds) != 2:
        return jsonify({"error": "Invalid bounds provided"}), 400

    sw = bounds[0]
    ne = bounds[1]

    bbox = [sw[1], sw[0], ne[1], ne[0]]  # [minLon, minLat, maxLon, maxLat]
    
    access_token = get_sentinel_access_token()

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    evalscript = """
    //VERSION=3
    function setup() {
      return {
        input: ["B04", "B08"],
        output: { bands: 1 }
      };
    }

    function evaluatePixel(sample) {
      let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
      return [ndvi];
    }
    """

    payload = {
        "input": {
            "bounds": {
                "bbox": bbox,
                "properties": {
                    "crs": "http://www.opengis.net/def/crs/EPSG/0/4326"
                }
            },
            "data": [
                {
                    "type": "sentinel-2-l2a",
                    "dataFilter": {
                        "timeRange": {
                            "from": (datetime.datetime.utcnow() - datetime.timedelta(days=15)).strftime("%Y-%m-%dT%H:%M:%SZ"),
                            "to": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
                        },
                        "mosaickingOrder": "leastCC"
                    }
                }
            ]
        },
        "output": {
            "width": 256,
            "height": 256,
            "responses": [
                {
                    "identifier": "default",
                    "format": {
                        "type": "image/tiff"
                    }
                }
            ]
        },
        "evalscript": evalscript
    }

    sentinel_url = "https://services.sentinel-hub.com/api/v1/process"
    response = requests.post(sentinel_url, json=payload, headers=headers)

    if response.status_code != 200:
        return jsonify({"error": "Sentinel Hub API request failed"}), 500

    # Process NDVI TIFF image
    from PIL import Image
    import numpy as np
    import io

    ndvi_image = Image.open(io.BytesIO(response.content))
    ndvi_array = np.array(ndvi_image).astype(np.float32)
    ndvi_array = ndvi_array / 255 * 2 - 1  # normalize from 0-255 to -1 to 1 range

    mean_ndvi = float(np.mean(ndvi_array))
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
