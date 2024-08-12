![WaterSensor Cover](https://res.cloudinary.com/dnh0go0q2/image/upload/v1723325073/cover_kivsqm.png)

# ESP32 WaterSensor backend

This fastify backend is used for my ESP32 WaterLevelSensor project. The purpose of this backend is registering sensor readings and sending notifications.
If you want to learn how i've created the hardware part for this sensor you can read my [blog article](https://blog.pavece.com/post/esp32-water-level-sensor).

## Run in dev mode

### Fill environment variables

Rename .env.template to .env and fill all the variables.

### Dev Database

If you want, you can use the provided docker compose to run a development PostgreSQL instance. Just make sure all the related environment variables are filled and docker is running. 
Then run

```
docker compose up -d
```

### Run the project

Install packages

```
npm install
```

Run prisma migrations and generate the client 

```
npx prisma generate dev --name "Initial migration"
```

Run the server

```
npm run dev
```

## Deploy

You can deploy this project for free as is using vercel. Just make sure to spin up a production PostgreSQL instance and add all the environment variables.
