from database.connection import get_cursor, commit_db
from database.queries.manager_queries import *  # Assuming manager-related queries are stored here

class ManagerService:

    @staticmethod
    def create_pool(manager_id, name, capacity, general_price, training_price):
        """
        Create a new pool for a specific manager.
        """
        cursor = get_cursor()
        try:
            # Execute the query to create a pool
            cursor.execute(CREATE_POOL, (manager_id, name, capacity, general_price, training_price))
            commit_db()
            return "Pool created successfully."
        except Exception as e:
            print(f"Error creating pool for manager_id={manager_id}: {e}")
            raise

    @staticmethod
    def delete_pool(pool_id):
        """
        Delete a pool by its ID.
        """
        cursor = get_cursor()
        try:
            # Optionally, check if the pool exists before deleting
            cursor.execute(CHECK_POOL_EXISTS, (pool_id,))
            if cursor.fetchone() is None:
                return "Pool does not exist."

            # Execute the query to delete the pool
            cursor.execute(DELETE_POOL, (pool_id,))
            commit_db()
            return "Pool deleted successfully."
        except Exception as e:
            print(f"Error deleting pool with pool_id={pool_id}: {e}")
            raise

    @staticmethod
    def get_pools(manager_id):
        """
        Fetch all pools managed by a specific manager.
        """
        cursor = get_cursor()
        try:
            # Execute the query to fetch pools
            cursor.execute(GET_POOLS_BY_MANAGER, (manager_id,))
            
            # Fetch all results
            pools = cursor.fetchall()
            print(pools)
            return pools
        except Exception as e:
            print(f"Error fetching pools for manager_id={manager_id}: {e}")
            raise

    @staticmethod
    def create_membership(pool_id, price, duration):
        """
        Create a new membership for a specific pool.
        """
        cursor = get_cursor()
        try:
            if not (pool_id and price and duration):
                raise ValueError("Missing required membership fields.")

            # Execute the query to create a membership
            cursor.execute(CREATE_MEMBERSHIP, (pool_id, price, duration))

            # Commit the changes
            commit_db()

            return {"message": "Membership created successfully."}
        except Exception as e:
            print(f"Error creating membership: {e}")
            raise


    @staticmethod
    def update_pool_price(pool_id, attribute, price):
        """
        Update a specific price attribute (general_price or training_price) for a pool.
        """
        cursor = get_cursor()
        try:
            # Execute the query
            cursor.execute(UPDATE_POOL_PRICE.format(attribute=attribute), (price, pool_id))
            commit_db()
            
            return f"{attribute} updated successfully for pool_id={pool_id}."
        except Exception as e:
            print(f"Error updating {attribute} for pool_id={pool_id}: {e}")
            raise

    @staticmethod
    def get_memberships(manager_id):
        """
        Fetch all memberships for pools managed by a specific manager.
        """
        cursor = get_cursor()
        try:            
            cursor.execute(GET_MEMBERSHIPS, (manager_id,))
            memberships = cursor.fetchall()
            return memberships
        except Exception as e:
            print(f"Error fetching memberships for manager_id={manager_id}: {e}")
            raise

    @staticmethod
    def delete_membership(membership_id):
        """
        Deletes a membership by its ID.
        """
        cursor = get_cursor()
        try:
            # Check if the membership exists
            cursor.execute(CHECK_MEMBERSHIP, (membership_id,))
            membership = cursor.fetchone()
            if not membership:
                return "Membership not found."

            # Delete the membership
            cursor.execute(DELETE_MEMBERSHIP, (membership_id,))
            commit_db()  # Commit the transaction
            return "Membership deleted successfully."
        except Exception as e:
            print(f"Error deleting membership with ID={membership_id}: {e}")
            raise

    @staticmethod
    def get_staffs(manager_id):
        """
        Fetch all staff (coaches and lifeguards) managed by a specific manager.
        """
        cursor = get_cursor()
        try:
            # Query to fetch staff details
            
            cursor.execute(GET_STAFFS, (manager_id, manager_id))
            staffs = cursor.fetchall()
            print(staffs)
            return staffs
        except Exception as e:
            print(f"Error fetching staff for manager_id={manager_id}: {e}")
            raise

    @staticmethod
    def create_staff(name, email, password, role, pool_id):
        """
        Create a new staff account (Coach or Lifeguard) and associate it with the specified pool.
        """
        cursor = get_cursor()
        try:
            # Insert user into the 'user' table
            cursor.execute("""
                INSERT INTO user (name, email, password)
                VALUES (%s, %s, %s)
            """, (name, email, password))

            # Get the last inserted user_id
            user_id = cursor.lastrowid

            # Insert into the specific staff table
            if role == "coach":
                cursor.execute("""
                    INSERT INTO coach (coach_id, pool_id)
                    VALUES (%s, %s)
                """, (user_id, pool_id))
            elif role == "lifeguard":
                cursor.execute("""
                    INSERT INTO lifeguard (lifeguard_id, pool_id)
                    VALUES (%s, %s)
                """, (user_id, pool_id))
            else:
                raise ValueError("Invalid role provided. Must be 'coach' or 'lifeguard'.")

            # Commit the transaction
            commit_db()
            return "Staff account created successfully."
        except Exception as e:
            print(f"Error creating staff account: {e}")
            raise

    @staticmethod
    def delete_staff(staff_id, role):
        """
        Soft delete a staff member by setting their pool_id to NULL.
        """
        cursor = get_cursor()
        try:
            # Determine the table based on the role
            table_name = "coach" if role.lower() == "coach" else "lifeguard"

            # Update the staff's pool_id to NULL
            query = f"UPDATE {table_name} SET pool_id = NULL WHERE {table_name}_id = %s"
            cursor.execute(query, (staff_id,))
            commit_db()
            return "Staff member pool assignment removed successfully."
        except Exception as e:
            print(f"Error deleting staff member: {e}")
            raise

