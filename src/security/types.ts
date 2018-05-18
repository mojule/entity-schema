import { Model, Document } from 'mongoose'

export type Role = 'admin' | 'user' | 'currentUser' | 'public'

export interface User {
  email: string
  password: string
  roles: Role[]
}

export interface RoleMap {
  [ userType: string ]: Role
}

export const Roles: RoleMap = {
  admin: 'admin',
  user: 'user',
  currentUser: 'currentUser',
  public: 'public'
}

export interface UserDocument extends Document, User {}

export type MongoUser = Model<UserDocument>
