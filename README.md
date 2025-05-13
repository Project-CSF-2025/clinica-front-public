# Clinic Incident Reporting – Frontend

This is the frontend of the **Clinic Incident Reporting** system, a web-based platform that allows hospital or clinic staff to anonymously report incidents. The system helps improve safety, transparency, and communication within the organization.

This frontend connects with the [clinica-back-public](https://github.com/Project-CSF-2025/clinica-back-public) backend API for full functionality.

---

## Built With

![HTML5](https://img.shields.io/badge/-html5-333333.svg?logo=html5&style=for-the-badge&logoColor=%23E34F26)
![CSS3](https://img.shields.io/badge/-css3-333333.svg?logo=css3&style=for-the-badge&logoColor=%231572B6)
![JavaScript](https://img.shields.io/badge/-javascript-333333.svg?logo=javascript&style=for-the-badge&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/-react-333333.svg?logo=react&style=for-the-badge&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/-Vite-333333.svg?logo=Vite&style=for-the-badge&logoColor=%23646CFF)
![Bootstrap](https://img.shields.io/badge/-bootstrap-333333.svg?logo=bootstrap&style=for-the-badge&logoColor=%237952B3)
![MUI](https://img.shields.io/badge/-mui-333333.svg?logo=mui&style=for-the-badge&logoColor=%23007FFF)

---

## Installation

1. **Clone the Repository:**

```bash
git clone https://github.com/Project-CSF-2025/clinica-front-public.git
cd clinica-front-public
````

2. **Install dependencies:**

```bash
npm install
```

3. **Start the Development Server:**

```bash
npm run dev
```

4. **Create a `.env` file** in the root of the project and add the following line:

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ If port 5000 doesn't work, update it to match your backend port.

---

## Features

* Anonymous incident reporting form for hospital/clinic staff
* File attachment support (PDF, images)
* Optional email field to be able to recieve notifications of any changes made to a report by admin. 
* Multi-step form with a review screen before submission
* Admin panel to:

  * View and manage reports
  * Track report statuses
  * Send and receive messages tied to reports
  * Leave private notes for each report
* Report submission form and report status view pages fully responsive and styled using MUI and Bootstrap
* Configurable dropdowns using JSON files (departments, professions, consequences)

---

## 🔗 Backend Integration

This frontend is designed to work with the [clinica-back-public](https://github.com/Project-CSF-2025/clinica-back-public) backend. Be sure to:

* Run the backend server first
* Match the `VITE_API_URL` in the `.env` file with your backend port
* Ensure CORS is enabled in the backend to allow frontend connections

---

## Author

This frontend was developed by:

* Kanako Inamine

As part of a full-stack web development school project.

---

## License

This project is licensed under the MIT License.
It is provided as-is and the authors are not liable for any damages.
Use in production is permitted with proper credit.
