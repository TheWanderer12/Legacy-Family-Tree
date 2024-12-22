# Legacy - Family Tree Creator

**Legacy** is a family tree creator and visualization tool designed to help users explore, manage, and customize their ancestral data. By integrating a React frontend, MongoDB database, and a Node.js/Express backend, Legacy provides a smooth, user-friendly experience for building interactive family trees, editing member details, and performing CRUD (Create, Read, Update, Delete) operations on family data.

## Screenshots of the demo

<img width="1280" alt="homepage_img" src="https://github.com/user-attachments/assets/a8fdc5bf-dad8-4e52-9b10-487bde8ffa47" />
<img width="1280" alt="create_tree_modal_img" src="https://github.com/user-attachments/assets/85e6421a-3ee3-41a3-bf46-b53a7a118974" />
<img width="1280" alt="your_trees_img" src="https://github.com/user-attachments/assets/f116cffb-f770-4062-83f5-6d1dc1edab24" />
<img width="1280" alt="rename_tree_img" src="https://github.com/user-attachments/assets/63f86994-d182-4927-a4c7-e5103e35aeea" />
<img width="1280" alt="delete_tree_img" src="https://github.com/user-attachments/assets/a6ad923a-64ed-48b4-9d2e-ec408966043a" />
<img width="1280" alt="whole_tree_img" src="https://github.com/user-attachments/assets/5d8ad269-2004-46bb-9231-f84f1415b032" />
<img width="1280" alt="member_details_img" src="https://github.com/user-attachments/assets/94a40928-0ef3-449b-a16c-c25894113b60" />
<img width="1280" alt="add_parent_img" src="https://github.com/user-attachments/assets/40e5ec54-1f38-4cd7-ac36-763326748392" />
<img width="1280" alt="rel_select_img" src="https://github.com/user-attachments/assets/f73d46c2-5689-4fc0-868e-b0762b88732a" />
<img width="1280" alt="add_spouse_img" src="https://github.com/user-attachments/assets/b9dc5bbc-778f-4330-99fa-ed79eb7ed76f" />
<img width="1280" alt="add_sibling_img" src="https://github.com/user-attachments/assets/eaacef47-15ac-48ad-b015-b15c197db789" />
<img width="1280" alt="add_child_img" src="https://github.com/user-attachments/assets/ef7db8ae-30eb-4eb2-9ac2-cddba84ac93e" />
<img width="1280" alt="added_son_img" src="https://github.com/user-attachments/assets/ed7c1a35-aa08-425d-9bf3-259655a55c30" />
<img width="1280" alt="tree_with_subtree_img" src="https://github.com/user-attachments/assets/ad865445-3a14-4baf-beb6-e1853c0520fd" />
<img width="1280" alt="subtree_img" src="https://github.com/user-attachments/assets/f7286b81-0b4c-4f09-90bd-bcd49ff69fa7" />
<img width="1280" alt="zoomout_and_drag_img" src="https://github.com/user-attachments/assets/cafd7bf9-a7f8-43df-9e36-c6b45c3ab5b6" />
<img width="1280" alt="zoom_in_img" src="https://github.com/user-attachments/assets/ca5e545a-2e76-4d40-8fa9-d434139a8338" />

## Key Features

- **Dynamic Tree Visualization**:  
  Leverages [react-family-tree](https://github.com/sanichkotikov/react-family-tree) and [relatives-tree](https://github.com/sanichkotikov/relatives-tree) libraries for visualizing family trees in a responsive, zoomable interface.  
  - **PinchZoomPan** integration for intuitive tree navigation (zooming, panning, and dragging).
  - Detailed nodes displaying each member’s basic info.
  
- **MongoDB Integration**:  
  Fetch, store, and update family trees in a MongoDB database. No reliance solely on static JSON files, making it easy to handle large and evolving datasets.

- **CRUD Functionality**:  
  Comprehensive server-side routes to add new family members, update existing ones, or remove them entirely. Manage relationships between nodes (parent, sibling, spouse, child) dynamically from the interface.

- **Modular & Extensible Codebase**:  
  Clear separation of concerns:
  - **`server` folder**: Contains Express.js routes, Mongoose schemas, and all backend logic.
  - **`src` folder**: Houses the React frontend, including components, pages, utilities, and styles.
  
- **Editable Member Details**:  
  Users can select a family member node to open a sidebar overlay that allows:
  - Editing personal info (name, surname, date of birth, description).
  - Adding new relatives (parents, siblings, spouses, children) dynamically.
  
- **Flexible Data Loading**:  
  While the primary mode is fetching data from MongoDB, the project maintains the ability to load trees from local JSON files for quick testing or fallback scenarios.

## Project Structure

```
.
├── server/
│   ├── src/
│   │   ├── models/FamilyTree.ts      # Mongoose schema for family members and trees
│   │   ├── routes/familyTrees.ts     # Express routes for CRUD operations on family data
│   │   ├── index.ts                  # Server entry point, middleware, and MongoDB connection
│   │   └── ... additional backend files ...
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                          # MongoDB connection URI and other secrets
│
├── src/
│   ├── components/
│   │   ├── App/                      # App.tsx and styles for main tree rendering
│   │   ├── FamilyNode/               # Component to render each family member's node
│   │   ├── PinchZoomPan/             # Component for handling tree zoom & pan interactions
│   │   ├── Sidebar/                  # Sidebar.tsx & styles for editing member details & relations
│   │   ├── Types/                    # types.ts for Node & Relationship interfaces
│   │   ├── Header.tsx                # Header component with site title and navigation
│   │   ├── const.ts                  # Imports & constants, including sample trees data
│   │   └── ...
│   │
│   ├── data/                         # Local JSON files for testing & fallback tree data
│   ├── pages/
│   │   ├── Home.tsx                  # Home page with introduction & Create Tree button
│   │   ├── YourTrees.tsx             # Lists available trees from the database, navigate to App
│   │   └── ...
│   ├── router/
│   │   └── routes.tsx                # Client-side routing logic (Home, YourTrees, App)
│   ├── assets/
│   │   └── pictures/                 # Images for the homepage and other visuals
│   ├── index.css
│   ├── index.tsx                     # Frontend entry point
│   └── ...
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── ...
```
## Getting Started

### Prerequisites

- **Node.js** (v14+)
- **npm** or **yarn**
- **MongoDB** instance running locally or remotely

### Installation

1. **Clone the repository**:

```
git clone https://github.com/YourUsername/legacy-family-tree.git
cd legacy-family-tree
```

2. **Install dependencies for both frontend and backend**:

### For server
```
cd server
npm install
```
or yarn install

### For frontend
```
cd ../
npm install
```
or yarn install

3.	**Create a .env file in server folder with MongoDB URI**:
#### Get MongoDB URI from your MongoDB Atlas
Create your own MongoDB database online in MongoDB Atlas, create a cluster, then in it create a database and a collection where you will store the data and point to the project. Then, in the Overview, click `Connect`, from `Drivers`, choose `Node.js` driver and find your connection string:
```
MONGO_URI=mongodb+srv://<user>:<db_password>@cluster0.mongodb.net/FamilyDB?retryWrites=true&w=majority
```
Replace `<user>` with your username.
Replace `<db_password>` with your password.
Replace `cluster0` with your cluster name.
Replace `FamilyDB` with your **database name**.

`<user>` and cluster name will be provided upon clicking `Connect` while in a cluster on MongoDB atlas; however, you have to **make sure you include the <u>database name</u>** after the slash.

## Running the Project
### Backend:
```
cd server
npm run dev
```
or yarn dev

This starts the Express server on a specified port (usually 5001).

### Frontend:
```
cd ..
npm start
```
or yarn start

This launches the React app on http://localhost:3000 by default.

## Using the App
- **Home Page**:
  - Displays a welcome message and a “Create new Family Tree” button.
- **YourTrees Page**:
  - Lists available family trees from MongoDB.
  - Each tree card allows you to open that tree in the App page.
  - Offers options to add a new tree, rename existing ones, or delete them.
- **App Page**:
  - Visualizes the selected family tree using ReactFamilyTree and PinchZoomPan.
  - Click on a family member node to open the Sidebar.
- **Sidebar**:
  - Edit member details (name, surname, gender, dateOfBirth, description).
  - Add new relations: parents, siblings, spouses, children.
  - On save, changes are sent to the server for database updating.
CRUD Operations
	•	Add a Member:
Through Sidebar, select “Add Parent/Sibling/Spouse/Child”.
The server handles the logic via /api/family-trees/:treeId/members (POST) and /api/family-trees/:treeId/members/:memberId/relation (POST) routes.
	•	Update a Member:
Editing details in Sidebar triggers a PUT request to /api/family-trees/:treeId/members/:memberId.
	•	Delete a Member:
Deletion is triggered from YourTrees or possibly a button inside Sidebar, calling DELETE on /api/family-trees/:treeId/members/:memberId.
	•	Add Relationship:
For parent addition, if one parent exists, the new parent is automatically related as that parent’s spouse too. The server code in familyTrees.ts handles copying ids and types between arrays to maintain consistency. Similar logic applies to siblings, spouses, and children.

## Customization
#### Styling:
Utilizes Tailwind CSS and module CSS files for components (e.g., FamilyNode.module.css, Sidebar.module.css).
#### Types & Interfaces:
Defined in src/components/Types/
- types.ts
- react-family-tree.d.ts

Allows adding attributes to Node or Relation objects as needed.
#### Local JSON Fallback:
While the main goal is to fetch from MongoDB, developers can load tree data from src/data/ folder for testing. Just uncomment the relevant imports in const.ts and pass the `members` array as `nodes` prop to `ReactFamilyTree` component.

## Contributing
- Fork the repository.
- Create a new branch for your feature or bugfix.
- Make changes and test thoroughly.
- Submit a pull request, describing your changes in detail.

## Contact

For questions or support, open an issue on the GitHub repository.

Thank you for using Legacy! I hope it helps you visualize, manage, and celebrate your family heritage.

## Modules by Sanich Kotikov
* [pinch-zoom-pan](https://www.npmjs.com/package/pinch-zoom-pan)
* [react-family-tree](https://www.npmjs.com/package/react-family-tree)
* [relatives-tree](https://www.npmjs.com/package/relatives-tree)

Big thanks to Sanich Kotikov for creating these libraries. They were very useful for my project.
Github profile of Sanich Kotikov: [Sanich Kotikov](https://github.com/SanichKotikov)
