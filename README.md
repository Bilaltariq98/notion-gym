# Gym analytics - notion integration 

This application will monitor a 'database' on notion.so that contains templates of different workouts and will extract weights for exercises. 

The goal is for this data to be processed to:
    - Calculate things like 1 rep max 
    - Visualize week by week exercise progression and inform (via twilio or bot on a messaging platform of some sort)

## Why am I using notion?

I like using notion as a means of tracking my exercise routines / progression as I train, thought it'd be an interesting idea to play with the idea of utilizing their [beta API](https://developers.notion.com/) to be able to send myself some alerting on my own progression.

## Current State

- Able to query the API against 

## To do

### Node Processing
- Store processed data in a DB
- Only query anything that has not yet been processed (using edited timestamps)

## Visualization & Alerting
- Experiment with approaches to visualizing data, interesting options: 
    - c3.js - Interacteive JavaScript on UI, send a link to UI via text / app of choice
    - image-charts -> Single API generates chart, send directly via mail / text
    - Seaborn -> Python Library, could use twilio to send myself a text

## Infrastructure
- Dockerize
- Utilize CI/CD + GitOps

# Configuring Notion 
TBD 

# Spinning up infrastructure
TBD