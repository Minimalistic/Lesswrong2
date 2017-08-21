import { createCollection, getDefaultResolvers, getDefaultMutations, newMutation } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import schema from './schema.js';
import './fragments.js'
import './permissions.js'


const options = {
  editCheck: (user, document) => {
    if (!user || !document) return false;
    return Users.owns(user, document) ? Users.canDo(user, 'sequences.edit.own') : Users.canDo(user, `sequences.edit.all`)
  },

  removeCheck: (user, document) => {
    if (!user || !document) return false;
    return Users.owns(user, document) ? Users.canDo(user, 'sequences.edit.own') : Users.canDo(user, `sequences.edit.all`)
  },
}

/*
  The sequenceNew mutation is altered to include the addition of a null Chapter.
*/

let mutations = getDefaultMutations('Sequences', options)

mutations.new = {

  name: 'sequencesNew',

  check(user, document) {
    if (!user) return false;
    return Users.canDo(user, 'posts.new');
  },

  mutation(root, {document}, context) {

    Utils.performCheck(this.check, context.currentUser, document);

    let chapterData = {
      number: 0,
    }

    let chapter = newMutation({
      collecton: context.Chapters,
      document: chapterData,
      curentUser: context.currentUser,
      validate: true,
      context,
    })

    document.chapterIds = [chapter._id]

    return newMutation({
      collection: context.Posts,
      document: document,
      currentUser: context.currentUser,
      validate: true,
      context,
    });
  },

}

const Sequences = createCollection({

  collectionName: 'Sequences',

  typeName: 'Sequence',

  schema,

  resolvers: getDefaultResolvers('Sequences'),

  mutations: getDefaultResolvers('Sequences')
})

export default Sequences;
