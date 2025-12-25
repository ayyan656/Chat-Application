🚀 Realtime Chat Application
A high-performance, secure realtime messaging platform built with the MERN Stack. This project demonstrates full-stack proficiency, focusing on low-latency communication and secure authentication.

🛠 Tech Stack
Frontend: React.js, Tailwind CSS, Framer Motion (for fluid UI)

Backend: Node.js, Express.js

Realtime: Socket.io / WebSockets

Database: MongoDB

Authentication: Google OAuth 2.0 / JWT

🔐 Security & Best Practices (Important)
As a developer, I prioritize the security of user data and system integrity:

Environment Secret Management: Implemented strict .gitignore policies to ensure sensitive credentials (OAuth keys, DB URI) are never exposed in version control.

Secure Authentication: Utilizes Google OAuth for verified user access and JWT for session management.

Input Sanitization: All user-generated messages are sanitized to prevent XSS (Cross-Site Scripting) attacks.

CORS Configuration: Backend is configured with specific origins to prevent unauthorized API requests.

🚀 Key Features
Instant Messaging: Realtime communication with minimal latency using Socket.io.

Presence Status: See who is online/offline in real-time.

Responsive UI: Fully optimized for mobile, tablet, and desktop views.

Persistent Storage: All chat history is stored securely in MongoDB.

⚙️ Installation & Setup
Clone the repository:



git clone https://github.com/ayyan656/Chat-Application.git
Install dependencies:



# For backend
cd server && npm install
# For frontend
cd client && npm install



MONGO_URI
JWT_SECRET
EMAIL_USER
EMAIL_PASS
EMAIL_HOST
EMAIL_PORT=587
PORT=3000
Run the app:



npm run dev

👨‍💻 Author
Ayyan

Portfolio: https://ayyan-dev.vercel.app/

LinkedIn: linkedin.com/in/syed-ayyan-789464396/
