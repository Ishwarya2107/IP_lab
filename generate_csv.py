import sys
import csv
import json
import os


def generate_csv(data):

    rows = []

    
    for student in data:
       
        for date, attendance in student['attendance_data'].items():
            row = {
                'date': date,
                'rollno': student['rollno'],
                'name': student['name'],
                'Mathematics_attendance': attendance['attendance'].get('Mathematics', 'Absent'),
                'Physics_attendance': attendance['attendance'].get('Physics', 'Absent'),
                'Chemistry_attendance': attendance['attendance'].get('Chemistry', 'Absent'),
                'Biology_attendance': attendance['attendance'].get('Biology', 'Absent'),
                'English_attendance': attendance['attendance'].get('English', 'Absent'),
                'attendance_summary': attendance['attendance_summary'],
                'overall_present_days': student['overall_attendance']['present_days'],
                'overall_absent_days': student['overall_attendance']['absent_days'],
                'overall_attendance_percentage': student['overall_attendance']['attendance_percentage']
            }
            rows.append(row)

    
    fieldnames = [
        'date', 'rollno', 'name', 'Mathematics_attendance', 'Physics_attendance', 'Chemistry_attendance',
        'Biology_attendance', 'English_attendance', 'attendance_summary', 'overall_present_days',
        'overall_absent_days', 'overall_attendance_percentage'
    ]

    
    output_file = 'report.csv'
    with open(output_file, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


   
    



if __name__ == '__main__':
    
    input_data = json.loads(sys.argv[1])
    result = generate_csv(input_data)

    print(result)  
