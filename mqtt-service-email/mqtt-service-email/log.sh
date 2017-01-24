#!/bin/sh -f

CONTAINER=hic-service-email

echo "------------------------------------------------------------------------"
echo "-- Show log from executing container"
echo "------------------------------------------------------------------------"
echo ""
docker logs $CONTAINER 
