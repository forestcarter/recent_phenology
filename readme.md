# Biodiversity in Puebla

This project aims to provide a web platform to capture, analyze, and display biodiversity data in the state of Puebla, Mexico. This web platform provides an intuitive user interface for partners throughout the state to enter data collected via the MTP biodiversity monitoring technique. The site is live at
* [https//:biodiversidadpuebla.online](https//:biodiversidadpuebla.online)

### User Interface

The user interface was custom built to be intuitieve and user friendly. Existing data is autmoatically retieved to be editable. Extensive data verification is done automatically.
This section is under the 'Ingresar Datos' heading.


### Mapping
Spatial data mapping was done using Leaflet. This page also uses React to provide a responsive user experience. Javascript Fetch API is used to generate dynamic SQL queries. This section is under the 'Mostrar Mapas' heading.

### Database

All data is stored in a relationa database using postgreSQL. Spatial data is handled using the POSTGIS extension.  

### Development and Framework

Laravel was used to scaffold the views using Blade and PHP. 


### Server

The website runs on a Debian 9 (Stretch) droplet from Digial Ocean. Encryption is done using LetsEncrypt and Certbot. Apache serves the site to the web. 




 

## Authors

* **Forest Carter** - *Developer* - [Forest Carter](https://github.com/forestcarter)
