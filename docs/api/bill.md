---
id: bill
title: bill
slug: /api
---

## `POST` bill/bill

---

**Description**

```php
Creating a bill
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
    "title": "required | string",
    "itemLists": "optional | number[] | Array of item id",
    "participants": "optional | number[] | Array of user's uid",
    "promptPay": "optional | string"
    "qrCodeFileId": "optional | number | qrCode file id"
}
```

**Response Example**

```json
{
  "id": 1,
  "title": "Bill Example",
  "promptPay": "1111111111",
  "createdAt": "2021-03-14T06:35:21.740Z",
  "updatedAt": "2021-03-14T06:35:21.740Z"
}
```

---

## `GET` bill/get/:id

---

**Description**

```php
Get a bill by its id
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
[
    {
        "id": 1,
        "title": "Bill Example",
        "createdAt": "2021-03-14T06:35:21.740Z",
        "updatedAt": "2021-03-14T06:35:21.740Z",
        "participants":[
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
                "fcmTokens": [ {"id": "5", "token":44444} ]
            },
            ...
        ],
        "items":[
            {
                "id":1,
                "name": "item test",
                "price": 20,
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
                ...
            }
        ],
        "qrCode":{
            "title": "2021-02-18T04:47:19.681Z.jpeg",
            "type": "image/jpeg",
            "path": "http://localhost:3000/api/files/2021-02-18T04:47:19.681Z.jpeg",
            "id": 9
        }
    },
    ...
]
```

---

## `GET` bill/list

---

**Description**

```php
Get list of bills in which user have participated
```

**Header**

```json
{
  "authtoken": "token from firebase authentication service"
}
```

**Response Example**

```json
[
    {
        "id": 1,
        "title": "Bill Example",
        "createdAt": "2021-03-14T06:35:21.740Z",
        "updatedAt": "2021-03-14T06:35:21.740Z",
        "items":[
            {
                "id":1,
                "name": "item test",
                "price": 20,
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
                        "fcmTokens": [ {"id": "5", "token":44444} ]
                    },
                    ...
                ],
                ...
            }
        ]
    },
    ...
]
```

---

## `PATCH` bill/bill/:id

---

**Description**

```php
Update a bill
```

**Parameters**

```php
Param
[
    "id" => "required | number"
]

Body
{
    "title": "optional | string",
    "itemLists": "optional | number[] | Array of item id", // empty array to remove relation
    "participants": "optional | number[] | Array of user's uid", // empty array to remove relation
    "qrCodeFileId": "optional | number | qrCode file id"
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
  "title": "New Bill Example",
  "createdAt": "2021-03-14T06:35:21.740Z",
  "updatedAt": "2021-05-20T06:35:21.740Z"
}
```

---

## `DELETE` bill/bill/:id

---

**Description**

```php
Delete a bill
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
