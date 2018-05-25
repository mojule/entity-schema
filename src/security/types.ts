import { Model, Document } from 'mongoose'

export type Role = 'admin' | 'user' | 'currentUser' | 'public'

export type PropertyAccess = 'create' | 'read' | 'update'

export type EntityAccess = PropertyAccess | 'delete'

export interface User {
  email: string
  password: string
  roles: Role[]
}

export interface ApiKey {
  user: {
    entityId: string
    entityType: 'User'
  }
  secret: string
}

export interface RoleMap {
  [ userType: string ]: Role
}

export interface EntityAccessMap {
  [ access: string ]: EntityAccess
}

export interface PropertyAccessMap {
  [ access: string ]: PropertyAccess
}

export const Roles: RoleMap = {
  admin: 'admin',
  user: 'user',
  currentUser: 'currentUser',
  public: 'public'
}

export const PropertyAccesses: PropertyAccessMap = {
  create: 'create',
  read: 'read',
  update: 'update'
}

export const EntityAccesses: EntityAccessMap = {
  create: 'create',
  read: 'read',
  update: 'update',
  delete: 'delete'
}

export interface UserDocument extends Document, User { }

export interface ApiKeyDocument extends Document, ApiKey { }

export type MongoUser = Model<UserDocument>

export type MongoApiKey = Model<ApiKeyDocument>
