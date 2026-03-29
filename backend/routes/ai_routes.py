from flask import Blueprint, request, jsonify
from models.medicine_model import collection

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/suggest/<userId>", methods=["GET"])
def suggest(userId):
    meds = list(collection.find({"userId": userId}, {"_id": 0}))

    if len(meds) == 0:
        return {"msg": "No data for suggestions"}

    suggestions = []

    # Rule-based AI
    if len(meds) < 3:
        suggestions.append("⚠️ You have very few medicines scheduled")

    times = [m["time"] for m in meds]

    if "08:00" not in times:
        suggestions.append("🌅 Consider taking medicines in morning")

    if len(times) != len(set(times)):
        suggestions.append("⏰ Multiple medicines at same time detected")

    return jsonify(suggestions)