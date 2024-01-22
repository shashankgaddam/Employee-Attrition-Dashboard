import React, { useState } from 'react';
import { Slider, Checkbox, Divider } from 'antd';
import './view3.css';

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['Male', 'Female', 'Unknown'];
const defaultCheckedList = ['Male', 'Female', 'Unknown'];

const View3 = ({ changeIncludedGender, changeGreaterThenAge }) => {
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);

    const onChangeCheckbox = checkedList => {
        setCheckedList(checkedList);
        setIndeterminate(!!checkedList.length && checkedList.length < plainOptions.length);
        setCheckAll(checkedList.length === plainOptions.length);
        changeIncludedGender(checkedList);
    };

    const onCheckAllChange = e => {
        const checkedList = e.target.checked ? plainOptions : [];
        setCheckedList(checkedList);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
        changeIncludedGender(checkedList);
    };

    const onChangeSilder = value => {
        setSliderValue(value);
        changeGreaterThenAge(value);
    }

    return (
        <div id='view3' className='pane'>
            <div className='header'>Filter</div>
            <h3>Gender</h3>
            <div style={{ width: 275, margin: 5 }}>
                <Checkbox
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}
                >
                    Check all
                </Checkbox>
            </div>
            <br />
            <div style={{ width: 275, margin: 5 }}>
                <CheckboxGroup
                    options={plainOptions}
                    value={checkedList}
                    onChange={onChangeCheckbox}
                />
            </div>
            <Divider />
            <h3>Age</h3>
            <Slider defaultValue={0} onChange={onChangeSilder} value={sliderValue} />
        </div>
    )
}

export default View3;
