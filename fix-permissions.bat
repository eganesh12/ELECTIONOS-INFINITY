@echo off
set CLOUDSDK_PYTHON=C:\Users\egane\AppData\Local\Programs\Python\Python311\python.exe
set GCLOUD="%CLOUDSDK_PYTHON%" "C:\Users\egane\AppData\Local\Google\Cloud SDK\google-cloud-sdk\lib\gcloud.py"

REM Get project number and grant required roles to default compute service account
%GCLOUD% projects add-iam-policy-binding electionos-infinity-495213 --member="serviceAccount:626471357617-compute@developer.gserviceaccount.com" --role="roles/storage.admin" --quiet
%GCLOUD% projects add-iam-policy-binding electionos-infinity-495213 --member="serviceAccount:626471357617-compute@developer.gserviceaccount.com" --role="roles/cloudbuild.builds.builder" --quiet
%GCLOUD% projects add-iam-policy-binding electionos-infinity-495213 --member="serviceAccount:626471357617@cloudbuild.gserviceaccount.com" --role="roles/storage.admin" --quiet
%GCLOUD% projects add-iam-policy-binding electionos-infinity-495213 --member="serviceAccount:626471357617@cloudbuild.gserviceaccount.com" --role="roles/run.admin" --quiet
