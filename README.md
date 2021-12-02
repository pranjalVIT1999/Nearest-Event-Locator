# StepAway

## What is it?
StepAway is a close range event locator app. In other words, this web application allows users to input their preferred date and location to find recreational activities or locate fun-filled events immediately based on their current location. StepAway also assists the user in purchasing tickets for the event of their choosing on StubHub or SeatGeek if tickets are required in order to attend.

## Why did we create such a thing? 
Simple. Who doesn't love to have fun? Try out new experiences? Take the path less traveled? Sometimes you want to have a good time in a place you're a bit unfamilar with, that you didn't have the time to extensively research. The purpose of this app is to make spontaneity a bit easier for the average guy or gal in hopes that more people will choose to go on a small adventure in a new city on nothing but a whim. 

## How did we make it?
StepAway makes use of several different APIs to make recommendations to users. First, it utilizes the user's location (provided by the user themselves or determined through HTML5 geolocation) to query Eventful's API and get a list of local events. Second, it populates a list of these events for the user to peruse. Each item on the list has a corresponding pin marking its location on the adjoining map. As the list populates, the name and location of the event for each entry is used the query both the StubHub and SeatGeek APIs. If tickets are being sold for the event on these sites, the app provides a link so that the user may buy tickets right away. 

## Where do we plan to go from here?
 What features would we like to add to this application? I'm glad you asked. 
  * Include Google's Walking Directions 
      * Wouldn't it be great if we could tell users utilizing the mobile version of site exactly how to get to their event?
  * Display Distance to Each Venue 
      * We think it would be fantastic if we could help the user decide which event to go to by calculating how far each one was from his or her location and displaying that as part of the recommended events list.
  * Incorporate a Premium Feature: Find Events Internationally 
      * Super long layover and no set itinerary in Hong Kong? Up for some spontaneous shenanigans in Dublin? Our team would love to incorporate more APIs to enable users to find fun events wherever they are around the globe. 

## Whose cool idea is this? 
  * Stacy J.P.
  * Priya Polla 
  * Daniel Lewis 
  * Guillermo Cruz 
