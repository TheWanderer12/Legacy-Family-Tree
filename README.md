# Legacy - Family Tree Creator

Legacy is a family tree creator and visualization tool designed to help users explore, manage, and customize their ancestral data. By integrating a React frontend, MongoDB database, and a Node.js/Express backend, Legacy provides a smooth, user-friendly experience for building interactive family trees, editing member details, and performing CRUD (Create, Read, Update, Delete) operations on family data.

Key Features
	•	Dynamic Tree Visualization:
Leverages react-family-tree and relatives-tree libraries for visualizing family trees in a responsive, zoomable interface.
	•	PinchZoomPan integration for intuitive tree navigation (zooming, panning, and dragging).
	•	Detailed nodes displaying each member’s basic info.
	•	MongoDB Integration:
Fetch, store, and update family trees in a MongoDB database. No reliance solely on static JSON files, making it easy to handle large and evolving datasets.
	•	CRUD Functionality:
Comprehensive server-side routes to add new family members, update existing ones, or remove them entirely. Manage relationships between nodes (parent, sibling, spouse, child) dynamically from the interface.
	•	Modular & Extensible Codebase:
Clear separation of concerns:
	•	server folder: Contains Express.js routes, Mongoose schemas, and all backend logic.
	•	src folder: Houses the React frontend, including components, pages, utilities, and styles.
	•	Editable Member Details:
Users can select a family member node to open a sidebar overlay (drawer) that allows:
	•	Editing personal info (name, surname, date of birth, description).
	•	Adding new relatives (parents, siblings, spouses, children) dynamically.
	•	Flexible Data Loading:
While the primary mode is fetching data from MongoDB, the project maintains the ability to load trees from local JSON files for quick testing or fallback scenarios.

Project Structure

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

Getting Started

Prerequisites
	•	Node.js (v14+)
	•	npm or yarn
	•	MongoDB instance running locally or remotely

Installation
	1.	Clone the repository:

git clone [https://github.com/YourUsername/legacy-family-tree.git](https://github.com/TheWanderer12/Legacy.git)
cd Legacy


	2.	Install dependencies for both frontend and backend:

# For server
cd server
npm install
# or yarn install

# For frontend
cd ../
npm install
# or yarn install


	3.	Create a .env file in server folder with MongoDB URI:

MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/FamilyDB?retryWrites=true&w=majority

Replace 'FamilyDB' with your database name.

Running the Project
	•	Backend:

cd server
npm run dev
# or yarn dev

This starts the Express server on a specified port (usually 5001).

	•	Frontend:

cd ..
npm start
# or yarn start

This launches the React app on http://localhost:3000 by default.

Using the App
	•	Home Page:
	•	Displays a welcome message and a “Create new Family Tree” button.
	•	YourTrees Page:
	•	Lists available family trees from MongoDB.
	•	Each tree card allows you to open that tree in the App page.
	•	Offers options to add a new tree, rename existing ones, or delete them.
	•	App Page:
	•	Visualizes the selected family tree using ReactFamilyTree and PinchZoomPan.
	•	Click on a family member node to open the Sidebar.
	•	Sidebar:
	•	Edit member details (name, surname, gender, dateOfBirth, description).
	•	Add new relations: parents, siblings, spouses, children.
	•	On save, changes are sent to the server for database updating.

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

Customization
	•	Styling:
Utilizes Tailwind CSS and module CSS files for components (e.g., FamilyNode.module.css, Sidebar.module.css).
	•	Types & Interfaces:
Defined in src/components/Types/types.ts.
Allows adding attributes to Node or Relation objects as needed.
	•	Local JSON Fallback:
While the main goal is to fetch from MongoDB, developers can load tree data from src/data/ folder for testing. Just uncomment the relevant imports in const.ts and pass them to the tree components.

Contributing
	•	Fork the repository.
	•	Create a new branch for your feature or bugfix.
	•	Make changes and test thoroughly.
	•	Submit a pull request, describing your changes in detail.

Contact

For questions or support, open an issue on the GitHub repository or contact the maintainers via email.

Thank you for using Legacy! I hope it helps you visualize, manage, and celebrate your family heritage.
