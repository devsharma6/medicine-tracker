from models.medicine_model import collection

def add_medicine(request):
    data = request.json
    collection.insert_one(data)
    return {"msg": "Medicine Added"}

def get_medicines(userId):
    meds = list(collection.find({"userId": userId}, {"_id": 0}))
    return meds