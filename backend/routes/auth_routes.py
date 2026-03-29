from flask import Blueprint, request, jsonify
from models.user_model import users

auth_bp = Blueprint("auth", __name__)

# Signup
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json

    if users.find_one({"email": data["email"]}):
        return {"msg": "User already exists"}

    users.insert_one(data)
    return {"msg": "Signup successful"}

# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    user = users.find_one({
        "email": data["email"],
        "password": data["password"]
    })

    if user:
        return {"msg": "Login successful", "userId": str(user["_id"])}
    else:
        return {"msg": "Invalid credentials"}