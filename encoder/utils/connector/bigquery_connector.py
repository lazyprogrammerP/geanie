from io import BytesIO, StringIO
from typing import List
import csv

from dotenv import load_dotenv
from fastapi import  HTTPException
from fastapi import FastAPI, File, Request, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google.cloud import bigquery

load_dotenv(".env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"],
    allow_credentials=True,
)

@app.post("/big_query_injection")
async def insert_data_into_bigquery(dataset_id: str = Form(...), table_id: str = Form(...), csv_file: UploadFile = File(...)):
    # Initialize BigQuery client
    client = bigquery.Client()

    # Read the CSV file contents    
    csv_content = await csv_file.read()
    
    # Convert CSV content to StringIO object
    csv_stringio = StringIO(csv_content.decode('utf-8'))
    
    # Create BigQuery dataset reference
    dataset_ref = client.dataset(dataset_id)
    
    # Create BigQuery table reference
    table_ref = dataset_ref.table(table_id)
    
    # Check if the table exists
    try:
        table = client.get_table(table_ref)
    except Exception as e:
        # If the table doesn't exist, create it
        schema = []
        # Infer schema from the first row of CSV
        csv_reader = csv.reader(csv_stringio)
        header_row = next(csv_reader)
        for column_name in header_row:
            schema.append(bigquery.SchemaField(column_name, 'STRING'))
        
        # Create the table with inferred schema
        table = bigquery.Table(table_ref, schema=schema)
        table = client.create_table(table)

    # Insert data into the table
    csv_stringio.seek(0)  # Reset StringIO object to start
    data_to_insert = csv.DictReader(csv_stringio)
    errors = client.insert_rows(table, data_to_insert)
    if errors:
        print(f"Errors while inserting rows: {errors}")
        return {"error": "Data insertion failed."}
    else:
        print("Data inserted successfully.")
        return {"success": "Data inserted successfully."}