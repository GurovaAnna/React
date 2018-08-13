//Core
import React, { Component } from 'react';
import moment from 'moment';
//Components
import { withProfile } from 'components/HOC/withProfile';
import StatusBar from 'components/StatusBar';
import Composer from 'components/Composer';
import Post from 'components/Post';
import Spinner from 'components/Spinner';
//Instruments
import Styles from './styles.m.css';
import { getUniqueID, delay } from 'instruments'

@withProfile
export default class Feed extends Component {
  state = {
    posts: [{ id: '123', comment: 'Hi there',  created: 1526825076849, likes: [] },
            { id: '456', comment: 'Привет!',  created: 1526825076855, likes: [] },
           ],
    isSpinning: false,
  }
  _setPostsFetchingState =  (state) => {
    this.setState({
      isSpinning: state,
    })
  };
   _createPost = async (comment) => {
    this._setPostsFetchingState(true);
    const post = {
      id: getUniqueID(),
      comment,
      created: moment.now(),
      likes: [],
    }

    await delay(1200);

    this.setState(({ posts }) => ({
      isSpinning: false,
      posts: [post, ...posts],
    }));
  }
   _likePost = async (id) => {
    const { currentUserFirstName, currentUserLastName } = this.props;
    this._setPostsFetchingState(true);
    await delay(1200);
    const newPosts = this.state.posts.map( post => {
      if (post.id === id) {
        return {
          ...post,
          likes: [
            {
              id:  getUniqueID(),
              firstName: currentUserFirstName,
              lastName: currentUserLastName,

            }
          ]
        }
      }
      return post;
    });
    this.setState({
      posts: newPosts,
      isSpinning: false,
    })
  }
   _removePost =  async (id) => {
    this._setPostsFetchingState(true);
    await delay(1200);
    const newPosts = this.state.posts.filter( post => {
        return post.id !== id;
    });
    this.setState({
      posts: newPosts,
      isSpinning: false,
    })
  }
  render () {
    const { posts, isSpinning } = this.state;
    const  postsJSX  = posts.map((post) => {
      return <Post key = { post.id }
                  {...post}
                  _likePost = { this._likePost}
                  _removePost = { this._removePost }
             />;
    });
    return (
      <section className = { Styles.feed }>
        <Spinner isSpinning ={ isSpinning } />
        <StatusBar />
        <Composer _createPost = { this._createPost } />
        { postsJSX }
      </section>
    )
  }
}
