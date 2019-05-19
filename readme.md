# Recent Phenology

This project began as a way to inform herbicide application decisions at Saguaro National Park. Land managers use herbicide to kill invasive buffelgrass, which must be targeted right after the first green-up in the spring. EMODIS data provides recent NDVI data that be used to see where green-up has occurred, and to what degree. This web app shows NDVI difference data that highlights areas that have experienced dramatic NDVI change in the last few weeks.
The site is live at
* [https//:recentphenology.com](https//:recentphenology.com)

### User Interface

The user interface provides several NDVI difference layers and two basemaps, as well as time-series of NDVI values displayed as in a bar graph. 


### Mapping
EMODIS data is subtracted from subsequent weeks and shown as raster layers with resolutions of 250km.

### Database

All data is stored in a relational database using PostgreSQL. Spatial data is handled using the POSTGIS extension. 

### Development and Framework

Laravel was used to scaffold the views using Blade and PHP. 

### Server

The website runs on a Debian 9 (Stretch) droplet from Google Cloud Platform Encryption is done using LetsEncrypt and Certbot. Apache serves the site to the web. 

## Authors

* **Forest Carter** - *Developer* - [Forest Carter](https://github.com/forestcarter)
