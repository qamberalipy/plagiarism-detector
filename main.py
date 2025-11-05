from flask import Flask, render_template, request, jsonify
from modules.plagiarism_checker import PlagiarismChecker

app = Flask(__name__)

plagiarism = PlagiarismChecker(reference_path='reference.txt')

@app.route('/', methods=['GET'])
def home():
    """Render the main page"""
    return render_template('index.html')

@app.route('/api/plagiarism', methods=['POST'])
def plagiarism_api():
    """Perform plagiarism check on provided text"""
    data = request.get_json()
    text_input = data.get('text_input', '').strip() if data else ''
    
    if not text_input:
        return jsonify({"error": "Please provide text input"}), 400

    try:
        result = plagiarism.check(text_input)
        return jsonify({"status": "success", "result": result}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
