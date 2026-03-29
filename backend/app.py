from flask import Flask
from flask_cors import CORS
from routes.medicine_routes import medicine_bp
from scheduler.reminder import start_scheduler_in_background

# ✅ Pehle app define karo
app = Flask(__name__)
CORS(app)

# ✅ Home route
@app.route("/")
def home():
    return "Medicine Tracker API Running 🚀"

# ✅ Blueprint
app.register_blueprint(medicine_bp, url_prefix="/api")

# ✅ Run server
if __name__ == "__main__":
    start_scheduler_in_background()
    app.run(debug=True)
from routes.auth_routes import auth_bp
app.register_blueprint(auth_bp, url_prefix="/auth")    
from routes.ai_routes import ai_bp
app.register_blueprint(ai_bp, url_prefix="/ai")