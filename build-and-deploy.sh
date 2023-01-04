#!/bin/sh
cd app

# Local build test
# gatsby build
# gatsby serve

gatsby build --prefix-paths
aws s3 sync public s3://apps.montanafreepress.org/capitol-tracker-2023 --delete
aws cloudfront create-invalidation --distribution-id E3LVPS3XLJHLL5 --paths \"/capitol-tracker-2023/*\",