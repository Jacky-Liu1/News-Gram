import React, { useState, useEffect } from 'react';
import './App.css';
import DonutSmallIcon from '@material-ui/icons/DonutSmall';
import Post from './components/Post';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { Card, CardContent } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';


function App() {

  const [title, setTitle] = useState('');
  const [picUrl, setPicUrl] = useState('');
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [comment, setComment] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  const [posts, setPosts] = useState([]);  // every post

  useEffect(() => {
    async function fetchPosts() {
      const posts = await fetch('http://localhost:9000/NewsGram/posts/api/123456')
        .then(response => response.json())
      setPosts(posts)
      return posts;
    }
    fetchPosts();
  }, [])

  function handlePost() {


    /*
    TODO!!!!!!!!!!  
    description -> textarea
    handlePost function which should send to database on submit
    children props -> parent props
    */








  }

  return (
    <div className="App">
      {/* Header -> signup -> signout -> login */}
      <div className="header">
        <div className="organization">
          <DonutSmallIcon fontSize="large" className="organization-logo" />
          <h3 className="organization-name">NewsGram</h3>
        </div>
        <div className="user-auth">
          {/*
          <button className="sign-in">Sign-In</button>
          <button className="sign-up">Sign-Up</button>
          */}
        </div>
      </div>

      <Modal
        className="modal"
        open={openModal}
        onClose={() => setOpenModal(false)} // closes if you click outside of modal
      >
        <Card>
          <CardContent className="card-content">
            <div className="post-sheet">
              <Input className='post-title'
                placeholder="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input className="post-picUrl"
                placeholder='picture url'
                type="url"
                value={picUrl}
                onChange={(e) => setPicUrl(e.target.value)}
              />
              <Input className="post-description"
                placeholder="description(optional)"
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="post-button">
                <Button onClick={handlePost}>Post</Button>
              </div>

            </div>

          </CardContent>
        </Card>

      </Modal>



      <div className="create-post">
        <div className="post-icon" >
          <PostAddIcon />
        </div>
        <div className="create-post-button">
          <Button onClick={() => setOpenModal(true)}>Create Post</Button>
        </div>
      </div>




      {/* Post */}

      {
        posts.map(post => (
          <Post
            key={post.id}
            username={post.username}
            title={post.title}
            picUrl={post.picUrl}
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            comments={post.comments}
            commentCount={post.commentCount}
            description={post.description}
            date={post.date}
          />
        ))
      }






    </div>
  );
}

export default App;
