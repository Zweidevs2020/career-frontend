// import React, { useState } from 'react'
// import './CvCoverLetter.css';
// import { Steps } from 'antd';

// const CvCoverLetter = () => {
//     const {Step} = Steps
//     const [current, setCurrent] = useState(1);
//   return (
//     <div>
//       <Steps current={current} labelPlacement='vertical' onChange={(c)=>{
//         setCurrent(c)
//       }} >
//         <Step title='finished' ></Step>
//         <Step title='finished' ></Step>
//         <Step title='finished' ></Step>
//         <Step title='finished' ></Step>
//         <Step title='finished' ></Step>
//         <Step title='finished' ></Step>
//       </Steps>
//     </div>
//   )
// }

// export default CvCoverLetter
import { Button, message, Steps, theme } from 'antd';
import { useState } from 'react';
import PersonalProfile from './PersonalProfile/PersonalProfile';
const steps = [
  {
    title: 'Personal Profile',
    content: <PersonalProfile/>,
  },
  {
    title: 'Education',
    content: 'Second-content',
  },
  {
    title: 'Work Experience',
    content: 'third-content',
  },
  {
    title: 'Skills',
    content: 'Fourth-content',
  },
  {
    title: 'Interest',
    content: 'Fifth-content',
  },
  {
    title: 'Refrences',
    content: 'sixth-content',
  },
];
const CvCoverLetter = () => {
//   const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <>
      <div class='h-[80px] w-[100%] flex flex-col justify-center' >
      <h1 class='font-bold text-[24px] ml-3 ' >CV/Cover Letter</h1>
      <p class='ml-3 text-[#737373]' >Lorem ipsum is a placeholder text commonly used to demonstrate.</p>
      </div>
      <Steps current={current} items={items} labelPlacement='horizontal' style={{marginTop:'5px'}} />
      <div style={{height:'580px', backgroundColor:'#F8FAFC',marginTop:'20px'}} >{steps[current].content}</div>
      <div
        style={{
          marginTop: 24,
        }}
      >
        {current < steps.length - 1 && (
          <Button style={{border:'1px solid grey',color:'black'}} type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type='primary' onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: '0 8px'
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
      </div>
    </>
  );
};
export default CvCoverLetter;
