import schedule
import time
import threading
import logging
from datetime import datetime
from models.medicine_model import collection


def check_medicines():
    now = datetime.now().strftime("%H:%M")
    for med in collection.find():
        med_time = med.get("time")
        if not med_time:
            continue

        if isinstance(med_time, datetime):
            med_time = med_time.strftime("%H:%M")

        if med_time == now:
            name = med.get("name", "(unknown)")
            user_id = med.get("userId", "unknown")
            logging.info(f"💊 Reminder for user {user_id}: Take {name} at {med_time}")


def run_scheduler(interval_seconds=60):
    schedule.clear()
    schedule.every(interval_seconds).seconds.do(check_medicines)

    while True:
        schedule.run_pending()
        time.sleep(1)


def start_scheduler_in_background(interval_seconds=60):
    thread = threading.Thread(target=run_scheduler, args=(interval_seconds,), daemon=True)
    thread.start()
    return thread


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    run_scheduler()