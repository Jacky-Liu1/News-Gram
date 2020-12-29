import React, { useState, useEffect } from 'react';
import './App.css';
import DonutSmallIcon from '@material-ui/icons/DonutSmall';
import Post from './components/Post';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { Card, CardContent } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import Pusher from 'pusher-js';
import * as tf from '@tensorflow/tfjs';


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



  // tensorflow js stuff
  const [metadata, setMetadata] = useState({});
  const [model, setModel] = useState(null);

  const url = {
    model: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
    metadata: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
  };
  async function loadModel(url) {
    try {
      const model = await tf.loadLayersModel(url.model);
      setModel(model);
    }
    catch (err) {
      console.log(err);
    }
  }
  async function loadMetadata(url) {
    try {
      const metadataJson = await fetch(url.metadata);
      /* const metadata = await metadataJson.json(); */
      setMetadata(metadataJson.json());
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadModel(url)
    loadMetadata(url)
    /*
    tf.ready().then(() => {
      loadModel(url)
      loadMetadata(url)
    });
    */
  }, [])


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

  // Pusher
  useEffect(() => {
    const pusher = new Pusher('6254f7eca7cde94bcdb7', {
      cluster: 'us2'
    });

    const channel = pusher.subscribe('posts');
    channel.bind('inserted', function (newPost) {
      const metadata = fetch("https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json").
        then((res) => res.json())
        .then((data) => {
          return data;
        })
      console.log("reach psuher")
      console.log(model);
      console.log(metadata);
      const inputText = newPost.description.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');
      const OOV_INDEX = 2;
      const sequence = inputText.map(word => {
        console.log("test");
        console.log(word);
        console.log(metadata)
        console.log(metadata.word_index["grandeur"]);
        let wordIndex = metadata.word_index[word] + metadata.index_from;
        console.log(wordIndex);
        if (wordIndex > metadata.vocabulary_size) {
          wordIndex = OOV_INDEX;
        }
        return wordIndex;
      });
      const PAD_INDEX = 0;
      const padSequences = (sequences, maxLen, padding = 'pre', truncating = 'pre', value = PAD_INDEX) => {
        return sequences.map(seq => {
          if (seq.length > maxLen) {
            if (truncating === 'pre') {
              seq.splice(0, seq.length - maxLen);
            } else {
              seq.splice(maxLen, seq.length - maxLen);
            }
          }
          if (seq.length < maxLen) {
            const pad = [];
            for (let i = 0; i < maxLen - seq.length; ++i) {
              pad.push(value);
            }
            if (padding === 'pre') {
              seq = pad.concat(seq);
            } else {
              seq = seq.concat(pad);
            }
          }
          return seq;
        });
      }
      const paddedSequence = padSequences([sequence], metadata.max_len);
      const input = tf.tensor2d(paddedSequence, [1, metadata.max_len]);
      const predictOut = model.predict(input);
      const score = predictOut.dataSync()[0];
      console.log(score);
      predictOut.dispose();
      setPosts([...posts, newPost])
    })
  }, [posts])


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
    console.log("before", upvotes)
    setUpvotes(upvotes + 1)
    console.log("after", upvotes)
    const updateData = {
      "upvotes": upvotes,
      "test": "testing put"
    }
    return fetch('http://localhost:9000/NewsGram/posts/api/123456', {
      method: 'PUT',
      body: JSON.stringify(updateData),
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
