from database.queries.event_queries import create_event, fetch_manager_pools
from database.queries.event_queries import fetch_ready_events, add_attendance, cancel_event
from database.queries.event_queries import fetch_all_ready_events, fetch_event_types

def create_new_event(event_data, manager_id):
    try:
        create_event(event_data, manager_id)
    except Exception as e:
        raise Exception(f"Error in service while creating event: {e}")

def get_manager_pools(manager_id):
    try:
        return fetch_manager_pools(manager_id)
    except Exception as e:
        raise Exception(f"Error in service while fetching pools: {e}")
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
    
def cancel_event_by_id(event_id):
    cancel_event(event_id)

def get_all_ready_events():
    try:
        return fetch_all_ready_events()
    except Exception as e:
        raise Exception(f"Error in service while fetching all ready events: {e}")

def get_event_types():
    try:
        return fetch_event_types()
    except Exception as e:
        raise Exception(f"Error in service while fetching event types: {e}")