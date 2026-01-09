from flask import Flask, request, redirect, jsonify
import string
import random

app = Flask(__name__)

# --- DATABASES (In-Memory) ---
url_db = {}
click_counts = {}

def generate_short_id():
    """Helper function to create a random 6-character key."""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(6))

# 1. CREATE ENDPOINT
@app.route('/shorten', methods=['POST'])
def shorten():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "Please provide a URL"}), 400
    
    long_url = data.get('url')

    # Check for duplicates
    for existing_id, existing_url in url_db.items():
        if existing_url == long_url:
            short_url = f"http://127.0.0.1:5000/{existing_id}"
            # OUTPUT ON TERMINAL FOR DUPLICATE
            print(f"ALREADY EXISTS: shortURL: {short_url} corresponds to longURL: {long_url}")
            return jsonify({"short_url": short_url, "short_id": existing_id}), 200

    # Create new entry
    short_id = generate_short_id()
    short_url = f"http://127.0.0.1:5000/{short_id}"
    url_db[short_id] = long_url
    click_counts[short_id] = 0 
    
    # OUTPUT ON TERMINAL FOR NEW CREATION
    print(f"CREATED: shortURL: {short_url} corresponds to longURL: {long_url}")
    
    return jsonify({
        "message": "New short URL created",
        "short_url": short_url,
        "short_id": short_id
    }), 201

# 2. REDIRECT & CLICK TRACKING
@app.route('/<short_id>', methods=['GET'])
def go_to_url(short_id):
    long_url = url_db.get(short_id)
    
    if long_url:
        # Increment Counter
        click_counts[short_id] += 1
        
        # OUTPUT ON TERMINAL FOR CLICKS
        print(f"CLICK DETECTED! Total number of clicks for {short_id}: {click_counts[short_id]}")
        
        return redirect(long_url)
    
    return "<h1>404: Link Not Found</h1>", 404

if __name__ == '__main__':
    print("-----------------------------------------")
    print("URL Shortener Server is LIVE!")
    print("-----------------------------------------")
    app.run(debug=True)