// TODO - get this back into JSON and think of a more robust way to export it

export const userSchema = {
  id: 'http://workingspec.com/schema/user',
  title: 'User',
  description: 'Person with access to the system',
  type: 'object',
  format: 'workingspec-entity',
  properties: {
    email: {
      title: 'Email',
      description: 'The user\'s email address',
      type: 'string',
      format: 'email'
    },
    password: {
      title: 'Password',
      description: 'The user\'s password',
      type: 'string',
      format: 'password',
      wsSecurity: {
        create: [ 'admin', 'public' ],
        read: [ 'admin' ],
        update: [ 'admin', 'currentUser' ]
      }
    },
    roles: {
      title: 'Roles',
      description: 'The user\'s roles',
      type: 'array',
      items: {
        title: 'Role',
        description: 'Name of this role',
        type: 'string'
      },
      readOnly: true,
      default: [ 'user' ],
      wsSecurity: {
        create: [ 'admin' ],
        read: [ 'admin' ],
        update: [ 'admin' ],
        delete: [ 'admin' ]
      }
    }
  },
  wsSecurity: {
    create: [ 'admin', 'public' ],
    read: [ 'admin', 'currentUser' ],
    update: [ 'admin', 'currentUser' ],
    delete: [ 'admin' ]
  },
  additionalProperties: false,
  required: [ 'email', 'password', 'roles' ]
}
