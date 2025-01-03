from database.queries.class_queries import create_class, fetch_classes
from database.queries.class_queries import create_class, get_filtered_classes_query, add_class_to_cart_query
from database.queries.class_queries import get_unadded_classes
from database.queries.class_queries import cancel_class
from database.queries.class_queries import fetch_ready_classes

# Service to handle class creation
def create_new_class(class_data, coach_id):
    create_class(class_data, coach_id)

# Service to fetch all available classes
def get_all_classes():
    return fetch_classes()

def get_filtered_classes(filters, swimmer_id):
    return get_filtered_classes_query(filters, swimmer_id)

def add_class_to_cart(data):
    add_class_to_cart_query(data)

def fetch_classes_not_in_cart(swimmer_id):
    return get_unadded_classes(swimmer_id)  # Make sure get_unadded_classes is defined and tested

def cancel_class_by_id(class_id):
    cancel_class(class_id)

def get_ready_classes():
    return fetch_ready_classes()