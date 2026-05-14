import requests
import json

url = "http://localhost:5001/api/admin/credits"
data = {
    "email": "test@voxflow.studio",
    "amount": 15.0,
    "action": "deduct",
    "reason": "Master Render Export"
}

try:
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
