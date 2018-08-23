# Amusement park - finder

This is a [`Udacity`](https://eu.udacity.com/) project (Neighbourhood map) with som extra details added.
Im using Google Maps and Google Places to show the 20's closest amusement parks in users location or specific area choosen by user.

Project built with react.
Works on phones and has ARIA for best possible user experience.
Uses ServiceWorker to cache website.

## To get started

1. Download zip file (and package it up) or clone this repository.
2. Start your terminal and cd into the projects folder.
3. Install all project dependencies with `npm install`
4. Start the development server with `npm start`
	- If your browser dont start automatic then browse to `http://localhost:3000/`

The service worker is only implemented during production build! To run server with it:
- Do step 1 to 3 above if not already done it.
2. Create production build by typing `npm run build` in your terminal.
3. Start server with `serve build`
4. Open your browser and go to `http://localhost:5000/`

## Api's used
- Google Maps, [`documentation`](https://developers.google.com/maps/documentation/)
- Google Places, [`link`](https://cloud.google.com/maps-platform/places/)
- Unsplash, photo service. [`link`](https://unsplash.com/)

## React packages
- google-maps-react, [`link`](https://www.npmjs.com/package/google-maps-react)
- sort-by, [`link`](https://www.npmjs.com/package/sort-by)
- react-router-dom, [`link`](https://www.npmjs.com/package/react-router-dom)

## License: 
Free for private testing. For other idées please contact me.