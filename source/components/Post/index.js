//Core
import React, { Component } from 'react';
import moment from 'moment';
import { func, string, number, array} from 'prop-types';
// Components
import { withProfile } from 'components/HOC/withProfile';
import  Like  from 'components/Like';
//Instruments
import Styles from './styles.m.css';

@withProfile
export default class Post extends Component {
  static propTypes = {
    comment:     string.isRequired,
    created:     number.isRequired,
    _likePost:   func.isRequired,
    likes:       array.isRequired,
    id:          string.isRequired,
    _removePost: func.isRequired,

  }

  _removePost = () => {
    const { _removePost, id } = this.props;
    _removePost(id);
  }
  render () {
    const { comment, created, _likePost, likes, id, avatar, currentUserFirstName, currentUserLastName } = this.props;
    return (
          <section className = { Styles.post }>
            <span className = { Styles.cross }
                   onClick = { this._removePost }/>
            <img src = { avatar } />
            <a> {`${currentUserFirstName} ${currentUserLastName}`} </a>
            <time>{moment.unix(created).format('MMMM D h:mm:ss:a')}</time>
            <p>{ comment }</p>
            <Like _likePost = { _likePost }
                  id = { id }
                  likes = { likes }
            />
          </section>
    )
  }
}
