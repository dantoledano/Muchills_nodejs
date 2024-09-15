# Muchills  🌍

## Muchila.  Hills.  Chills.

Muchills is a full-featured web application built using Node.js, Express, MongoDB, and various npm packages. It offers a seamless experience for users to explore, book, and review exciting tours around the world. 

## Live Demo 🌐

- **Note:** First load may take up to a minute due to free hosting. ⏳🥳
- Check out the live app: [Muchills](https://muchills.onrender.com)

## Key Features 📝

### 1. Authentication & Authorization: 🔒

- Sign up, log in, log out, password reset, and profile updates.
- Roles include Regular User, Admin, Lead Guide, and Guide.
  - New users are assigned the Regular User role by default.
  - Admins and Lead Guides have extended privileges for tour and booking management.


### 2. Tour Management 🏞️ 
   
- Admins and Lead Guides can:
  - Create new tours.
  - Update or delete existing tours.
- All users can:
  - View detailed tour information.
  - Check tour locations on interactive maps.
    

### 3. Booking System 🗺️
   
- Regular users can:
   - Book tours after logging in.
   - Manage bookings from the user profile page.
   - View and manage their previous bookings.
- Admin and Lead Guide capabilities:
   - View, edit, and delete bookings.
   - Manually create bookings without payment.
- Secure Payments: Integrated with Stripe for seamless credit card payments.
  

### 4. Review System ✍️
   
- Regular users can:
   - Write reviews for tours they have booked.
- Admin privileges:
   - Can delete any user review.
- Public visibility: All users can view reviews for each tour.


### 5. User Profile 👤

- Users can update:
   - Username
   - Profile picture
   - Email address
   - Password
- Access all bookings and manage user settings.


## Technologies and Tools 📦💻

- Node.js: Backend JavaScript runtime.
- Express: Web framework for handling routes and API.
- MongoDB & Mongoose: Database and ORM for data handling.
- Pug: Template engine for dynamic content rendering.
- Stripe: Payment processing for tour bookings.
- Leaflet: Displaying tour locations on maps.
- JWT (JSON Web Token): Secure user authentication.
- Nodemailer: Email notifications and password resets.
- Parcel: Asset bundler for frontend development.


## Demo 🖼️
  
  
![127 0 0 1_3000_](https://github.com/user-attachments/assets/ae48b485-98d0-4c7b-ba43-4c7454a97b60)
![127 0 0 1_3000_signup](https://github.com/user-attachments/assets/61db0b26-d82a-41bb-b95f-1a2cf73229af)
![127 0 0 1_3000_me](https://github.com/user-attachments/assets/9559657f-6383-483e-b743-02de561dd0ea)
![127 0 0 1_3000_tour_the-huayhuash (2)](https://github.com/user-attachments/assets/322fa342-781a-4bc7-898a-3a6ddfa2304a)
![127 0 0 1_3000_my-reviews](https://github.com/user-attachments/assets/2f4e880d-c8ac-40ea-b26e-6b2f65d5e206)
![checkout stripe com_c_pay_cs_test_a1ZpW2auYDhPkernJ3CDsHVYxMoEQFUbv6N0GOL9j29rrkPWE2dfgn67HA (2)](https://github.com/user-attachments/assets/6776bba5-ca07-491c-9a59-fb33741e97ff)

## How to Use
- Clone the repository
- Install dependencies:
   - npm install
- Set up environment variables: Create a .env file and contant me for details
  
- Run the application:
   - npm start
- Access the app at http://localhost:3000.

## Booking a Tour

- Login or Sign up.
- Browse available tours and select one.
- Proceed to checkout and use the following test card details:
- Card Number: 4242 4242 4242 4242
- Expiry Date: Any future date
- CVV: Any 3 digits

  
