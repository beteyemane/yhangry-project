# Set Menus App

## Overview

The Set Menus App is a platform for discovering curated menus from different cuisines. Users can filter menus based on cuisine types, view menu details, and adjust the number of guests for personalised pricing. The app supports pagination for easier browsing and has a simple yet effective UI for filtering and displaying menus.

## Features

- **Menu**: Browse various set menus, including details such as price, description, and image.
- **Cuisine Filters**: Filter menus by cuisine type.
- **Pagination**: Load menus in pages.
- **Guest Count**: Adjust the guest count to calculate the total price per person.
- **Responsive Design**: The application is designed to be responsive, ensuring smooth user experience on both desktop and mobile devices.

<img width="1133" alt="Screenshot 2025-01-11 at 16 20 13" src="https://github.com/user-attachments/assets/e168580f-8341-4cf3-a309-4e29ae267cba" />

## Installation

### Prerequisites

To run the app locally, ensure you have the following installed:

- **Node.js** (version 14 or above)
- **npm** (Node Package Manager)
- **PostgreSQL** (for the database)

### Steps

1. Clone the repository:

```
   git clone https://github.com/your-username/set-menus-app.git
   cd set-menus-app
```
2. Install the necessary dependencies:

```
  npm install
```

3. Set up your .env file with the following environment variables:

```
  DB_HOST=your-database-host
  DB_PORT=your-database-port
  DB_USER=your-database-username
  DB_PASSWORD=your-database-password
  DB_NAME=your-database-name
  REACT_APP_API_SET_MENUS_URL=http://localhost:5000/api/set-menus
```

### Setting up the Database

To run the project locally, you'll need a PostgreSQL database with the following setup:

. **Create a PostgreSQL database**: Ensure that PostgreSQL is installed locally and create a database named `your_database_name` or modify the configuration file to use a different database.

. **Create Tables**: You need to create two tables: `menus` and `cuisines`.

Here’s an example of the SQL commands to create the required tables:

```sql
-- Create cuisines table
CREATE TABLE cuisines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    number_of_orders INT DEFAULT 0
);

-- Create menus table
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_person DECIMAL(10, 2),
    number_of_orders INT DEFAULT 0,
    image VARCHAR(255),
    status BOOLEAN DEFAULT TRUE
);

-- Create a join table for many-to-many relationship
CREATE TABLE menu_cuisines (
    menu_id INT REFERENCES menus(id) ON DELETE CASCADE,
    cuisine_id INT REFERENCES cuisines(id) ON DELETE CASCADE,
    PRIMARY KEY (menu_id, cuisine_id)
);
```

4. You will then need to run the script that will fetch menus and cuisines data and populate your database:
  
``` 
npm run populate-menus
```

This will pull data from the API and insert it into your PostgreSQL database. You can check the tables in your database after the script runs to ensure data has been added correctly.

5. Start the development server:

```
npm start
```
The application will be accessible on http://localhost:3000 by default.

