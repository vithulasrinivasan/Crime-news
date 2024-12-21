from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from flask_cors import CORS
import json, os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configuration
UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///crime_entries.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# CrimeEntry Model
class CrimeEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    tags = db.Column(db.String(200))
    location = db.Column(db.String(200), nullable=False)
    persons_involved = db.Column(db.String(50), nullable=False)
    media_files = db.Column(db.Text) 

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'date': self.date,
            'time': self.time,
            'category': self.category,
            'tags': self.tags,
            'location': self.location,
            'personsInvolved': self.persons_involved,
            'media_files': json.loads(self.media_files) if self.media_files else []
        }

# Route to add new crime entry
@app.route('/entries', methods=['POST'])
@app.route('/entries', methods=['POST'])
def add_entry():
    try:
        # Extracting form data
        data = request.form.to_dict()
        print("Form Data:", data)

        # Handling uploaded media files
        media_files = []
        if 'mediaFiles' in request.files:
            for file in request.files.getlist('mediaFiles'):
                if file:
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(UPLOAD_FOLDER, filename)
                    file.save(file_path)
                    media_files.append(file_path)
        print("Media Files:", media_files)

        # Create a new CrimeEntry object
        new_entry = CrimeEntry(
            title=data.get('title', '').strip(),
            description=data.get('description', '').strip(),
            date=data.get('date', '').strip(),
            time=data.get('time', '').strip(),
            category=data.get('category', '').strip(),
            tags=data.get('tags', '').strip(),
            location=data.get('location', '').strip(),
            persons_involved=data.get('personsInvolved', '').strip(),
            media_files=json.dumps(media_files)
        )

        # Add to the database
        db.session.add(new_entry)
        db.session.commit()
        print("New Entry ID:", new_entry.id)

        return jsonify({'message': 'Entry added successfully', 'id': new_entry.id}), 201
    except Exception as e:
        # Rolling back in case of errors
        db.session.rollback()
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 400


# Route to get all crime entries
@app.route('/entries', methods=['GET'])
def get_entries():
    try:
        entries = CrimeEntry.query.all()
        entries_list = [entry.to_dict() for entry in entries]
        return jsonify(entries_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to get a single crime entry by ID
@app.route('/entries/<int:entry_id>', methods=['GET'])
def get_entry(entry_id):
    entry = CrimeEntry.query.get(entry_id)
    if entry:
        # Adding next/previous navigation
        prev_entry = CrimeEntry.query.filter(CrimeEntry.id < entry_id).order_by(CrimeEntry.id.desc()).first()
        next_entry = CrimeEntry.query.filter(CrimeEntry.id > entry_id).order_by(CrimeEntry.id.asc()).first()
        entry_data = entry.to_dict()
        entry_data['prev_id'] = prev_entry.id if prev_entry else None
        entry_data['next_id'] = next_entry.id if next_entry else None
        return jsonify(entry_data), 200
    else:
        return jsonify({'error': 'Entry not found'}), 404

# Route to serve uploaded media files
@app.route('/media/<path:filename>', methods=['GET'])
def serve_media(filename):
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception as e:
        return jsonify({'error': str(e)}), 404

# Initialize the database and create tables if they don't exist
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
