# 🧠 Plagiarism Detector (Flask Web App)

A Flask-based web application that detects plagiarism by comparing uploaded text files against a reference document.  
Built for educational and research purposes by **Qamber Ali**.

---

## 📋 Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation Guide](#installation-guide)
- [Creating a Virtual Environment](#creating-a-virtual-environment)
- [Installing Dependencies](#installing-dependencies)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Contact](#contact)

---

## 🧾 About
This project is a **Flask web application** that allows users to upload text files and check for plagiarism against a predefined `reference.txt` document.  
It performs lexical analysis to identify text overlap and provides a similarity percentage as output.

---

## 🚀 Features
✅ Upload a document (TXT format)  
✅ Compare content against `reference.txt`  
✅ Displays similarity score or matching text percentage  
✅ Simple and clean web interface (Flask + HTML + CSS)  
✅ Modular code structure for easy expansion  

---

## 🧱 Tech Stack
- **Backend:** Python, Flask  
- **Frontend:** HTML, CSS, Jinja2 Templates  
- **Environment:** Virtualenv  
- **Version Control:** Git & GitHub  

---

## ⚙️ Installation Guide

### Step 1: Clone this repository
```bash
git clone https://github.com/qamberalipy/plagiarism-detector.git
cd plagiarism-detector
```

---

### Step 2: Create a Virtual Environment
A virtual environment helps keep your dependencies isolated.

#### 🪟 On Windows
```bash
python -m venv venv
venv\Scripts\activate
```

#### 🐧 On Linux / macOS
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` appear at the start of your terminal prompt once activated.

---

### Step 3: Install Dependencies
All required Python packages are listed in `requirements.txt`.

```bash
pip install -r requirements.txt
```

If you don’t have `requirements.txt`, create one with the following:
```bash
Flask==3.0.3
scikit-learn==1.5.2
numpy
```

*(Adjust versions as per your environment.)*

---

### Step 4: Run the Flask Application
```bash
python main.py
```

After starting, you’ll see output similar to:
```
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
```

---

### Step 5: Open the Web Application
Open your browser and go to:

👉 **http://127.0.0.1:5000**

You’ll see the web interface for the plagiarism detector.

---

## 🗂️ Project Structure
```
plagiarism-detector/
│
├── modules/
│   ├── lexical_analyzer.py         # Handles text processing
│   ├── plagiarism_checker.py       # Compares input text with reference
│
├── static/
│   ├── css/
│   ├── js/
│
├── templates/
│   ├── index.html                  # Main UI page
│
├── reference.txt                   # Reference document to check plagiarism against
├── main.py                         # Flask entry point
├── requirements.txt                # Python dependencies
├── .gitignore                      # Files ignored by Git
└── README.md                       # Documentation
```

---

## 🧰 Usage
1. Launch the web app (`python main.py`)  
2. Upload your `.txt` file in the browser interface  
3. Click **Check Plagiarism**  
4. View the similarity score or results displayed on the page  

You can modify `reference.txt` with your own dataset or text to compare against.

---

## 💡 Future Improvements
🔹 Add PDF/DOCX file support  
🔹 Integrate NLP-based semantic similarity (e.g., cosine similarity, TF-IDF)  
🔹 Store reports in database (SQLite/PostgreSQL)  
🔹 Add a dashboard for multiple users  

---

## 📜 License
This project is open-source under the **MIT License**.  
You are free to use, modify, and distribute it with attribution.

---

## 👨‍💻 Contact
**Author:** Qamber Ali  
**GitHub:** [qamberalipy](https://github.com/qamberalipy)  
**Email:** (qamber246@gmail.com)  

---

> 💬 *"Developed with Flask for learning, research, and improving algorithmic analysis of plagiarism detection."*
