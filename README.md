# Legacy - Family Tree Creator

**Legacy** is a family tree creator and visualization tool designed to help users explore, manage, and customize their ancestral data. By integrating a React frontend, MongoDB database, and a Node.js/Express backend, Legacy provides a smooth, user-friendly experience for building interactive family trees, editing member details, and performing CRUD (Create, Read, Update, Delete) operations on family data.

## Screenshots of the demo

<img width="1280" alt="homepage_img" src="https://github.com/user-attachments/assets/61984e8b-5812-48a7-b7a7-347a28fe51bc" />
<img width="1280" alt="create_tree_modal_img" src="https://github.com/user-attachments/assets/b66b4678-34ac-4bde-9c7c-b3f163dd067d" />
<img width="1280" alt="your_trees_img" src="https://github.com/user-attachments/assets/c827bc40-77cd-4950-a568-fd36855defda" />
<img width="1280" alt="rename_tree_img" src="https://github.com/user-attachments/assets/b69eb78f-6cbf-4914-8749-77574347c011" />
<img width="1280" alt="delete_tree_img" src="https://github.com/user-attachments/assets/3737c5c2-4dc3-4ea1-b768-6947551edea9" />
<img width="1280" alt="whole_tree_img" src="https://github.com/user-attachments/assets/9cd1edd7-6228-4da8-9288-bb28c1da59a9" />
<img width="1280" alt="member_details_img" src="https://github.com/user-attachments/assets/5cca463b-6c11-46ca-846d-66bacb11de08" />
<img width="1280" alt="add_parent_img" src="https://github.com/user-attachments/assets/db0e8338-67d8-4b95-8485-bb39672b7f17" />
<img width="1280" alt="add_spouse_img" src="https://github.com/user-attachments/assets/e7b0be1e-d313-4aa1-93e1-bdce21307c5a" />
<img width="1280" alt="add_sibling_img" src="https://github.com/user-attachments/assets/ddebf8e1-584c-41ad-9b38-737df447a0c6" />
<img width="1280" alt="add_child_img" src="https://github.com/user-attachments/assets/ee82b9fa-ed91-41b2-917c-9ec93e25da57" />
<img width="1280" alt="added_daughter_img" src="https://github.com/user-attachments/assets/0d2f4e64-9a65-4370-93f5-50e2d9906a6a" />
<img width="1280" alt="tree_with_subtree_img" src="https://github.com/user-attachments/assets/9c819383-f51f-4b8a-8e3d-bfc6c1ede958" />
<img width="1280" alt="subtree_img" src="https://github.com/user-attachments/assets/8bbb5203-61ee-4648-8895-1277487919cb" />
<img width="1280" alt="zoomout_and_drag_img" src="https://github.com/user-attachments/assets/775bacfc-4008-4ef5-bf47-7a7217fff1a6" />
<img width="1280" alt="zoom_in_img" src="https://github.com/user-attachments/assets/1a63f414-0c2c-4f92-a0cf-25144405fb59" />

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
