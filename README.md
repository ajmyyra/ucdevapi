# UpCloud development API

As UpCloud doesn't have dev API of their own and I don't want to DoS them when developing something, I've created my own based on UpCloud API docs and some tests with the production API.

If you find anything not working the same way as the actual API does, please report an issue, or even better, send a PR.

## Current status

This repository is in current development and features are added. Currently nothing works.

Current goal is a basic CRUD setup for servers, storages and IP addresses. Long-term plan is to support the whole API (firewall, backups, subaccounts etc), but as my time is limited, we're not getting there anytime soon. If you need a specific feature of the API, create an issue and I'll try to prioritise it.

## Is this running somewhere so I can play with it?

Once somewhat working, I'll be running the dev API under https://ucdevapi.myyrae.fi with UpCloud API version 1.2.3. Feel free to use it. Documentation can be found at https://www.upcloud.com/api/1.2.3/ .

## HOWTO

After cloning this repository, run 'npm install' no install the dependencies.

Dev API uses MySQL to store the data, so you'll need a working database.

You'll also need a config file at config/database.json including the configuration. Example can be found from config/database.json.example.


Same info is also needed at bin/setup-db.sh, with example at bin/setup-db.sh.example.

Once done, run 'npm '

## Disclaimer

I'm not working for UpCloud, and UpCloud doesn't officially endorse this dev API. Changes in the UpCloud API aren't immediately reflected in this dev API.
