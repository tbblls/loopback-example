# Loopback Application

The project was generated by [LoopBack](http://loopback.io).

## Documentation and tutorials

- http://loopback.io/getting-started/
- https://www.codetutorial.io/loopback-and-angularjs-first-tutorial/
- https://docs.strongloop.com/display/public/LB/LoopBack

## Setup

### Create new application

```
slc loopback
[?] What's the name of your application? hello-world
  create hello-world/
  info change the working directory to hello-world
  I'm all done. Running npm install for you to install
  the required dependencies.
```

### Add a new model

```
$ slc loopback:model

[?] Enter the model name: person
[?] Select the data-source to attach person to: db (memory)
[?] Select model`s base class (PersistedModel)
[?] Expose person via the REST API? Yes
[?] Custom plural form (used to build REST URL): people
[?] Common model or server only? common

```

### Add properties to model
```
[?] Property name: firstname

[?] Property type: (Use arrow keys)
❯ string
  number
  boolean
  object
  array
  date
  buffer
  geopoint
  any
  (other)

[?] Required? (y/N) y
```

### Add relationships

```
$ slc loopback:relation
? Select the model to create the relationship from:
...
> Customer
... # follow the prompts, repeat for other models

```
Please note that this step gave issues with older versions (prior to 4.3.0) of NodeJS. Please make sure that you are running the latest stable version if you are having issues.

### Modify models
To modify a model you need to edit the models json file.

```js
| client
| common
  | models
    - assessor.json
| server

```
```json

  "name": "Assessor",
  "plural": "Assessors",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "name": {
      "type": "string",
      "required": true
    }
  },
  "validations": [],
  "relations": {
    "employers": {
      "type": "hasMany",    
      "model": "Employer",
      "foreignKey": ""
    }
  },
  "acls": [],
  "methods": {}
}

```


For more information please read here -  https://docs.strongloop.com/display/public/LB/Customizing+models



### Run Application

* Run `node .`


### Set the default port

```js
// Directory

| client
| common
| server
  | config.js

// Change the port number to you desired value
{
 "port": 3014,
}

```
##Other
There are a large amount of configuration options available see documentation for more information.

## Client

There is a simple example application that consumes the loopback services. The JavaScript is will documented.

- app.js, manages changes to the DOM and makes calls to the myApp variable exposed by the appApi.js file

- appAPI.js, exposes a variable called myApp to the global scope. All calls to the api are handled here, as are login and authKey management.
