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
           --env SMTP_URL="send.one.com" \
           --env SMTP_PORT_NO="465" \
           --env SMTP_USER="hic@kjeholt.se" \
           --env SMTP_PWD="DF8-ygP-6Mp-otE" \
           --env EMAIL_LOCAL_ADDR="Home Information Center <hic@kjeholt.se>" \
           --env EMAIL_MASTER_ADDR="Björn Kjeholt <bjorn@kjeholt.se>" \
           --name $DOCKER_CONTAINER_NAME \
           $DOCKER_IMAGE

#           --env SIMULATED_MODE="1" \
