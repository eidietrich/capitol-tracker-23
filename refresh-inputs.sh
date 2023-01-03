#!/bin/sh
# Updates dynamic inputs

# inputs/lawmakers/ (roster, district info etc.) should be static

# Check standalone Strapi CMS for manual bill/lawmaker annotations
node inputs/annotations/fetch.js

# Check MTFP website CMS for stories associated with particular bills/lawmakers
node inputs/coverage/fetch.js

# Check laws-interface repo for bill/vote info pulled from official legislative system
node inputs/laws/fetch.js
