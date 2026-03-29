from flask import Blueprint, request, jsonify
from controllers.medicine_controller import add_medicine, get_medicines

medicine_bp = Blueprint("medicine", __name__)

@medicine_bp.route("/add", methods=["POST"])
def add():
    return add_medicine(request)

@medicine_bp.route("/get/<userId>", methods=["GET"])
def get(userId):
    return get_medicines(userId)
@medicine_bp.route("/delete/<userId>/<name>", methods=["DELETE"])
def delete(userId, name):
    from models.medicine_model import collection
    collection.delete_one({"name": name, "userId": userId})
    return {"msg": "Deleted"}
@medicine_bp.route("/update/<old_name>", methods=["PUT"])
def update(old_name):
    from models.medicine_model import collection
    data = request.json

    collection.update_one(
        {"name": old_name},
        {"$set": {"name": data["name"], "time": data["time"]}}
    )

    return {"msg": "Updated"}