#!/bin/sh -f

DOCKER_IMAGE_NAME=bkjeholt/mqtt-service-email
DOCKER_CONTAINER_NAME=hic-service-email

echo "------------------------------------------------------------------------"
echo "-- Run image:       $DOCKER_IMAGE_NAME:latest "

DOCKER_IMAGE=$(../SupportFiles/DockerSupport/get-latest-image-string.sh $DOCKER_IMAGE_NAME)

echo "------------------------------------------------------------------------"
echo "-- Remove docker container if it exists"
echo "-- Container:   $DOCKER_CONTAINER_NAME "
echo "------------------------------------------------------------------------"

docker rm -f $DOCKER_CONTAINER_NAME

echo "------------------------------------------------------------------------"
echo "-- Start container "
echo "-- Based on image: $DOCKER_IMAGE "
echo "------------------------------------------------------------------------"

docker run -d \
           --restart="always" \
           --link mqtt-broker:mqtt \
           --env SMTP_URL="smtp-url" \
           --env SMTP_PORT_NO="port-no" \
           --env SMTP_USER="mail-address" \
           --env SMTP_PWD="Lösenord" \
           --env EMAIL_LOCAL_ADDR="xxx <xxx@xxx.xx>" \
           --env EMAIL_MASTER_ADDR="xxx <xxx@xxx.xx>" \
           --name $DOCKER_CONTAINER_NAME \
           $DOCKER_IMAGE

#           --env SIMULATED_MODE="1" \
