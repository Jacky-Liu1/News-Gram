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
  const [comments, setComments] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  const [posts, setPosts] = useState([]);  // every post

  // fetch post
  useEffect(() => {
    async function fetchPosts() {
      const posts = await fetch('http://localhost:9000/NewsGram/posts/api/123456')
        .then(response => response.json())
      setPosts(posts)
      return posts;
    }
    fetchPosts();
  }, [])


  // post 
  function handlePost() {
    const postData = {
      "title": title,
      "picUrl": picUrl,
      "upvotes": 0,
      "downvotes": 0,
      "comments": [],
      "description": description,
      "date": Date.now()
    }

    //sends post to this url?
    return fetch('http://localhost:9000/NewsGram/posts/api/123456', {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => res.json())
      .then(data => console.log(data));

  }

  // update upvotes
  function updateUpvotes() {
    setUpvotes(upvotes + 1)
    return fetch('http://localhost:9000/NewsGram/posts/api/123456', {
      method: 'UPDATE',
      body: JSON.stringify(upvotes),
      header: {
        'Content-Type': 'application/json'
      },
    })
  }

  //handle downvotes
  function updateDownvotes() {

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
                required
              />
              <Input className="post-picUrl"
                placeholder='picture url'
                type="url"
                value={picUrl}
                onChange={(e) => setPicUrl(e.target.value)}
                required
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
            key={post._id}
            username={post.username}
            title={post.title}
            picUrl={post.picUrl}
            updateUpvotes={updateUpvotes}
            updateDownvotes={updateDownvotes}
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
