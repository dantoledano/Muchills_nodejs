
#🌍 Muchills - Muchils.  Hiils.  Chills
Muchills is a full-featured web application built using Node.js, Express, MongoDB, and various npm packages. It offers a seamless experience for users to explore, book, and review exciting tours around the world. Whether you're an avid traveler or a first-time adventurer, Tourify has something for everyone.

##Key Features 📝
1. Authentication & Authorization
Sign up, log in, log out, password reset, and profile updates.
Roles include Regular User, Admin, Lead Guide, and Guide.
New users are assigned the Regular User role by default.
Admins and Lead Guides have extended privileges for tour and booking management.
2. Tour Management
Admins and Lead Guides can:
Create new tours.
Update or delete existing tours.
All users can:
View detailed tour information.
Check tour locations on interactive maps.
3. Booking System
Regular users can:
Book tours after logging in.
Manage bookings from the user profile page.
View and manage their previous bookings.
Admin and Lead Guide capabilities:
View, edit, and delete bookings.
Manually create bookings without payment.
Secure Payments: Integrated with Stripe for seamless credit card payments.
4. Review System
Regular users can:
Write reviews for tours they have booked.
Edit or delete their own reviews.
Submit only one review per tour.
Admin privileges: Can delete any user review.
Public visibility: All users can view reviews for each tour.
5. Favorite Tours
Users can add their favorite tours from their bookings.
Manage favorite tours by adding/removing them from a personalized list.
6. User Profile
Users can update:
Username
Profile picture
Email address
Password
Access all bookings and manage user settings.
##📦 Technologies and Tools
Node.js: Backend JavaScript runtime.
Express: Web framework for handling routes and API.
MongoDB & Mongoose: Database and ORM for data handling.
Pug: Template engine for dynamic content rendering.
Stripe: Payment processing for tour bookings.
Mapbox: Displaying tour locations on maps.
JWT (JSON Web Token): Secure user authentication.
Nodemailer: Email notifications and password resets.
Parcel: Asset bundler for frontend development.
