import React from 'react';
import { List } from 'antd';
import './view6.css';

const View6 = ({ data, changeSelectUser }) => {
  const selectUser = (user) => {
    changeSelectUser(user);
  };

  return (
    <div id='view6' className='pane'>
      <div className='header'>User List</div>
      <List
        size="small"
        bordered
        dataSource={data}
        renderItem={(user) => (
          <List.Item onClick={() => selectUser(user)}>
            <div>{`${user.name}: ${user.age}`}</div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default View6;