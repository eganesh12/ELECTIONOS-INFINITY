@echo off
set CLOUDSDK_PYTHON=C:\Users\egane\AppData\Local\Programs\Python\Python311\python.exe
"%CLOUDSDK_PYTHON%" "C:\Users\egane\AppData\Local\Google\Cloud SDK\google-cloud-sdk\lib\gcloud.py" config set account eganesh7997@gmail.com
"%CLOUDSDK_PYTHON%" "C:\Users\egane\AppData\Local\Google\Cloud SDK\google-cloud-sdk\lib\gcloud.py" run deploy electionos --source . --region us-central1 --allow-unauthenticated --port 8080 --project electionos-infinity-495213 --quiet
