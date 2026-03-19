# react-app-frontend

A React + Redux CRUD app for managing courses and authors. Backend is AWS API Gateway + Lambda + DynamoDB.

> Deployment is handled by Terraform — see [`infra/terraform/README.md`](../infra/terraform/README.md).

## Requirements

- [Node.js](https://nodejs.org/en/download/) >= 20

## Local Development

Change `src/api/serverUrl.js` to localhost:

```javascript
export const serverUrl = 'http://localhost:3001';
```

Then install dependencies and start the app:

```bash
npm install
npm start
```

The app opens at **http://localhost:3000**.

## Deployment

Change `src/api/serverUrl.js` to the deployed API Gateway URL:

```js
export const serverUrl = 'https://your-api-gateway-url.amazonaws.com/prod';
```
or 
```js
export default process.env.REACT_APP_API_URL;
```

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/authors` | List all authors |
| GET | `/courses` | List all courses |
| GET | `/courses/:id` | Get a single course |
| POST | `/courses` | Create a course |
| PUT | `/courses/:id` | Update a course |
| DELETE | `/courses/:id` | Delete a course |

