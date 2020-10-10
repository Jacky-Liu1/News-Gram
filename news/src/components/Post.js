import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { Card, CardContent } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import MessageIcon from '@material-ui/icons/Message';


function Post(props) {

  const [upvoted, setUpvoted] = useState(false);  // boolean
  const [downvoted, setDownvoted] = useState(false);  // boolean
  const [upvotes, setUpvotes] = useState(props.upvotes)  // integer
  const [downvotes, setDownvotes] = useState(props.downvotes) // integer

  return (
    <Card className="card">
      {/* avatar -> username*/}
      <CardContent className="card-content">
        <div className="post-header">
          <Avatar
            className="post-avatar"
            alt={props.username}
            src="/static/images/avart/1.png"
          />
          <h2 className="username">{props.username}</h2>

        </div>

        {/* Title */}
        <h2 className="post-title">{props.title}</h2>

        {/* Picture */}
        <img className="post-pic" src={props.picUrl} alt=""></img>

        {/* Upvote -> downvote -> comment (include counts) */}
        <div className='post-footer'>
          <ArrowUpwardIcon className={upvoted ? "up-arrow-green" : "up-arrow"} onClick={(e) => {
            setUpvoted(!upvoted)  // invert boolean   
            setDownvoted(false)
            //upvoted ? setUpvotes(upvotes - 1) : setUpvotes(upvotes + 1)
          }}
          />
          {upvotes - downvotes}
          <ArrowDownwardIcon className={downvoted ? "down-arrow-red" : "down-arrow"} onClick={(e) => {
            setDownvoted(!downvoted)  // invert boolean
            setUpvoted(false)
            //downvoted ? setDownvotes(downvotes - 1) : setDownvotes(downvotes + 1)
          }} />
          <MessageIcon className="message-icon" />
          <p>{props.commentCount} comments</p>
        </div>

        {/* Description */}
        <p className="description">{props.description}</p>
        {/* Date posted*/}
        <p className='date-posted'>{props.date}</p>
      </CardContent>
    </Card>



  )
}

export default Post
