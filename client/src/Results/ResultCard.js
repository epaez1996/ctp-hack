import React, { useState, useEffect, useContext } from "react";
// import styled from "styled-components";
import { Text, Box, Image, Button, Badge } from "@chakra-ui/react";
import { CalendarIcon, AtSignIcon, AddIcon, LinkIcon } from "@chakra-ui/icons";
import Adventure from "../Images/Adventure.png";
import { format, fromUnixTime, parseISO } from "date-fns";
import axios from "axios";
import Context from "../Context";
import eventService from "../services/events";

//renders a card that displays events from api response
const ResultCard = ({ event }) => {
  //console.log("Properties: ", Object.getOwnPropertyNames(event));
  //console.log("Event page event", event);

  //Address
  let address = event.location.display_address.join(" ");
  //parse the date to a more readable format
  let dateString = event.time_start.substring(0, 10);
  let dateArr = dateString.split("-");
  dateArr.push(dateArr.shift());
  let parsedISODate = parseISO(event.time_start); //parse incoming ISO 8601 date and turn into Date object

  let ISODate = format(parsedISODate, "yyyy-M-dd h:mm aaaaa'm'"); //format Date object
  //console.log("example here: ", ISODate);

  //parse the time to a more readable format
  let timeString = event.time_start.substring(12, 19).split(":");
  // console.log("TimeString is ", timeString);
  let part;
  if (parseInt(timeString[0]) > 12) {
    part = "P.M";
  } else {
    part = "A.M";
  }
  timeString[0] = parseInt(timeString % 12).toString();
  timeString.push(part);
  let time = timeString.join(":");

  const { userObject, setUserObject, yelpEvents, setYelpEvents } =
    useContext(Context);

  useEffect(() => {
    axios
      .get("http://localhost:5000/getUser", { withCredentials: true })
      .then((response) => {
        setUserObject(response.data);
        console.log("userObject retrieved in ResultCard", userObject);
      })
      .catch((error) => console.log(error));
  }, []);

  const saveEvent = () => {
    const newEvent = {
      name: event.name,
      description: event.description,
      location: address,
      time_start: ISODate,
      category: event.category,
      is_free: event.is_free,
      business_id: event.business_id,
      id: userObject.id,
      image: event.image_url,
    };

    eventService
      .create(newEvent)
      .then((returnedEvent) => console.log("Returned event: ", returnedEvent));
  };

  return (
    <Box
      w="400px"
      mx="auto"
      bg="#071221"
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      mt="2rem"
      transition="0.5s all ease-out"
      _hover={{
        transform: "scale(1.05, 1.05)",
        boxShadow: "5px 5px 5px #00cba6",
      }}
    >
      {/* Some api responses don't have an image, if they don't make their image the default image */}
      {event.image_url ? (
        <Image
          width="100%"
          h="224px"
          fit="cover"
          objectPosition="center"
          src={event.image_url}
          alt="avatar"
          draggable="false"
        />
      ) : (
        <Image
          width="100%"
          h="220px"
          fit="cover"
          objectPosition="center"
          src={Adventure}
          alt="avatar"
          draggable="false"
        />
      )}

      <Box py={3} px={6} h="300px">
        <Text
          fontFamily="Archivo, sans-serif"
          fontSize=".8rem"
          fontWeight="bold"
          color="white"
          textAlign="center"
        >
          {event.name}
        </Text>
        <Text fontSize=".7rem" py={2} color="white" textAlign="center">
          {event.description}
        </Text>
        <Text fontSize=".8rem" py={2} color="white" textAlign="left">
          <CalendarIcon marginRight=".5rem" />
          {ISODate}
        </Text>
        <Text fontSize=".8rem" py={2} color="white" textAlign="left">
          <AtSignIcon /> {address}
        </Text>
        <Text fontSize=".8rem" py={2} color="white" textAlign="left">
          <LinkIcon mr=".5rem" />
          <a href={event.event_site_url} target="_blank" rel="noreferrer">
            Learn more
          </a>
        </Text>
        <Text mt=".3rem">
          <AddIcon color="white" mr=".5rem" />
          <Button
            onClick={saveEvent}
            bgColor="#00cba6"
            _hover={{ bgColor: "#00b795" }}
          >
            Add
          </Button>
        </Text>
      </Box>
    </Box>
  );
};

export default ResultCard;
