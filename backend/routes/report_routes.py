from flask import Blueprint, request, jsonify
from services.report_service import ReportService

report_bp = Blueprint('report', __name__)

@report_bp.route('/generate', methods=['POST'])
def generate_report():
    try:
        data = request.json
        #print(data)
        # Extract input data
        administrator_id = data.get('administrator_id')
        report_id = data.get('report_id')
        date = data.get('date')

        # Validate required fields
        if not (administrator_id and report_id and date):
            return jsonify({'message': 'Missing required fields'}), 400

        # Generate the system report
        message = ReportService.generate_system_report(
            administrator_id=administrator_id,
            report_id=report_id,
            date=date,
        )

        return jsonify({'message': message}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@report_bp.route('/reports/<int:administrator_id>', methods=['GET'])
def get_reports(administrator_id):
    try:
        # Fetch reports for the given administrator
        reports = ReportService.get_system_reports(administrator_id)

        if not reports:
            return jsonify({'message': 'No reports found for the given administrator'}), 404

        return jsonify({'reports': reports}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
