---
id: item
title: item
slug: /api
---

## `POST` bill/item

---

**Description**

```php
Creating a item
```

**Header**

```json
{
  "authtoken": "token from firebase authentication service"
}
```

**Parameters**

```php
Body
{
    "name": "required | string",
    "price": "required | number",
    "payers": "optional | number[] | Array of user's uid"
}
```

**Response Example**

```json
{
  "id": 1,
  "name": "Item Example",
  "price": 200,
  "createdAt": "2021-03-14T06:35:21.740Z",
  "updatedAt": "2021-03-14T06:35:21.740Z"
}
```

---

## `GET` bill/item/get/:id

---

**Description**

```php
Get a item by its id.
```

**Parameters**

```php
Param
[
    "id" => "required | number"
]
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
    "id": 1,
    "name": "Item Example",
    "price": 200,
    "createdAt": "2021-03-14T06:35:21.740Z",
    "updatedAt": "2021-03-14T06:35:21.740Z",
    "payers":[
        {
            "uid": "987654321",
            "username": "testNew",
            "prefix": "Miss",
            "firstName": "NewAlbert",
            "lastName": "NewAlbedo",
            "phoneNumber": "9876543210",
            "birthDate": "2021-11-20T02:55:58.168Z",
            "createdAt": "2021-03-14T06:35:21.740Z",
            "updatedAt": "2021-03-14T06:35:21.740Z",
        },
        ...
    ],
    "bill":{
        "id": 1,
        "title": "Bill Example",
        "createdAt": "2021-03-14T06:35:21.740Z",
        "updatedAt": "2021-03-14T06:35:21.740Z"
    }
}
```

---

## `PATCH` bill/item/:id

---

**Description**

```php
Update a item
```

**Parameters**

```php
Param
[
    "id" => "required | number"
]

Body
{
    "name": "optiona | string",
    "price": "optional | number",
    "payers": "optional | number[] | Array of user's uid" // empty array to remove all relation to user
}
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
  "id": 1,
  "name": "New Item Example",
  "price": 50000,
  "createdAt": "2021-03-14T06:35:21.740Z",
  "updatedAt": "2021-03-20T06:35:21.740Z"
}
```

---

## `DELETE` bill/item/:id

---

**Description**

```php
Delete an item
```

**Parameters**

```php
Param
[
    "id" => "required | number"
]
```

**Header**

```json
{
  "authtoken": "token from firebase authentication service"
}
```

**Response Example**

```json
{}
```
