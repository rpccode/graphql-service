<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

---

# **Documentación del Proyecto**
## **1. Introducción**

Esta aplicación es una solución basada en **NestJS** con soporte para **GraphQL**, **RabbitMQ**, y **tareas programadas**. A continuación se detalla cómo ejecutar la aplicación tanto en tu entorno local como en Kubernetes, así como cómo configurar y probar las funcionalidades principales de la aplicación.

---

## **2. Requisitos Previos**

- **Node.js**: >=14.0.0
- **Docker**: Para la ejecución de contenedores en Kubernetes y la base de datos.
- **Kubernetes**: Para la orquestación de contenedores.
- **RabbitMQ**: Para la comunicación asincrónica entre servicios.
- **PostgreSQL**: Base de datos para almacenar los datos de la aplicación.

---

## **3. Ejecución Local**

### **3.1. Instalación de Dependencias**

1. Clona el repositorio en tu máquina local:
   ```bash
   git clone <repo_url>
   cd <repo_name>
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

### **3.2. Configuración de Variables de Entorno**

Crea un archivo `.env` en el directorio raíz y configura las siguientes variables (ajustando según tus necesidades):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
NODE_ENV=development
RABBITMQ_URL=amqp://localhost:5672
```

### **3.3. Ejecutar la Aplicación**

1. Para iniciar la aplicación localmente, ejecuta el siguiente comando:

   ```bash
   npm run start:dev
   ```

2. La aplicación estará disponible en:
   - **GraphQL Playground**: `http://localhost:4000/graphql`
   - **Swagger**: `http://localhost:4000/api`

### **3.4. Probar la Aplicación**

#### **3.4.1. GraphQL**

Puedes acceder a **GraphQL Playground** en `http://localhost:4000/graphql` para realizar consultas y mutaciones a tu servicio GraphQL.

#### **3.4.2. Swagger**

Si deseas probar los endpoints REST (si tienes alguna API REST configurada en tu aplicación), puedes acceder a la interfaz de **Swagger** en `http://localhost:4000/api`.

---

## **4. Ejecución en Kubernetes**

### **4.1. Preparación de Kubernetes**

1. Asegúrate de tener un **clúster de Kubernetes** configurado localmente (puedes usar herramientas como **Minikube** o **Docker Desktop** para configurarlo localmente).
   
2. **Docker**: Si tu proyecto utiliza contenedores Docker, asegúrate de que el Docker Daemon esté corriendo y configurado correctamente.

### **4.2. Crear Archivos de Configuración de Kubernetes**

En el directorio raíz de tu proyecto, crea los siguientes archivos para desplegar tu aplicación en Kubernetes:

#### **4.2.1. Deployment de la Aplicación**

Crea un archivo `deployment.yaml` para tu aplicación NestJS:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: graphql-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: graphql-service
  template:
    metadata:
      labels:
        app: graphql-service
    spec:
      containers:
        - name: graphql-service
          image: <tu_imagen_docker>
          ports:
            - containerPort: 4000
          env:
            - name: DB_HOST
              value: "postgres-service"
            - name: DB_PORT
              value: "5432"
            - name: DB_USER
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: db-user
            - name: DB_PASS
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: db-pass
            - name: DB_NAME
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: db-name
            - name: NODE_ENV
              value: "production"
            - name: RABBITMQ_URL
              value: "amqp://rabbitmq-service:5672"
```

#### **4.2.2. Servicio de la Aplicación**

Crea un archivo `service.yaml` para exponer la aplicación:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: graphql-service
spec:
  selector:
    app: graphql-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 4000
```

#### **4.2.3. RabbitMQ y PostgreSQL**

Si no tienes servicios de RabbitMQ y PostgreSQL ya configurados, también puedes crear archivos `deployment` y `service` para ambos servicios.

Por ejemplo, para **RabbitMQ**:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rabbitmq
spec:
  replicas: 1
  selector:
    matchLabels:
      app: rabbitmq
  template:
    metadata:
      labels:
        app: rabbitmq
    spec:
      containers:
        - name: rabbitmq
          image: rabbitmq:3-management
          ports:
            - containerPort: 15672
            - containerPort: 5672
```

Para **PostgreSQL**:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:13
          env:
            - name: POSTGRES_USER
              value: "your_db_user"
            - name: POSTGRES_PASSWORD
              value: "your_db_password"
            - name: POSTGRES_DB
              value: "your_db_name"
```

#### **4.2.4. Crear los Pods y Servicios en Kubernetes**

Para crear los Pods y Servicios en Kubernetes, ejecuta:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f rabbitmq-deployment.yaml
kubectl apply -f postgres-deployment.yaml
```

### **4.3. Acceso a la Aplicación en Kubernetes**

Una vez que la aplicación esté desplegada en Kubernetes, puedes acceder a la interfaz de **GraphQL** y **Swagger**:

```bash
kubectl port-forward svc/graphql-service 4000:80
```

Esto hará que puedas acceder a la aplicación en tu navegador local en `http://localhost:4000`.

---

## **5. Configuración de RabbitMQ y Tareas Programadas en Kubernetes**

### **5.1. RabbitMQ en Kubernetes**

Si RabbitMQ no está corriendo en Kubernetes, asegúrate de que el contenedor esté en funcionamiento con el archivo `deployment.yaml` y el servicio correspondiente. Verifica que los servicios estén correctamente configurados en el archivo `values.yaml` de tu servicio para que tu aplicación pueda conectarse a RabbitMQ.

### **5.2. Tareas Programadas en Kubernetes**

Si estás utilizando tareas programadas, como cron jobs, asegúrate de definir el **CronJob** dentro de Kubernetes para que se ejecute en el contenedor:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: scheduled-task
spec:
  schedule: "*/5 * * * *"  # Ejecutar cada 5 minutos
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: scheduled-task
              image: <tu_imagen_docker>
              command: ["/bin/sh", "-c", "node /path/to/your/script.js"]
          restartPolicy: OnFailure
```

Aplica este archivo con:

```bash
kubectl apply -f cronjob.yaml
```

Esto ejecutará tareas programadas en intervalos definidos.

---

## **6. Conclusión**

Con esta configuración, puedes ejecutar y probar la aplicación tanto localmente como en Kubernetes. Asegúrate de que todos los servicios (como RabbitMQ y PostgreSQL) estén correctamente configurados y expuestos para que tu aplicación funcione como se espera.

Si tienes algún problema con la configuración o necesitas más detalles, no dudes en consultar la documentación de **NestJS**, **Kubernetes** o **RabbitMQ**.

---

Este es un ejemplo de cómo estructurar la documentación. Puedes modificarla según la configuración específica de tu aplicación.