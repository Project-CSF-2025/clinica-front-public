<h1 align="center">Clinic Incident Reporting – Frontend</h1>

![html5](https://img.shields.io/badge/-html5-333333.svg?logo=html5&style=for-the-badge&logoColor=%23E34F26)
![css3](https://img.shields.io/badge/-css3-333333.svg?logo=css3&style=for-the-badge&logoColor=%231572B6)
![javascript](https://img.shields.io/badge/-javascript-333333.svg?logo=javascript&style=for-the-badge&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/-react-333333.svg?logo=react&style=for-the-badge&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/-Vite-333333.svg?logo=Vite&style=for-the-badge&logoColor=%23646CFF)
![nodedotjs](https://img.shields.io/badge/-nodedotjs-333333.svg?logo=nodedotjs&style=for-the-badge&logoColor=%235FA04E)
![bootstrap](https://img.shields.io/badge/-bootstrap-333333.svg?logo=bootstrap&style=for-the-badge&logoColor=%237952B3)
![mui](https://img.shields.io/badge/-mui-333333.svg?logo=mui&style=for-the-badge&logoColor=%23007FFF)
![github](https://img.shields.io/badge/-github-333333.svg?logo=github&style=for-the-badge&logoColor=%23fff)

<br>

## About
This is the frontend files for Clinic Incident Reporting, a web-based platform that allows hospital or clinic staff to send anonymous incident reports to help improve safety and communication. 
To use this code, you will also need the backend code from the [clinica-back-public](https://github.com/Project-CSF-2025/clinica-back-public?tab=readme-ov-file) repository.

## Installation
- Download the project ZIP file or clone this repository on your local.
  ```
  git clone https://github.com/Project-CSF-2025/clinica-front-public.git
  cd clinica-front-public
  ```
- Install packages
  ```
  npm i
  ```
- Start your build process
  ```
  npm run dev
  ```
- Create a `.env` file in the root directory of the project and add the following: 
  ```
  VITE_API_URL=http://localhost:5000/api
  ```
  > ⚠︎ If isn't work with 5000 port, use the other port number.

## Features & Description
- The pages under `/admin` are for administrators.
- Administrators can leave notes per report for themselves.

