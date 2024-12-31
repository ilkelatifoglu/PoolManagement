from database.queries.class_queries import create_class, fetch_classes
from database.queries.class_queries import create_class, get_filtered_classes_query, add_class_to_cart_query

# Service to handle class creation
def create_new_class(class_data):
    create_class(class_data)

# Service to fetch all available classes
def get_all_classes():
    return fetch_classes()

def get_filtered_classes(filters):
    return get_filtered_classes_query(filters)

def add_class_to_cart(data):
    add_class_to_cart_query(data)