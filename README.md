# LogiTrack

# Explanatory Video: [LogiTrack](https://www.loom.com/share/3fd2d981f02b41048a87f2f1bc292d16?sid=4b65da30-2c73-4743-8366-33c74701c4c9)

## Overview
**LogiTrack** is a highly scalable logistics platform that connects users in need of transportation services for goods with a network of drivers. Designed for a global audience, the platform provides seamless booking, real-time vehicle tracking, and transparent pricing. Built to handle up to 10,000 requests per second, LogiTrack supports a user base of 50 million users and 100,000 drivers, ensuring efficient coordination across a large network.

---

## Key Features

<!-- image of data flow diagram -->
![Data Flow Diagram](https://drive.google.com/uc?export=view&id=1qw-3IMfUf6r22Wu2NSuSHDA26p9fwNo2&output=embed)
### User Features
- **Booking Service**  
  Users can book multiple vehicles for transporting goods, providing details like pickup location, drop-off location, vehicle type, and an estimated cost.
- **Real-Time Tracking**  
  Once a vehicle is booked, users can track the driver’s location in real-time.
- **Price Estimation**  
  LogiTrack offers upfront price estimates based on factors like distance, vehicle type, weather, day time and demand.

### Driver Features
- **Job Assignment**  
  Drivers receive and accept booking requests, allowing them to view pickup, drop-off locations, estimated price, estimated distance and start the booking.
- **Job Status Updates**  
  Drivers can update the status of the booking, such as en route to pickup, goods collected, delivered or cancelled.
  User can also cancel the booking until the item is not picked.

### Admin Features
- **Fleet Management**  
  Admins manage vehicle availability, monitor driver activity, change driver from vehicles, add/remove driver/vehicle and access booking data for operational oversight.
- **Data Analytics**  
  Basic analytics allow admins to track metrics like completed trips, average trip times, most used vehicle types and driver performance.

---

## System Design

<!-- image of architecture -->
![Architecture Design](https://drive.google.com/uc?export=view&id=1-mXkEdI_ikrihqudvvs-IDLUmIT3qAJg&output=embed)

### Scalability
- **Concurrent Request Handling**  
  LogiTrack can handle 10,000 concurrent requests per second by leveraging load balancing, micro service architecture, and caching.
- **Database Distribution**  
  Designed with a distributed database architecture to support the high volume of users and drivers globally.

### Real-Time Data and GPS Tracking
- **Efficient Tracking System**  
  Manages real-time GPS data to allow thousands of users to track their drivers without overloading the system and it also utilises kafka for efficient db updates.

### Database Schema
- **Optimized Data Structure**  
  A database schema designed for user, driver, booking, vehicle, and tracking data, with optimized handling of high-frequency updates.

### Matching Algorithm
- **Driver-User Matching**  
  A matching system that connects users with available drivers based on proximity, vehicle type, and availability, handling thousands of concurrent requests.

### Pricing Model
- **Dynamic Pricing**  
  Pricing is calculated based on variables like distance, vehicle size, demand, and location, with support for surge pricing during peak times.

---

## Technology Stack
- **Frontend**: React, TypeScript
- **Backend**: Node.js, NestJS
- **Database**: MongoDB, Redis
- **Messaging**: Kafka for event-driven communication
- **Cloud Providers**: AWS for scalability and distribution
- **APIs**: OpenRouteService for route optimization, Leaflet Maps for location services, OpenWeatherApi for weather data, Razorpay for payment gateway

---

## Getting Started


### Installation
1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Run the frontend server using `npm run dev`.

### Contributing
We welcome contributions to improve the LogiTrack platform! To contribute:

1. Fork the repository.
2. Create a new branch (git checkout -b feature/feature-name).
3. Commit your changes (git commit -am 'Add new feature').
4. Push to the branch (git push origin feature/feature-name).
5. Open a pull request describing your changes.