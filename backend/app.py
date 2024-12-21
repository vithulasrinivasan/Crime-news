from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS
from pymongo import MongoClient
import json, os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configuration
UPLOAD_FOLDER = "uploads/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# MongoDB Configuration
MONGO_URI = "mongodb+srv://avengerspidy476:0gOHuGf2HHr6xIz1@crime12.yqdvy.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client.crime_entries
entries_collection = db.entries


# Route to add new crime entry
@app.route("/entries", methods=["POST"])
def add_entry():
    try:
        # Extracting form data
        data = request.form.to_dict()
        print("Form Data:", data)

        # Handling uploaded media files
        media_files = []
        if "mediaFiles" in request.files:
            for file in request.files.getlist("mediaFiles"):
                if file:
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(UPLOAD_FOLDER, filename)
                    file.save(file_path)
                    media_files.append(file_path)
        print("Media Files:", media_files)

        # Create a new crime entry document
        new_entry = {
            "title": data.get("title", "").strip(),
            "description": data.get("description", "").strip(),
            "date": data.get("date", "").strip(),
            "time": data.get("time", "").strip(),
            "category": data.get("category", "").strip(),
            "tags": data.get("tags", "").strip(),
            "location": data.get("location", "").strip(),
            "persons_involved": data.get("personsInvolved", "").strip(),
            "media_files": media_files,
        }

        # Insert into MongoDB
        result = entries_collection.insert_one(new_entry)
        print("New Entry ID:", result.inserted_id)

        return (
            jsonify(
                {"message": "Entry added successfully", "id": str(result.inserted_id)}
            ),
            201,
        )
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 400


# Route to get all crime entries
@app.route("/entries", methods=["GET"])
def get_entries():
    try:
        entries = list(entries_collection.find())
        for entry in entries:
            entry["_id"] = str(entry["_id"])
        return jsonify(entries), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route to get a single crime entry by ID
@app.route("/entries/<string:entry_id>", methods=["GET"])
def get_entry(entry_id):
    from bson.objectid import ObjectId

    try:
        entry = entries_collection.find_one({"_id": ObjectId(entry_id)})
        if entry:
            entry["_id"] = str(entry["_id"])
            return jsonify(entry), 200
        else:
            return jsonify({"error": "Entry not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Route to serve uploaded media files
@app.route("/media/<path:filename>", methods=["GET"])
def serve_media(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception as e:
        return jsonify({"error": str(e)}), 404


if __name__ == "__main__":
    app.run(debug=True)
