---
id: user
title: user
slug: /api
---

## `POST` /user

---

**Description**

```php
Creating user information
```

**Header**

```json
{
  "authtoken": "token from firebase authentication service"
}
```

**Parameters**

```json
Body
{
    "username": "required | string",
    "prefix": "required | string", // name prefix
    "firstname": "required | string",
    "lastname": "required | string ",
    "phoneNumber": "required | string | length = 10",
    "birthDate": "required | Date",
    "avatarId": "optional | number" // id of avatar file
}
```

**Response Example**

```json
{
  "uid": "123456789",
  "username": "test",
  "prefix": "Mr",
  "firstname": "Albert",
  "lastname": "Albedo",
  "phoneNumber": "0123456789",
  "birthDate": "2021-02-18T02:55:58.168Z"
}
```

---

## `PATCH` /user

---

**Description**

```php
Update user information
```

**Header**

```json
{
  "authtoken": "token from firebase authentication service"
}
```

**Parameters**

```json
Body
{
    "username": "optional | string | unique",
    "prefix": "optional | string", // name prefix
    "firstname": "optional | string",
    "lastname": "optional | string ",
    "phoneNumber": "optional | string | length = 10",
    "birthDate": "optional | Date",
    "avatarId": "optional | number" // id of avatar file
}
```

**Response Example**

```json
{
  "uid": "987654321",
  "username": "testNew",
  "prefix": "Miss",
  "firstname": "NewAlbert",
  "lastname": "NewAlbedo",
  "phoneNumber": "9876543210",
  "birthDate": "2021-11-20T02:55:58.168Z"
}
```

---

## `GET` /current-user/info

---

**Description**

```php
Get current login user information
```

**Header**

```json
{
  "authtoken": "token from firebase authentication service"
}
```

**Response Example**

```json
{
  "uid": "987654321",
  "username": "testNew",
  "prefix": "Miss",
  "firstname": "NewAlbert",
  "lastname": "NewAlbedo",
  "phoneNumber": "9876543210",
  "birthDate": "2021-11-20T02:55:58.168Z",
  "createdAt": "2021-03-14T06:35:21.740Z",
  "updatedAt": "2021-03-14T06:35:21.740Z",
  "avatarPict": {
    "title": "2021-02-18T04:47:19.681Z.jpeg",
    "type": "image/jpeg",
    "path": "http://localhost:3000/api/files/2021-02-18T04:47:19.681Z.jpeg",
    "id": 9
  }
}
```

---

## `GET` /search/:name

---

**Description**

```php
Get all user which contain {name} in their username, firstname or lastname
```

**Header**

```json
{
  "authtoken": "token from firebase authentication service"
}
```

**Parameter**

```php
Path Variable
[
  "name": "required | string"
]
```

**Response Example**

```json
[
  {
    "uid": "987654321",
    "username": "testNew",
    "prefix": "Miss",
    "firstname": "NewAlbert",
    "lastname": "NewAlbedo",
    "phoneNumber": "9876543210",
    "birthDate": "2021-11-20T02:55:58.168Z",
    "createdAt": "2021-03-14T06:35:21.740Z",
    "updatedAt": "2021-03-14T06:35:21.740Z",
    "avatarPict": {
      "title": "2021-02-18T04:47:19.681Z.jpeg",
      "type": "image/jpeg",
      "path": "http://localhost:3000/api/files/2021-02-18T04:47:19.681Z.jpeg",
      "id": 9
    }
  },
  ...
]
```
