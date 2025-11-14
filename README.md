"# HelloWorld-ReactNative" 

FoodHub - Interactive Menu Management App
FoodHub is a simple, single-screen application designed to demonstrate state management and role based access control in a React Native environment.
It simulates a restaurant menu system where users can switch between two primary roles: Client (for ordering) and Chef (for menu management). 

Key Features
 Role-Based Interface: The application adjusts its functionality and appearance based on the selected user role.
 Real-time Ordering: Clients can easily select or deselect items from the menu and proceed to checkout.
 Comprehensive Menu Management (Chef Tools): Chefs have a dedicated section for adding, editing, and removing menu items instantly.
 Guest Filtering: Clients can filter the entire menu by course (Starters, Main, Desserts, or All).
 Responsive Navigation: A persistent hamburger menu allows easy switching between the Welcome, Menu sections, and Checkout.

User Roles and Functionality
Client (Guest) Role
The client role is focused on viewing the menu and placing an order.
Screen & Purpose

Starters, Main, Desserts.	
The traditional menu view. Allows clients to toggle the Switch next to an item to add or remove it from their order list.

Guest Filter.
A consolidated menu view where clients can use buttons to filter the display by All Items, Starters, Main Course, or Desserts. Items can still be added/removed from the order list here.
Checkout.
Displays the list of selected items and the total price. Includes a button to Confirm & Pay (clearing the order).

Key Functions
renderChefTools(): Handles the UI and logic for adding, editing, and deleting items.
renderGuestFilter(): Manages the guest-facing filter buttons and displays the combined, filtered menu.
calculateAverage(): Calculates and formats the average price for a given list of menu items.
addMenuItem(), saveEdit(), removeItem(): Core CRUD (Create, Read, Update, Delete) functions for menu management.
toggleItem(): Function used by the client to add items to or remove items from the order list.



The youtube video
https://youtu.be/MI7vmQ3hBms


