# entity-schema

A subset of JSON Schema for defining entities and some tools for working with
them

Designed to be used with json-schema-to-typescript and mongoose

Needs better docs, renaming, refactoring etc. - was extracted from an existing
project

## Schema Types

### WS Schema

[src/predicates/ws-schema.ts](/src/predicates/ws-schema.ts)

All schema and subschema should have at least a title and type

```json
{
  "title": "Foo",
  "type": "string"
}
```

### $ref Schema

[src/predicates/ref-schema.ts](/src/predicates/ref-schema.ts)

These are the only exception to the `title` and `type` rule, but the schema they
point to must be App Schema, which have both of those fields

### Subschema

[src/predicates/subschema.ts](/src/predicates/subschema.ts)

One of either *WS Schema* or *$ref Schema*

### App Schema

Represents a schema used in the app. It exists as a file so has a URI id
property. An *App Schema* `id` and `title` should be unique within the
application.

```json
{
  "id": "http://example.com/schema/foo",
  "title": "Foo",
  "type": "string"
}
```

### Object Schema

[src/predicates/object-schema.ts](/src/predicates/object-schema.ts)

Represents an app schema for an object

An `Object Schema` should always be an `App Schema`, eg exist as it's own file,
have a URI ID etc.

It should always be `type: 'object'`

It should not have *Entity Schema* as subschema - use a *Reference Schema*
instead

Additional properties should be false

```json
{
  "id": "http://example.com/schema/foo",
  "title": "Foo",
  "type": "object",
  "properties": {
    "name": {
      "$ref": "http://example.com/schema/name"
    },
    "bar": {
      "$ref": "http://example.com/schema/bar-reference"
    }
  },
  "required": [ "name", "bar" ],
  "additionalProperties": false
}
```

### Entity Schema

[src/predicates/entity-schema.ts](/src/predicates/entity-schema.ts)

Represents a main business logic entity that will be persisted to db, partake in
the REST API etc

An `Entity Schema` should always be an `Object Schema`

Additionally it should have its `format` keyword set to `workingspec-entity`

It should not have other *Entity Schema* as subschema - use a *Reference Schema*
instead

Additional properties should be false

```json
{
  "id": "http://example.com/schema/foo",
  "title": "Foo",
  "type": "object",
  "format": "workingspec-entity",
  "properties": {
    "name": {
      "$ref": "http://example.com/schema/name"
    },
    "bar": {
      "$ref": "http://example.com/schema/bar-reference"
    }
  },
  "required": [ "name", "bar" ],
  "additionalProperties": false
}
```

### Entity Reference Schema

[src/predicates/entity-reference-schema.ts](/src/predicates/entity-reference-schema.ts)

A schema that points to an *Entity Schema*

It must have `entityId` and `entityType` properties

`entityId` should be a Mongo ID string
`entityType` should be a *Const Property Schema* - the enum and default should
match the title field of the linked entity

```json
{
  "title": "Foo Reference",
  "type": "object",
  "properties": {
    "entityId": {
      "title": "Foo",
      "type": "string",
      "pattern": "^[0-9a-f]{24}$",
      "message": "Foo must be a 24 character hex string. (0-9, a-f)"
    },
    "entityType": {
      "title": "Entity Type",
      "type": "string",
      "enum": [ "Foo" ],
      "readOnly": true,
      "default": "Foo"
    }
  },
  "required": [ "entityId", "entityType" ],
  "additionalProperties": false
}
```

### Child Entity Schema

[src/predicates/child-entity-schema.ts](/src/predicates/child-entity-schema.ts)

An *Entity Schema* which has a link to a parent *Entity Schema*

It should have a `wsParentProperty` which is the name of the property that
points to the parent entity

The property it points to should be an *Entity Reference Schema*

```json
{
  "id": "http://example.com/schema/foo",
  "title": "Foo",
  "type": "object",
  "format": "workingspec-entity",
  "wsParentProperty": "bar",
  "properties": {
    "name": {
      "$ref": "http://example.com/schema/name"
    },
    "bar": {
      "$ref": "http://example.com/schema/bar-reference"
    }
  },
  "required": [ "name", "bar" ],
  "additionalProperties": false
}
```

### Unique Property Schema

[src/predicates/unique-property-schema.ts](/src/predicates/unique-property-schema.ts)

Used for Entity Schema properties to denote that the value of this property
should be unique

If the Entity Schema is a Child Entity Schema, it must be unique amongst the
children of the parent Entity

If the Entity Schema is not a Child Enity Schema, it must be unique amonst all
of the Entities of this type

```json
{
  "title": "Name",
  "type": "string",
  "wsUnique": true
}
```

### Const Property Schema

[src/predicates/const-property-schema.ts](/src/predicates/const-property-schema.ts)

Often used as a discriminator - a property which must match a certain string

The single `enum` array item and the `default` should match

`readOnly` should be true

The pattern is:

```json
{
  "title": "Kind",
  "type": "string",
  "enum": [ "Foo" ],
  "readOnly": true,
  "default": "Foo"
}
```

### Enum Schema

[src/predicates/enum-schema.ts](/src/predicates/enum-schema.ts)

A schema representing a string enum

It should be of type string, with an `enum` keyword listing possible values

It should have a `wsEnumTitles` keyword that lists human readable titles for the
enums - so these two arrays should have the same length

```json
{
  "title": "My Enum",
  "type": "string",
  "enum": [
    "foo", "bar", "baz"
  ],
  "wsEnumTitles": [
    "Foo", "Bar", "Baz"
  ]
}
```

### OneOf Schema

[src/predicates/oneof-schema.ts](/src/predicates/oneof-schema.ts)

A schema that can be one of several possible values

There should be a discriminator of some kind to tell just from models which
type is used

If oneOf is a list of Entity Reference Schema then the discriminator will be
`entityType` - otherwise use `kind` on the subschemas to differentiate

```json
{
  "title": "Payload",
  "type": "object",
  "oneOf": [
    {
      "$ref": "http://example.com/schema/document-payload-generic"
    },
    {
      "$ref": "http://example.com/schema/document-payload-unity"
    }
  ]
}

```
