from database.queries.event_queries import create_event

def create_new_event(event_data):
    try:
        create_event(event_data)
    except Exception as e:
        raise Exception(f"Error in service while creating event: {e}")
