from database.queries.event_queries import create_event
from database.queries.event_queries import fetch_ready_events, add_attendance

def create_new_event(event_data):
    try:
        create_event(event_data)
    except Exception as e:
        raise Exception(f"Error in service while creating event: {e}")


def get_ready_events(swimmer_id):
    try:
        return fetch_ready_events(swimmer_id)
    except Exception as e:
        raise Exception(f"Error in service while fetching ready events: {e}")



def register_to_event(swimmer_id, event_id):
    try:
        add_attendance(swimmer_id, event_id)
    except Exception as e:
        raise Exception(f"Error in service while adding attendance: {e}")