from flask import Flask, request, redirect, jsonify
import string
import random

app = Flask(__name__)

# This dictionary will act as our temporary Database
url_db = {}

def generate_short_id():
    """Creates a random 6-character code like 'xyz123'"""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(6))

"""POST API - TO STORE SHORT_URL AND LONG_URL IN DATABASE"""
@app.route('/shorten', methods=['POST'])
def shorten():
    data = request.get_json()
    long_url = data.get('url')
    
    if not long_url:
        return jsonify({"error": "Please provide a URL"}), 400

    # NEW LOGIC: Check if this long_url already exists in our database
    for existing_id, existing_url in url_db.items():
        if existing_url == long_url: 
            # If found, return the OLD short_id instead of making a new one
            return jsonify({
                "note": "URL already shortened!",
                "short_id": existing_id,
                "short_url": f"http://127.0.0.1:5000/{existing_id}"
            }), 200

    # If NOT found, proceed with creating a new one
    short_id = generate_short_id()
    url_db[short_id] = long_url

    print(f"ShortURL : {short_id} Corrospond to longURL-> {long_url}") 
    
    return jsonify({
        "short_id": short_id,
        "short_url": f"http://127.0.0.1:5000/{short_id}"
    }), 201

@app.route('/<short_id>', methods=['GET'])
def go_to_url(short_id):
    # 1. Look for the code in our "Database"
    long_url = url_db.get(short_id)
    
    if long_url:
        return redirect(long_url) # Send user to the real site
    return "URL Not Found", 404

if __name__ == '__main__':
    print("Server starting....!")
    app.run(debug=True)