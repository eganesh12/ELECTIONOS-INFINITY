@echo off
set CLOUDSDK_PYTHON=C:\Users\egane\AppData\Local\Programs\Python\Python311\python.exe
"%CLOUDSDK_PYTHON%" "C:\Users\egane\AppData\Local\Google\Cloud SDK\google-cloud-sdk\lib\gcloud.py" services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --project electionos-infinity-495213
