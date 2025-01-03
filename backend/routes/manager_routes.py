from flask import Blueprint, request, jsonify
from services.manager_service import ManagerService

manager_bp = Blueprint('manager', __name__)

@manager_bp.route('/create-pool', methods=['POST'])
def create_pool():
    """
    Route to create a new pool managed by the manager.
    """
    try:
        data = request.json
        manager_id = data.get('manager_id')
        name = data.get('name')
        lanes = data.get('lanes')
        capacity = int(lanes) * 15
        general_price = data.get('general_price')
        training_price = data.get('training_price')

        if not (manager_id and name and capacity and general_price and training_price and lanes):
            return jsonify({'message': 'Missing required fields'}), 400

        message = ManagerService.create_pool(manager_id, name, capacity, general_price, training_price, lanes)
        return jsonify({'message': message}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@manager_bp.route('/delete-pool/<int:pool_id>', methods=['DELETE'])
def delete_pool(pool_id):
    """
    Route to delete a pool managed by the manager.
    """
    try:
        message = ManagerService.delete_pool(pool_id)
        return jsonify({'message': message}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
@manager_bp.route('/get-pools/<int:manager_id>', methods=['GET'])
def get_pools(manager_id):
    """
    Route to fetch all pools managed by a specific manager.
    """
    print(manager_id)
    try:
        # Fetch pools for the given manager
        pools = ManagerService.get_pools(manager_id)

        if not pools:
            return jsonify({'message': 'No pools found for this manager'}), 404

        return jsonify({'pools': pools}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@manager_bp.route('/create-membership', methods=['POST'])
def create_membership():
    """
    Route to create a new membership type for a pool managed by the manager.
    """
    try:
        data = request.json
        pool_id = data.get('pool_id')
        price = data.get('price')
        duration = data.get('duration')
        #print(pool_id,price,duration)
        # Validate required fields
        if not (pool_id and price and duration):
            return jsonify({'message': 'Missing required fields'}), 400

        # Call the service to create membership
        message = ManagerService.create_membership(pool_id, price, duration)

        return jsonify({'message': message}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@manager_bp.route('/set-prices', methods=['POST'])
def set_prices():
    """
    Route to set a price for a pool managed by the manager.
    Dynamically updates 'general_price' or 'training_price' based on the request.
    """
    try:
        data = request.json
        pool_id = data.get('pool_id')

        # Determine which attribute to update
        if "general_price" in data:
            attribute = "general_price"
            price = data["general_price"]
        elif "training_price" in data:
            attribute = "training_price"
            price = data["training_price"]
        else:
            return jsonify({'message': 'Either general_price or training_price must be provided'}), 400

        # Validate required fields
        if not pool_id:
            return jsonify({'message': 'Pool ID is required'}), 400

        if price is None:
            return jsonify({'message': f'{attribute} cannot be null'}), 400

        # Call the service method to update the price
        message = ManagerService.update_pool_price(pool_id, attribute, price)

        return jsonify({'message': message}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@manager_bp.route('/get-memberships/<int:manager_id>', methods=['GET'])
def get_memberships(manager_id):
    """
    Route to fetch all memberships for pools managed by a specific manager.
    """
    try:
        memberships = ManagerService.get_memberships(manager_id)  # Call the service method
        if not memberships:
            return jsonify({'message': 'No memberships found for this manager'}), 404

        return jsonify({'memberships': memberships}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@manager_bp.route('/delete-membership/<int:membership_id>', methods=['DELETE'])
def delete_membership(membership_id):
    """
    Route to delete a membership by its ID.
    """
    try:
        message = ManagerService.delete_membership(membership_id)  # Call the service method
        return jsonify({'message': message}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@manager_bp.route('/get-staffs/<int:manager_id>', methods=['GET'])
def get_staffs(manager_id):
    """
    Route to fetch all staff (coaches and lifeguards) managed by a specific manager.
    """
    try:
        # Call the service to fetch staff data
        staffs = ManagerService.get_staffs(manager_id)

        if not staffs:
            return jsonify({'message': 'No staff found for this manager'}), 404

        return jsonify({'staffs': staffs}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@manager_bp.route('/create-staff', methods=['POST'])
def create_staff():
    """
    Route to create a new staff account (Coach or Lifeguard) for a pool managed by the manager.
    """
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')  # Should be 'coach' or 'lifeguard'
        pool_id = data.get('pool_id')
        gender = data.get('gender')
        birth_date = data.get('birth_date')
        blood_type = data.get('blood_type')

        # Validate required fields
        if not (name and email and password and role and pool_id and gender and birth_date and blood_type):
            return jsonify({'message': 'Missing required fields'}), 400

        # Call the service to create staff
        message = ManagerService.create_staff(name, email, password, role, pool_id, gender, birth_date, blood_type)

        return jsonify({'message': message}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@manager_bp.route('/delete-staff/<int:staff_id>', methods=['PUT'])
def delete_staff(staff_id):
    """
    Soft delete a staff member by setting their pool_id to NULL.
    """
    try:
        data = request.json
        role = data.get("role")

        # Validate the role
        if not role or role.lower() not in ["coach", "lifeguard"]:
            return jsonify({'message': 'Invalid or missing role'}), 400

        # Call the service method to delete staff
        message = ManagerService.delete_staff(staff_id, role)
        return jsonify({'message': message}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

