import sys
import csv
import json
import os


def generate_fee_csv(data):
    rows = []

    for student in data:
        row = {
            
            'rollno': student.get('rollno', ''),
            'name': student.get('name', ''),
            'total_fee': student['fee_details'].get('total_fee', ''),
            'paid_amount': student['fee_details'].get('paid_amount', ''),
            'due_amount': student['fee_details'].get('due_amount', ''),
            'due_date': student['fee_details'].get('due_date', ''),
            'last_payment_date': student['fee_details'].get('last_payment_date', ''),
            'payment_status': student['fee_details'].get('payment_status', ''),
            'recurring_delays': student['fee_details'].get('recurring_delays', ''),
        }

        # Add previous due dates dynamically
      

        rows.append(row)

    # Define fieldnames dynamically based on the maximum number of previous due dates
    fieldnames = [
        'rollno', 'name', 'total_fee', 'paid_amount', 'due_amount', 'due_date',
        'last_payment_date', 'payment_status', 'recurring_delays',
       
    ]

    output_file = 'fee_report.csv'
    with open(output_file, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    return f"CSV file '{output_file}' created successfully."


if __name__ == '__main__':
    # Load JSON data from command-line arguments
    input_data = json.loads(sys.argv[1])
    result = generate_fee_csv(input_data)

    print(result)
