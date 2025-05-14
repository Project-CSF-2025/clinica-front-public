# 🩺 Sistema de Reportes de Incidentes Clínicos – Frontend

Este es el frontend del sistema **Clinic Incident Reporting**, una plataforma web que permite al personal hospitalario o clínico reportar incidentes de forma anónima. El sistema contribuye a mejorar la seguridad, la transparencia y la comunicación dentro de la organización.

Este frontend se conecta con la API del backend [clinica-back-public](https://github.com/Project-CSF-2025/clinica-back-public) para su funcionamiento completo.

---

## Tecnologías Utilizadas

![HTML5](https://img.shields.io/badge/-html5-333333.svg?logo=html5&style=for-the-badge&logoColor=%23E34F26)
![CSS3](https://img.shields.io/badge/-css3-333333.svg?logo=css3&style=for-the-badge&logoColor=%231572B6)
![JavaScript](https://img.shields.io/badge/-javascript-333333.svg?logo=javascript&style=for-the-badge&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/-react-333333.svg?logo=react&style=for-the-badge&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/-Vite-333333.svg?logo=Vite&style=for-the-badge&logoColor=%23646CFF)
![Bootstrap](https://img.shields.io/badge/-bootstrap-333333.svg?logo=bootstrap&style=for-the-badge&logoColor=%237952B3)
![MUI](https://img.shields.io/badge/-mui-333333.svg?logo=mui&style=for-the-badge&logoColor=%23007FFF)

---

## Instalación

1. **Clonar el Repositorio:**

```bash
git clone https://github.com/Project-CSF-2025/clinica-front-public.git
cd clinica-front-public
````

2. **Instalar las dependencias:**

```bash
npm install
```

3. **Iniciar el servidor de desarrollo:**

```bash
npm run dev
```

4. **Crear un archivo `.env`** en la raíz del proyecto y añadir:

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ Si el puerto 5000 no funciona, ajusta el valor para que coincida con el puerto del backend.

---

## Funcionalidades

* Formulario de reporte anónimo para personal hospitalario/clínico

* Soporte para archivos adjuntos (PDF, imágenes)

* Campo de correo electrónico opcional para recibir notificaciones sobre cambios del reporte

* Formulario multietapa con pantalla de revisión antes del envío

* Panel de administración para:

  * Visualizar y gestionar reportes
  * Ver y cambiar el estado de los reportes
  * Enviar y recibir mensajes relacionados con cada reporte
  * Añadir notas privadas por parte del administrador

* Diseño responsivo con MUI y Bootstrap

* Desplegables configurables usando archivos JSON (departamentos, profesiones, consecuencias)

---

## 🔗 Integración con el Backend

Este frontend está diseñado para trabajar con el backend [clinica-back-public](https://github.com/Project-CSF-2025/clinica-back-public). Asegúrate de:

* Ejecutar primero el servidor backend
* Hacer coincidir el valor de `VITE_API_URL` en el archivo `.env` con el puerto del backend
* Tener CORS habilitado en el backend para permitir las solicitudes del frontend

---

## Autora

Este frontend fue desarrollado por:

* **Kanako Inamine**

Como parte de un proyecto escolar full-stack de desarrollo web.

---

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](./LICENSE).
Se proporciona "tal cual" y la autora no se hace responsable de posibles daños.
Se permite su uso en producción siempre que se otorgue el crédito correspondiente.
