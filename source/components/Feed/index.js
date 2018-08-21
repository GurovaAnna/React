//Core
import React, { Component } from "react";
import { Transition } from "react-transition-group";
import { fromTo } from "gsap";
//Components
import { withProfile } from "components/HOC/withProfile";
import Catcher from "components/Catcher";
import StatusBar from "components/StatusBar";
import Composer from "components/Composer";
import Post from "components/Post";
import Spinner from "components/Spinner";
import Postman from "components/Postman";
//Instruments
import Styles from "./styles.m.css";
import { api, TOKEN, GROUP_ID } from "config/api";
import { socket } from "socket/init";

@withProfile
export default class Feed extends Component {
    state = {
        posts:        [],
        isSpinning:   false,
        isTransition: true,
    };
    componentDidMount () {
        const { currentUserFirstName, currentUserLastName } = this.props;

        this._fetchPosts();
        socket.emit("join", GROUP_ID);

        socket.on("create", (postJSON) => {
            const { data: createPost, meta } = JSON.parse(postJSON);

            if (
                `${currentUserFirstName} ${currentUserLastName}` !==
                `${meta.authorFirstName} ${meta.authorLastName}`
            ) {
                this.setState(({ posts }) => ({
                    posts: [createPost, ...posts],
                }));
            }
        });
        socket.on("remove", (postJSON) => {
            const { data: removePost, meta } = JSON.parse(postJSON);

            if (
                `${currentUserFirstName} ${currentUserLastName}` !==
                `${meta.authorFirstName} ${meta.authorLastName}`
            ) {
                this.setState(({ posts }) => ({
                    posts: posts.filter((post) => post.id !== removePost.id),
                }));
            }
        });
        socket.on("like", (postJSON) => {
            const { data: likedPost, meta } = JSON.parse(postJSON);

            if (
                `${currentUserFirstName} ${currentUserLastName}` !==
                `${meta.authorFirstName} ${meta.authorLastName}`
            ) {
                this.setState(({ posts }) => ({
                    posts: posts.map(
                        (post) => post.id === likedPost.id ? likedPost : post
                    ),
                }));
            }
        });
    }
    componentWillUnmount () {
        socket.removeListener("create");
        socket.removeListener("remove");
    }
    _setPostsFetchingState = (state) => {
        this.setState({
            isSpinning: state,
        });
    };

    _fetchPosts = async () => {
        this._setPostsFetchingState(true);
        const response = await fetch(api, {
            method: "GET",
        });
        const { data: posts } = await response.json();

        this.setState({
            posts,
            isSpinning: false,
        });
    };
    _createPost = async (comment) => {
        this._setPostsFetchingState(true);
        const response = await fetch(api, {
            method:  "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ comment }),
        });
        const { data: post } = await response.json();

        this.setState(({ posts }) => ({
            isSpinning: false,
            posts:      [post, ...posts],
        }));
    };
    _likePost = async (id) => {
        const { posts } = this.state;

        this._setPostsFetchingState(true);
        const response = await fetch(`${api}/${id}`, {
            method:  "PUT",
            headers: {
                Authorization: TOKEN,
            },
        });

        const { data: likedPost } = await response.json();

        this.setState(({ posts }) => ({
            posts: posts.map(
                (post) => post.id === likedPost.id ? likedPost : post
            ),
            isSpinning: false,
        }));
    };
    _removePost = async (id) => {
        const { posts } = this.state;

        this._setPostsFetchingState(true);
        await fetch(`${api}/${id}`, {
            method:  "DELETE",
            headers: {
                Authorization: TOKEN,
            },
        });
        const newPosts = posts.filter((post) => {
            return post.id !== id;
        });

        this.setState({
            posts:      newPosts,
            isSpinning: false,
        });
    };
    _animateComposerEnter = (composer) => {
        fromTo(
            composer,
            1,
            { opacity: 0, rotationX: 50 },
            { opacity: 1, rotationX: 0 }
        );
    };
    _animatePostmanEnter = (Postman) => {
        fromTo(Postman, 4, { x: 280 }, { x: 0 });
    };
    _animatePostmanEntered = (Postman) => {
        this._toggleIsTransition();
    };
    _animatePostmanExit = (Postman) => {
        fromTo(Postman, 4, { x: 0 }, { x: 280 });
    };
    _toggleIsTransition = () => {
        this.setState(({ isTransition }) => ({ isTransition: !isTransition }));
    };
    render () {
        const { posts, isSpinning, isTransition } = this.state;
        const postsJSX = posts.map((post) => {
            return (
                <Catcher key = { post.id }>
                    <Post
                        { ...post }
                        _likePost = { this._likePost }
                        _removePost = { this._removePost }
                    />
                </Catcher>
            );
        });

        return (
            <section className = { Styles.feed }>
                <Spinner isSpinning = { isSpinning } />
                <StatusBar />
                <Transition
                    appear
                    in
                    timeout = { 4000 }
                    onEntering = { this._animateComposerEntering }>
                    <Composer _createPost = { this._createPost } />
                </Transition>
                <Transition
                    appear
                    in = { isTransition }
                    onEnter = { this._animatePostmanEnter }
                    onEntered = { this._animatePostmanEntered }
                    onExit = { this._animatePostmanExit }
                    timeout = { 10000 }>
                    <Postman />
                </Transition>
                {postsJSX}
            </section>
        );
    }
}
