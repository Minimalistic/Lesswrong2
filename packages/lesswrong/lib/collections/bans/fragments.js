import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment BansAdminPageFragment on Ban {
    _id
    createdAt
    expirationDate
    userId
    user {
      ...UsersMinimumInfo
    }
    reason
    comment
    ip
    properties
  }
`);
