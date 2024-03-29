import React from 'react';
import { Avatar } from 'antd';
import './view1.css';

const View1 = ({ user }) => {
  if (user === null) {
    user = {
      name: 'null',
      gender: 'null',
      age: 'null',
    }
  }
  return (
    <div id='view1' className='pane'>
      <div className='header'>User Profile</div>
      <div>
        <div className={'avatar-view'}>
          <Avatar shape="square" size={120} icon="user" />
        </div>
        <div className={'info-view'}>
          <div>name: {user.name}</div>
          <div>gender: {user.gender}</div>
          <div>age: {user.age}</div>
        </div>
      </div>
    </div>
  )
}

export default View1;